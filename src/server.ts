import express from "express";
import { initializeDatabase } from "./database";
import api from "./routes/index";
import { config } from "./modules/config";

const PORT: number = 3001;
export const MAX_TABLE_TIME = 120 * 60 * 1000 // 2 hours In mils
export const MAX_TABLE_DELAY = 20 * 60 * 1000 // 20 minutes In mils

const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/", api);

const startServer = async () => {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on http://0.0.0.0:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('SIGINT', () => {
    const db = require('./database').getDatabase();
    db.close((err: Error) => {
        if (err) {
            console.error(err.message);
            return;
        }

        console.log('Closed the database connection.');
        process.exit(0);
    });
});

startServer();

const getTodayOrdersRequest = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/orders/?today=true', {
        method: "GET"
      });
      
      const data = await response.json();
    } catch (error) {
      console.error('Request failed:', error);
    }
};

// TODO fix
setInterval(getTodayOrdersRequest, 1 * 20 * 1000); // 1 minute in mils