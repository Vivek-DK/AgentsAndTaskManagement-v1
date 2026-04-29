import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";

type ParsedRow = {
  FirstName: string;
  Phone: string;
  Notes?: string;
};

const parseFile = (filePath: string): Promise<ParsedRow[]> => {
  return new Promise((resolve, reject) => {
    const results: ParsedRow[] = [];

    if (filePath.endsWith(".csv")) {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data: any) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", reject);
    } else {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];

      const data = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      ) as ParsedRow[];

      resolve(data);
    }
  });
};

export default parseFile;