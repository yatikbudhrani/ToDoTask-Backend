import cron from "node-cron";
import { Task } from "../Models/taskModel.js";
import { sendEmail } from "../Config/SendMail.js";
import { scheduleTask } from "../Config/cronConfig.js";
import { v4 as uuidv4 } from "uuid";

let tasks = [];

/**
 * Creates a new task based on the request body parameters, saves it, and schedules it.
 * @param {Object} req - The request object containing task details in the body.
 * @param {Object} res - The response object to send back the result of task creation.
 * @returns None
 */
export const CreateTask = async (req, res) => {
  try {
    const { name, schedule, email, message, expiration } = req.body;
    console.log("req body is ", req.body);
    // Validate input
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "All the mandetory fields are required." });
    }
    const taskId = uuidv4();
    console.log("generated taskid ", taskId);
    // Add task to in-memory tasks array (optional: save to DB instead)
    tasks.push({ name, schedule, email, message });
    const task = new Task({
      taskId,
      name,
      schedule,
      email,
      message,
      expiration: "",
    });
    await task.save();
    scheduleTask(task);
    console.log("task created sucessfully ");
    res
      .status(201)
      .json({ message: "Task created and scheduled successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Edit a task with the provided UUID and update its name, schedule, email, and message.
 * @param {Object} req - The request object containing the task details in the body.
 * @param {Object} res - The response object to send back the result of the operation.
 * @returns None
 * @throws {Error} If there is an error while editing the task.
 */
export const editTask = async (req, res) => {
  try {
    const { uuid, name, schedule, email, message } = req.body;

    // Find the task by UUID
    const task = await Task.findOne({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Update task details
    task.name = name || task.name;
    task.schedule = schedule || task.schedule;
    task.email = email || task.email;
    task.message = message || task.message;

    await task.save(); // Save updated task

    res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Deletes a task and its associated task logs from the database.
 * @param {Object} req - The request object containing the task UUID in the body.
 * @param {Object} res - The response object to send back the result of the deletion.
 * @returns None
 * @throws {Error} If there is an error during the deletion process.
 */
export const deleteTask = async (req, res) => {
  try {
    const { uuid } = req.body;
    const task = await Task.findOneAndDelete({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Optionally, delete associated logs (if needed)
    await TaskLog.deleteMany({ taskId: task._id });

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Retrieves all tasks from the database and sends them as a JSON response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves once the tasks are fetched and sent as a response.
 */
export const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Logs the execution time of a cron job.
 * @returns None
 */
export const getTaskById = () => {
  console.log("Cron job executed at:", new Date().toLocaleString());
};

/**
 * Asynchronously stops a task based on the UUID provided in the request body.
 * If the task is found, its status is updated to "stopped" and saved.
 * @param {Object} req - The request object containing the UUID of the task to stop.
 * @param {Object} res - The response object to send the result of the operation.
 * @returns None
 */
export const stopTask = async (req, res) => {
  try {
    const { uuid } = req.body;
    const task = await Task.findOne({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    // Update task status to "stopped"
    task.status = "stopped";
    await task.save();

    res.status(200).json({ message: "Task stopped successfully." });
  } catch (error) {
    console.error("Error stopping task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Starts a task by setting its status to "active" in the database.
 * @param {Object} req - The request object containing the task UUID in the body.
 * @param {Object} res - The response object to send back the result.
 * @returns None
 * @throws {Error} If there is an error finding or updating the task in the database.
 */
export const startTask = async (req, res) => {
  try {
    const { uuid } = req.body;
    const task = await Task.findOne({ uuid });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    // Update task status to "stopped"
    task.status = "active";
    await task.save();

    res.status(200).json({ message: "Task Activated successfully." });
  } catch (error) {
    console.error("Error stopping task:", error);
    res.status(500).json({ message: "Server error" });
  }
};
