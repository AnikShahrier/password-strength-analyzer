const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(409).json({
      success: false,
      message: 'Foreign key constraint violation'
    });
  }
  
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'MySQL authentication failed - check your credentials'
    });
  }
  
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_BAD_DB_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'MySQL connection failed - check if MySQL server is running'
    });
  }
  
  if (err.code === 'ER_BAD_FIELD_ERROR') {
    return res.status(500).json({
      success: false,
      message: 'Database schema mismatch - please run the schema script'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;