// converter.mjs
import * as XLSX from "xlsx";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Создаем папку для результатов, если её нет
const outputDir = `${__dirname}/src/data/cables`;
/*const outputDir = `${__dirname}/src/data`;*/
if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Создана папка: ${outputDir}`);
}

// Читаем Excel файл
const fileBuffer = readFileSync("SCAB_S.xlsx");
const workbook = XLSX.read(fileBuffer, { type: "buffer" });

// Функция для парсинга массивов
const parseMaybeArray = (value) => {
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            return value
                .replace(/[\[\]"]/g, "")
                .split(",")
                .map(v => v.trim())
                .filter(Boolean);
        }
    }
    return Array.isArray(value) ? value : [value];
};

// Функция для нормализации данных кабеля
const normalizeCableData = (item) => {
    const fixedItem = { ...item };

    // Преобразуем числовые поля
    if (fixedItem.cores) fixedItem.cores = Number(fixedItem.cores);
    if (fixedItem.coreSection) fixedItem.coreSection = Number(fixedItem.coreSection);
    if (fixedItem.outerDiameter) fixedItem.outerDiameter = Number(fixedItem.outerDiameter);

    // Парсим массивы если есть
    if ("compatibleSuspensions" in fixedItem) {
        fixedItem.compatibleSuspensions = parseMaybeArray(fixedItem.compatibleSuspensions);
    }
    if ("compatibleSurfaces" in fixedItem) {
        fixedItem.compatibleSurfaces = parseMaybeArray(fixedItem.compatibleSurfaces);
    }
    if ("oklType" in fixedItem) {
        fixedItem.oklType = parseMaybeArray(fixedItem.oklType);
    }

    return fixedItem;
};

// Обрабатываем каждый лист
workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`📊 Обрабатываем лист ${index + 1}/${workbook.SheetNames.length}: ${sheetName}`);

    const sheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(sheet);

    // Пропускаем пустые листы
    if (data.length === 0) {
        console.log(`⏭️  Пропускаем пустой лист: ${sheetName}`);
        return;
    }

    // Нормализуем данные
    data = data.map(normalizeCableData);

    // Создаем имя файла на основе имени листа
    const fileName = sheetName.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

    const outputPath = `${outputDir}/${fileName}.json`;

    // Сохраняем JSON файл
    writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`✅ Создан файл: ${fileName}.json (${data.length} записей)`);
});

console.log(`🎉 Конвертация завершена! Создано ${workbook.SheetNames.length} файлов в ${outputDir}`);


/*
node converter.mjs

import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "fs";

// читаем бинарное содержимое Excel
const fileBuffer = readFileSync("cables.xlsx");

// создаём workbook
const workbook = XLSX.read(fileBuffer, { type: "buffer" });

// получаем первый лист
const sheetName = workbook.SheetNames[7];
const sheet = workbook.Sheets[sheetName];

// конвертируем в JSON
let data = XLSX.utils.sheet_to_json(sheet);

// 🧠 Исправляем поля compatibleSuspensions и compatibleSurfaces
data = data.map(item => {
    const fixedItem = { ...item };

    const parseMaybeArray = (value) => {
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                // Попробуем вручную убрать скобки и кавычки
                return value
                    .replace(/[\[\]"]/g, "")
                    .split(",")
                    .map(v => v.trim())
                    .filter(Boolean);
            }
        }
        return Array.isArray(value) ? value : [value];
    };

    if ("compatibleSuspensions" in fixedItem) {
        fixedItem.compatibleSuspensions = parseMaybeArray(fixedItem.compatibleSuspensions);
    }

    if ("compatibleSurfaces" in fixedItem) {
        fixedItem.compatibleSurfaces = parseMaybeArray(fixedItem.compatibleSurfaces);
    }

    if ("oklType" in fixedItem) {
        fixedItem.oklType = parseMaybeArray(fixedItem.oklType);
    }

    return fixedItem;
});

console.log(data);

// сохраняем JSON в файл
writeFileSync("cables.json", JSON.stringify(data, null, 2), "utf8");
console.log("✅ Конвертация завершена: OKL_DB.json создан");
*/

/*
import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "fs";

// читаем бинарное содержимое Excel
const fileBuffer = readFileSync("OKL_DB.xlsx");

// создаём workbook
const workbook = XLSX.read(fileBuffer, { type: "buffer" });

// получаем первый лист
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// конвертируем в JSON
const data = XLSX.utils.sheet_to_json(sheet);

console.log(data);

// сохраняем JSON в файл
writeFileSync("OKL_DB.json", JSON.stringify(data, null, 2), "utf8");
console.log("✅ Конвертация завершена: OKL.json создан");
 */
