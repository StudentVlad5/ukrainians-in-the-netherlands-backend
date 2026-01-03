import Specialist from "../models/specialist.model.js";

export const getPublicSpecialists = async (req, res) => {
  try {
    let specialists = [];
    const limit = parseInt(req.query.limit);
    if (limit) {
      specialists = await Specialist.find({ isActive: true })
        .sort({ rating: -1 })
        .limit(limit);
    } else {
      specialists = await Specialist.find({ isActive: true }).sort({
        rating: -1,
      });
    }
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProductsWithLimits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8; // Співпадає з фронтендом
    const skip = (page - 1) * limit;

    // Отримуємо продукти
    const products = await Product.find({ status: "active" })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Отримуємо загальну кількість активних продуктів
    const total = await Product.countDocuments({ status: "active" });

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** READ ONE */
export const getPublicSpecialistById = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import Product from "../models/product.model.js";

export const getPublicProducts = async (req, res) => {
  try {
    let products = [];
    const limit = parseInt(req.query.limit);
    if (limit) {
      products = await Product.find({ status: "active" })
        .sort({ updatedAt: -1 })
        .limit(limit);
    } else {
      products = await Product.find({ status: "active" }).sort({
        updatedAt: -1,
      });
    }
    console.log("products", products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** READ ONE */
export const getPublicProductById = async (req, res) => {
  try {
    // Шукаємо продукт і через populate додаємо дані автора
    // Припускаємо, що модель автора називається User або Specialist
    const product = await Product.findById(req.params.id).populate({
      path: "user",
      select: "name phone telegram whatsapp email", // вибираємо лише потрібні поля
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SERVICES
export const gePublicServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const specialists = await Specialist.find({ isActive: true })
      .select("name specialty imageUrl minOrder languages location portfolio")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const total = await Specialist.countDocuments({ isActive: true });

    const services = specialists.map((item) => {
      const displayImage =
        item.portfolio && item.portfolio.length > 0
          ? item.portfolio[0]
          : item.imageUrl;

      return {
        id: item._id,
        image: displayImage,
        name: item.name,
        specialty: item.specialty,
        price: item.minOrder,
        languages: item.languages,
        location: item.location?.address || "",
        profileLink: `${item._id}`,
      };
    });

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Помилка при отриманні списку сервісів",
      error: error.message,
    });
  }
};
