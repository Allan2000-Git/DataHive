import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.monthly(
    "clear files table",
    { day: 30, hourUTC: 0, minuteUTC: 0 }, // Every 30 days at 12:00am UTC
    internal.files.deleteAllFiles
);

export default crons;