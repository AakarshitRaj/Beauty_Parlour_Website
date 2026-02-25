const Gallery = require('../models/Gallery');
const { cloudinary } = require('../config/cloudinary');

const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ gallery: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addGalleryItem = async (req, res) => {
  try {
    const { title, category, isPromotion, promotionText, order } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const item = await Gallery.create({
      title,
      category,
      isPromotion: isPromotion === 'true',
      promotionText,
      order: order || 0,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
    });
    res.status(201).json({ message: 'Gallery item added', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId);
    await item.deleteOne();
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGallery, addGalleryItem, deleteGalleryItem };
