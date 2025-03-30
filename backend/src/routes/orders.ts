import express, { Request, Response } from 'express';
import { getDatabase } from "../database";
import { OrdersResponse } from '../modules/order';

const router = express.Router();
const db = getDatabase();

router.get("/", (req: Request, res: Response): void => {
    const deleteQuery = `
    DELETE FROM orders
    WHERE time <= DATETIME('now', '-2 hours')
    OR (time <= DATETIME('now', '-20 minutes') AND active = 0);
    `;
    db.run(deleteQuery, [], (err) => {
        if (err) {
            return res.status(500).json({ 
                error: "Error deleting old orders.",
                details: err.message 
            });
        }
    });

    const today: boolean = req.query.today === "true"; 
    let query = `
        SELECT 
            o.id AS order_id, 
            o.table_num, 
            o.time, 
            o.note, 
            o.active,
            c.id AS customer_id, 
            c.name, 
            c.phone_number, 
            c.guests
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        ${today ? "WHERE DATE(o.time) = DATE('now', 'localtime')" : ""}
    `;

    const params: any[] = [];
    
    db.all(query, params, (err: Error, rows: OrdersResponse[]) => {
        if (err) {
            return res.status(500).json({ 
                error: "Error fetching orders.",
                details: err.message 
            });
        }

        res.json(rows);
    });
});

export default router;
