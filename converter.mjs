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
