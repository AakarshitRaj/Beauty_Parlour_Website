const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, adminOnly, upload.single('image'), createService);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
