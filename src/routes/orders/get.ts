import { Request, Response } from "express";
import { getDatabase } from "../../database";
import { Order } from "../../modules/order";
import { removeOrder } from "../../services/order";
import { MAX_TABLE_TIME, MAX_TABLE_DELAY } from "../../server";
import { removeEvent } from "../../services/calendar";

const db = getDatabase();

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    const today: boolean = req.query.today === "true";
    const query = `
        SELECT o.id AS orderId, o.tableNumber, o.time, o.note, o.status, o.googleToken, o.eventId,
               c.id AS customerId, c.name, c.phoneNumber, c.guests
        FROM orders o
        JOIN customers c ON o.customerId = c.id
        ${today ? "WHERE DATE(o.time) = DATE('now', 'localtime')" : ""}
    `;

    try {
        db.all(query, [], async (err: Error, rows: Order[]) => {
            if (err) {
                return res.status(500).json({ error: "Error fetching orders.", details: err.message });
            }

            for (const row of rows) {
                const currentTime: number = Date.now();
                const orderTime: number = new Date(row.time).getTime();
                
                const delta: number = row.status === 1 ? MAX_TABLE_TIME : MAX_TABLE_DELAY
                const timeDifference: number = (orderTime + delta);

                if (
                    (row.status === 1 && currentTime >= timeDifference) ||  
                    (row.status === 0 && currentTime >= timeDifference)   
                ) {
                    await removeOrder(row);
                    await removeEvent(row);
                }
            }

            res.json(rows);
        });
    } catch (error: any) {
        res.status(500).json({ error: "Unexpected error occurred.", details: error.message });
    }
};
