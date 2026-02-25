const Service = require('../models/Service');
const { cloudinary } = require('../config/cloudinary');

// @desc Get all active services
const getServices = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single service
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create service (admin)
const createService = async (req, res) => {
  try {
    const { name, description, category, duration, price } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const imagePublicId = req.file ? req.file.filename : '';

    const service = await Service.create({ name, description, category, duration, price, imageUrl, imagePublicId });
    res.status(201).json({ message: 'Service created', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update service (admin)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const { name, description, category, duration, price, isActive } = req.body;

    if (req.file) {
      if (service.imagePublicId) await cloudinary.uploader.destroy(service.imagePublicId);
      service.imageUrl = req.file.path;
      service.imagePublicId = req.file.filename;
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.category = category || service.category;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();
    res.json({ message: 'Service updated', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete service (admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.imagePublicId) await cloudinary.uploader.destroy(service.imagePublicId);
    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices, getService, createService, updateService, deleteService };
