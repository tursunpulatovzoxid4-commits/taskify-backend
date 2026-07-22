/**
 * Har bir async controller funksiyasida try/catch yozmaslik uchun wrapper.
 * Ichkarida yuzaga kelgan xatolikni avtomatik ravishda next() orqali
 * errorHandler middleware'ga uzatadi.
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
