/**
 * Controllerlar ichida `throw new ApiError(404, "Topilmadi")` kabi ishlatiladi.
 * errorHandler middleware bu klassni tanib, to'g'ri status kod bilan javob qaytaradi.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
