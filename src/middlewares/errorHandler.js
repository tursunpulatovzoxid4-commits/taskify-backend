/**
 * Route topilmasa (404) ishlaydigan middleware. app.js da barcha route'lardan
 * KEYIN ulanadi.
 */
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route topilmadi: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Loyihadagi barcha xatoliklar shu yerga tushadi (asyncHandler orqali yoki
 * next(error) chaqirilganda). Express bu middleware'ni 4 ta argumentidan
 * (err, req, res, next) tanib, xatolik uchun ishlatadi.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  console.error(`[XATOLIK] ${req.method} ${req.originalUrl} ->`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Serverda kutilmagan xatolik yuz berdi.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };
