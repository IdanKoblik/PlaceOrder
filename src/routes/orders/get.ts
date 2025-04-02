import { Request, Response } from "express";
import { getDatabase } from "../../database";
import { OrdersResponse, RemoveOrderRequest } from "../../modules/order";
import { decryptToken } from "../../utils/crypto";
import { removeOrder } from "../../services/order";
import { MAX_TABLE_TIME, MAX_TABLE_DELAY } from "../../server";

const db = getDatabase();

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    const today: boolean = req.query.today === "true";
    const query = `
        SELECT o.id AS order_id, o.table_num, o.time, o.note, o.active, o.token, o.event_id,
               c.id AS customer_id, c.name, c.phone_number, c.guests
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        ${today ? "WHERE DATE(o.time) = DATE('now', 'localtime')" : ""}
    `;

    try {
        db.all(query, [], async (err: Error, rows: RemoveOrderRequest[]) => {
            if (err) {
                return res.status(500).json({ error: "Error fetching orders.", details: err.message });
            }

            for (const row of rows) {
                const currentTime: number = Date.now();
                const orderTime: number = new Date(row.time).getTime();
                
                const delta: number = row.active === 1 ? MAX_TABLE_TIME : MAX_TABLE_DELAY
                const timeDifference: number = (orderTime + delta);

                if (
                    (row.active === 1 && currentTime >= timeDifference) ||  
                    (row.active === 0 && currentTime >= timeDifference)   
                ) {
                    const removeOrderRequest: RemoveOrderRequest = {
                        ...row,
                        token: decryptToken(row.token),
                    };

                    await removeOrder(removeOrderRequest);
                }
            }

            res.json(rows);
        });
    } catch (error: any) {
        res.status(500).json({ error: "Unexpected error occurred.", details: error.message });
    }
};
