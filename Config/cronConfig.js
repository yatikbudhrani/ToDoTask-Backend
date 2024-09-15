import cron from "node-cron";
import { Task, TaskLog } from "../Models/taskModel.js";
import { sendEmail } from "./SendMail.js";
import logger from "../Config/logger.js";

/**
 * Schedule a task to run based on the provided schedule using cron.
 * This function will send an email with the task details and log the task execution.
 * @param {Object} task - The task object containing schedule, email, message, and taskId.
 * @returns None
 */
export const scheduleTask = async (task) => {
  const job = cron.schedule(task.schedule, async () => {
    try {
      await sendEmail(task.email, "Scheduled Task", task.message);

      // Log successful execution
      const tasklog = new TaskLog({
        taskId: task.taskId,
        executedAt: new Date(),
        status: "success",
      });
      await tasklog.save();

      logger.info(
        `Task ${
          task.name
        } executed successfully at ${new Date().toLocaleString()}`,
        {
          taskId: task.taskId,
          status: "success",
        }
      );
    } catch (error) {
      // Log failed execution
      const tasklog = new TaskLog({
        taskId: task.taskId,
        executedAt: new Date(),
        status: "failure",
      });
      await tasklog.save();
      logger.error(
        `Task ${task.name} failed at ${new Date().toLocaleString()}: ${
          error.message
        }`,
        {
          taskId: task.taskId,
          error: error.message,
          status: "failure",
        }
      );
    }
  });

  job.start();
};

/**
 * Initializes active tasks by fetching them from the database, scheduling each task,
 * and logging the results.
 * @returns None
 */
export const initializeTasks = async () => {
  try {
    const tasks = await Task.find({ status: "active" });
    console.log("All the active taskes here ", tasks);
    tasks.forEach((task) => scheduleTask(task));
    logger.info("All active tasks initialized successfully.");
  } catch (error) {
    logger.error("Error initializing tasks:", {
      error: error.message,
    });
  }
};
