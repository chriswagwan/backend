const mongoose = require("mongoose");

const validateObjectId = (paramName = "id") => (req, res, next) => {
  const value = req.params?.[paramName];

  if (!value) {
    res.status(400);
    next(new Error(`Missing ${paramName}`));
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    res.status(400);
    next(new Error(`Invalid ${paramName}`));
    return;
  }

  next();
};

module.exports = validateObjectId;
