const errorHandler = (err, req, res, next) => {
  console.error('Error details:', err);

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  }

  // Handle Cloudinary errors
  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'Image upload service error',
      error: err.message
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};

module.exports = errorHandler; 