import { Request, Response } from "express";
import fs from "fs";
import parseFile from "../utils/fileParser";
import distributeTasks from "../services/distributionService";
import { Agent } from "../models/Agent";
import { Task } from "../models/Task";
import { taskSchema } from "../validators/task.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

type ParsedTask = {
  FirstName: string;
  Phone: string;
  Notes?: string;
};

// 🔥 NORMALIZATION (CRITICAL FIX)
const normalizeTask = (item: any): ParsedTask => {
  let phone = item.Phone;

  // convert to string safely
  phone = String(phone || "").trim();

  // handle Excel scientific notation (e.g., 9.88E+09)
  if (/e\+?/i.test(phone)) {
    phone = Number(phone).toFixed(0);
  }

  // remove non-digits (spaces, symbols, etc.)
  phone = phone.replace(/\D/g, "");

  return {
    FirstName: String(item.FirstName || "").trim(),
    Phone: phone,
    Notes: item.Notes ? String(item.Notes).trim() : "",
  };
};

export const uploadAndDistribute = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("File is required", 400);
    }

    const filePath = req.file.path;

    try {
      // 🔥 validate extension
      const allowedExtensions = [".csv", ".xlsx", ".xls"];
      const isValidFile = allowedExtensions.some((ext) =>
        req.file!.originalname.toLowerCase().endsWith(ext)
      );

      if (!isValidFile) {
        throw new AppError("Only CSV, XLSX or XLS files are allowed", 400);
      }

      // 🔥 parse file
      const data: ParsedTask[] = await parseFile(filePath);

      if (!data.length) {
        throw new AppError("File is empty", 400);
      }

      // 🔥 validate headers
      const requiredHeaders = ["FirstName", "Phone", "Notes"];
      const fileHeaders = Object.keys(data[0]);

      const isValidHeaders = requiredHeaders.every((h) =>
        fileHeaders.includes(h)
      );

      if (!isValidHeaders) {
        throw new AppError(
          "Invalid format. Required headers: FirstName, Phone, Notes",
          400
        );
      }

      // 🔥 NORMALIZE + VALIDATE
      const cleanedData: ParsedTask[] = [];

      for (const rawItem of data) {
        const item = normalizeTask(rawItem);

        const { error } = taskSchema.validate(item);

        if (error) {
          throw new AppError(
            `Invalid data for ${item.FirstName || "row"}`,
            400
          );
        }

        cleanedData.push(item);
      }

      // 🔥 fetch active agents
      const agents = await Agent.find({ isActive: true }).lean();

      if (!agents.length) {
        throw new AppError("No active agents available", 400);
      }

      // 🔥 distribute tasks
      const distributedData = distributeTasks(cleanedData, agents);

      const tasksToInsert = distributedData.map((task) => ({
        FirstName: task.FirstName,
        Phone: task.Phone,
        Notes: task.Notes,
        agent: task.agent,
      }));

      // 🔥 bulk insert
      await Task.insertMany(tasksToInsert);

      res.json({
        message: "Tasks distributed successfully",
        totalTasks: tasksToInsert.length,
      });
    } finally {
      // 🔥 ALWAYS CLEAN FILE (safe cleanup)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
);