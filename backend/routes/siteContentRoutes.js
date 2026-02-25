const express = require('express');
const router = express.Router();
const { getSiteContent, updateSiteContent } = require('../controllers/siteContentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getSiteContent);
router.put('/', protect, adminOnly, upload.single('heroImage'), updateSiteContent);

module.exports = router;
