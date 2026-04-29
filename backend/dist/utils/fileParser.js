"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const xlsx_1 = __importDefault(require("xlsx"));
const parseFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        if (filePath.endsWith(".csv")) {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (data) => results.push(data))
                .on("end", () => resolve(results))
                .on("error", reject);
        }
        else {
            const workbook = xlsx_1.default.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
            resolve(data);
        }
    });
};
exports.default = parseFile;
