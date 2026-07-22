const fs = require("fs/promises");
const path = require("path");

/**
 * Berilgan JSON faylni o'qiydi.
 * Agar fayl mavjud bo'lmasa yoki bo'sh/buzilgan bo'lsa, xatolik tashlamasdan
 * bo'sh massiv ([]) qaytaradi — bu loyihani ishga tushirishni osonlashtiradi.
 * @param {string} filePath - data/ papkasidagi faylga to'liq yo'l
 * @returns {Promise<Array<Object>>}
 */
async function readJSON(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");

    // Fayl mavjud, lekin bo'sh bo'lishi mumkin
    if (!raw || raw.trim() === "") {
      return [];
    }

    return JSON.parse(raw);
  } catch (error) {
    // Fayl umuman topilmasa - uni yaratib, bo'sh massiv qaytaramiz
    if (error.code === "ENOENT") {
      await writeJSON(filePath, []);
      return [];
    }

    // JSON buzilgan bo'lsa - aniq xabar bilan xatolik chiqaramiz
    if (error instanceof SyntaxError) {
      throw new Error(
        `"${path.basename(filePath)}" fayli buzilgan yoki noto'g'ri JSON formatda: ${error.message}`
      );
    }

    throw error;
  }
}

/**
 * Berilgan ma'lumotni JSON fayliga yozadi (chiroyli formatlash bilan).
 * @param {string} filePath - data/ papkasidagi faylga to'liq yo'l
 * @param {Array<Object>|Object} data - yoziladigan ma'lumot
 */
async function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readJSON, writeJSON };
