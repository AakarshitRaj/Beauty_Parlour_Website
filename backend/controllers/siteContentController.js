const SiteContent = require('../models/SiteContent');

const getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    res.json({ content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = new SiteContent();

    const textFields = ['heroTitle', 'heroSubtitle', 'heroImage', 'aboutTitle', 'aboutText', 'contactEmail', 'contactPhone', 'address'];
    const jsonFields = ['testimonials', 'socialLinks', 'promotions'];

    // Plain text fields
    textFields.forEach(field => {
      if (req.body[field] !== undefined) content[field] = req.body[field];
    });

    // JSON fields — frontend sends them as JSON strings via FormData
    jsonFields.forEach(field => {
      if (req.body[field] !== undefined) {
        try {
          content[field] = typeof req.body[field] === 'string'
            ? JSON.parse(req.body[field])
            : req.body[field];
        } catch (e) {
          console.error(`Failed to parse ${field}:`, e.message);
        }
      }
    });

    // Hero image upload via Cloudinary
    if (req.file) content.heroImage = req.file.path;

    await content.save();
    res.json({ message: 'Site content updated', content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSiteContent, updateSiteContent };