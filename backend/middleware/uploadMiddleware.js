const { upload } = require('../config/cloudinary');

const uploadSingle = (fieldName = 'image') => upload.single(fieldName);
const uploadMultiple = (fieldName = 'images', maxCount = 10) => upload.array(fieldName, maxCount);

module.exports = { uploadSingle, uploadMultiple };
