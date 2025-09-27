import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "fs";

// читаем бинарное содержимое Excel
const fileBuffer = readFileSync("cables.xlsx");

// создаём workbook
const workbook = XLSX.read(fileBuffer, { type: "buffer" });

// получаем первый лист
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// конвертируем в JSON
const data = XLSX.utils.sheet_to_json(sheet);

console.log(data);

// сохраняем JSON в файл
writeFileSync("cables.json", JSON.stringify(data, null, 2), "utf8");
console.log("✅ Конвертация завершена: cables.json создан");
 