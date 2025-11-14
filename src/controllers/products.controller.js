import Product from "../models/product.model";

export const createProduct = async (req, res) => {
  try {
    const { user } = req; // user.id якщо є auth middleware

    const {
      title,
      description,
      price,
      category,
      tags,
      location,
      deliveryOptions,
      condition,
    } = req.body;

    const images = req.files ? req.files.map((f) => f.path) : [];

    const product = await Product.create({
      user: user._id,
      title: JSON.parse(title),
      description: JSON.parse(description),
      price,
      category,
      tags: tags ? JSON.parse(tags) : [],
      images,
      location: JSON.parse(location),
      deliveryOptions: JSON.parse(deliveryOptions),
      condition,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ error: "Cannot create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, city, category, tag, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search) filter.$text = { $search: search };
    if (city) filter["location.city"] = city;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),

      Product.countDocuments(filter),
    ]);

    res.json({
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items,
    });
  } catch (err) {
    res.status(500).json({ error: "Cannot get products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Cannot load product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.title) updates.title = JSON.parse(updates.title);
    if (updates.description)
      updates.description = JSON.parse(updates.description);
    if (updates.location) updates.location = JSON.parse(updates.location);
    if (updates.deliveryOptions)
      updates.deliveryOptions = JSON.parse(updates.deliveryOptions);
    if (updates.tags) updates.tags = JSON.parse(updates.tags);

    if (req.files?.length > 0) {
      updates.images = req.files.map((f) => f.path);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Cannot update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Cannot delete product" });
  }
};

export const getProductsStats = async (req, res) => {
  try {
    const match = {};

    // Admin бачить всі
    // Saler — тільки свої
    if (req.user.role === "Saler") {
      match.user = req.user._id;
    }

    const stats = await Product.aggregate([
      { $match: match },
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { status: "active" } }, { $count: "count" }],
          inactive: [{ $match: { status: "inactive" } }, { $count: "count" }],
          topTags: [
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
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
