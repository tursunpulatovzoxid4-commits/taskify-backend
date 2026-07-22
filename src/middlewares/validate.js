const ApiError = require("../utils/ApiError");

/**
 * Oddiy validatsiya factory funksiyasi.
 * Misol: validateBody(["title", "projectId"]) - req.body da shu maydonlar
 * mavjudligini va bo'sh emasligini tekshiradi.
 */
function validateBody(requiredFields = []) {
  return (req, res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      throw new ApiError(
        400,
        `Quyidagi maydonlar to'ldirilishi shart: ${missing.join(", ")}`
      );
    }

    next();
  };
}

/**
 * Email formatini oddiy regex bilan tekshiradi.
 */
function validateEmail(req, res, next) {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    throw new ApiError(400, "Email formati noto'g'ri.");
  }

  next();
}

module.exports = { validateBody, validateEmail };
