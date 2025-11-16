import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { user } = req;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Missing 'data' field in body" });
    } else {
      const parsedData = JSON.parse(data);

      const {
        title,
        description,
        price,
        category,
        tags,
        location,
        deliveryOptions,
        condition,
      } = parsedData;

      if (!title || !description || !location || !price || !category) {
        return res.status(400).json({
          error:
            "Missing required fields (title, description, price, category or location)",
        });
      }
      const images = req.files ? req.files.map((f) => f.path) : [];

      const productData = {
        user: user.id,
        price,
        category,
        condition,
        images,
        title: { uk: title.uk, nl: title.nl, de: title.de, en: title.en },
        description: {
          uk: description.uk,
          nl: description.nl,
          de: description.de,
          en: description.en,
        },
        location: {
          city: location.city,
          postalCode: location.postalCode,
          address: location.address,
        },
        tags: Array.isArray(tags) ? tags.join(",") : "",
        deliveryOptions: deliveryOptions || { pickup: false, shipping: true },
      };
      const product = await Product.create(productData);

      res.status(201).json(product);
    }
  } catch (err) {
    console.error("Create product error:", err);
    if (err instanceof SyntaxError) {
      return res
        .status(400)
        .json({ error: "Invalid JSON format in form data" });
    }

    return res.status(500).json({ error: "Cannot create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      city,
      category,
      status,
      tag,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (search) filter.$text = { $search: search };
    if (city) filter["location.city"] = city;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (tag) filter.tags = { $regex: tag, $options: "i" };

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean(), // .lean() повертає JS об'єкти, а не Mongoose документи
      Product.countDocuments(filter),
    ]);

    const items = docs.map((item) => ({
      ...item,
      tags: item.tags ? item.tags.split(",") : [],
    }));

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
    const item = await Product.findById(req.params.id).lean();

    if (!item) return res.status(404).json({ error: "Not found" });
    item.tags = item.tags ? item.tags.split(",") : [];
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Cannot load product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { data } = req.body;
    let updates = {};
    if (data) {
      updates = JSON.parse(data);
    }
    if (updates.tags) {
      updates.tags = Array.isArray(updates.tags) ? updates.tags.join(",") : "";
    }
    if (req.files?.length > 0) {
      updates.images = req.files.map((f) => f.path);
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();
    if (updated) {
      updated.tags = updated.tags ? updated.tags.split(",") : [];
    }

    res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
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
            {
              $addFields: {
                // 1. Перетворюємо "tag1,tag2" на ["tag1", "tag2"]
                // $ifNull: обробляє випадки, коли tags - null
                tagsArray: {
                  $split: [{ $ifNull: ["$tags", ""] }, ","],
                },
              },
            },
            // 2. $unwind тепер працює з новим полем tagsArray
            { $unwind: "$tagsArray" },
            // 3. Перейменовуємо tagsArray назад на 'tags' для $group
            { $project: { tags: "$tagsArray" } },
            // 4. Фільтруємо порожні теги, які могли з'явитися
            { $match: { tags: { $ne: "" } } },
            // 5. Решта пайплайну працює як і раніше
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
