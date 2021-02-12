const failedValidation = (req, res, message) => {
  res.status(500).json({ success: false, message: message });
};

module.exports = {
  failedValidation,
};
