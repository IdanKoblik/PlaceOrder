import sqlite3 from "sqlite3";
import path from "node:path";

const dbFilePath = path.join(__dirname, "../../data/database.db");
const db = new sqlite3.Database(dbFilePath);

export const getDatabase = () => db;