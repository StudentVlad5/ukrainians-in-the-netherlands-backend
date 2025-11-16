import Service from "../models/service.model.js";

export const createService = async (req, res) => {
  try {
    const { user } = req;

    const {
      specialistName,
      serviceName,
      specialistDescription,
      serviceDescription,
      tags,
      location,
      pricingModel,
      price,
    } = req.body;

    const avatar = req.file?.path || null;

    const service = await Service.create({
      user: user._id,
      specialistName,
      serviceName: JSON.parse(serviceName),
      specialistDescription: specialistDescription
        ? JSON.parse(specialistDescription)
        : null,
      serviceDescription: JSON.parse(serviceDescription),
      tags: tags ? JSON.parse(tags) : [],
      avatar,
      location: JSON.parse(location),
      pricingModel,
      price,
    });

    res.status(201).json(service);
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ error: "Cannot create service" });
  }
};

export const getServices = async (req, res) => {
  try {
    const { search, city, tag, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) filter.$text = { $search: search };
    if (city) filter["location.city"] = city;
    if (tag) filter.tags = tag;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Service.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),

      Service.countDocuments(filter),
    ]);

    res.json({
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items,
    });
  } catch {
    res.status(500).json({ error: "Cannot get services" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const item = await Service.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Cannot load service" });
  }
};

export const updateService = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.serviceName)
      updates.serviceName = JSON.parse(updates.serviceName);
    if (updates.serviceDescription)
      updates.serviceDescription = JSON.parse(updates.serviceDescription);
    if (updates.specialistDescription)
      updates.specialistDescription = JSON.parse(updates.specialistDescription);
    if (updates.tags) updates.tags = JSON.parse(updates.tags);
    if (updates.location) updates.location = JSON.parse(updates.location);

    if (req.file) updates.avatar = req.file.path;

    const updated = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Cannot update service" });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Cannot delete service" });
  }
};

export const getServicesStats = async (req, res) => {
  try {
    const match = {};

    if (req.user.role === "Specialist") {
      match.user = req.user._id;
    }

    const stats = await Service.aggregate([
      { $match: match },
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { status: "active" } }, { $count: "count" }],
          inactive: [{ $match: { status: "inactive" } }, { $count: "count" }],
          topTags: [
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: 1 } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
        },
      },
    ]);

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: "Cannot get stats" });
  }
};
