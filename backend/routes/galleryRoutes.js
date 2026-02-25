const express = require('express');
const router = express.Router();
const { getGallery, addGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getGallery);
router.post('/', protect, adminOnly, upload.single('image'), addGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
