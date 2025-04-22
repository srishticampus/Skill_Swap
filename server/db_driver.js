import mongoose from "mongoose";
import pino from "pino";
mongoose.connect("mongodb://127.0.0.1:27017/skillswap");

let logger = pino();
let db = mongoose.connection;

db.on("error", logger.error.bind(logger, "connection error"));

db.once("open", logger.info.bind(logger, "connection open"));

export default db;
