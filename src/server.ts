import express from "express";
import { initializeDatabase } from "./database";
import { errorHandler } from "./middleware/errorHandler";
import createOrder from "./routes/create_order";
import removeOrder from "./routes/remove_order";

const PORT: number = 3000;
const app = express();

app.use(express.json());
app.use("/orders/create", createOrder);
app.use("/orders/remove", removeOrder);
app.use(errorHandler);

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