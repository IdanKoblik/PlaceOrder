import sqlite3 from "sqlite3";
import path from "node:path";

const dbFilePath = path.join(__dirname, "../../data/database.db");
const db = new sqlite3.Database(dbFilePath);

// Initialize database schema
const initializeDatabase = () => {
  // Create tables table
  db.run(`
    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      area TEXT NOT NULL CHECK (area IN ('bar', 'inside', 'outside')),
      min_capacity INTEGER NOT NULL,
      max_capacity INTEGER NOT NULL,
      is_adjustable INTEGER NOT NULL DEFAULT 0,
      position_x REAL NOT NULL,
      position_y REAL NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create customers table
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create reservations table
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      party_size INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    )
  `);

  // Create reservation_tables junction table
  db.run(`
    CREATE TABLE IF NOT EXISTS reservation_tables (
      id TEXT PRIMARY KEY,
      reservation_id TEXT NOT NULL,
      table_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reservation_id) REFERENCES reservations (id),
      FOREIGN KEY (table_id) REFERENCES tables (id),
      UNIQUE(reservation_id, table_id)
    )
  `);
};

// Initialize the database when this module is loaded
initializeDatabase();

export const getDatabase = () => db;