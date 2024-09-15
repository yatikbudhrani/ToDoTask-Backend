import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

/**
 * Defines the schema for a task in the MongoDB database.
 * @type {mongoose.Schema}
 */
const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "stopped"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiration: {
    type: Date,
  },
});

/**
 * Represents the schema for logging task execution in a MongoDB database.
 * @type {mongoose.Schema}
 */
const logSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    ref: "Task",
  },
  executedAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["success", "failure"],
    required: true,
  },
});

export const Task = mongoose.model("Task", taskSchema);
export const TaskLog = mongoose.model("TaskLog", logSchema);
