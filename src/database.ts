
import sqlite3 from "sqlite3";
import path from "node:path";

const dbFilePath = path.join(__dirname, "../restaurant.db");
const db = new sqlite3.Database(dbFilePath);

export const initializeDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS customers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    phone_number TEXT NOT NULL,
                    guests INTEGER NOT NULL
                )
            `, (err) => {
                if (err) return reject(err);

                db.run(`
                    CREATE TABLE IF NOT EXISTS orders (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        customer_id INTEGER,
                        table_num INTEGER,
                        time TEXT NOT NULL,
                        FOREIGN KEY (customer_id) REFERENCES customers(id)
                    )
                `, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    });
};

export const getDatabase = () => db;