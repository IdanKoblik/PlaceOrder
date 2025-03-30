import express, { Request, Response } from 'express';
import { getDatabase } from "../database";
import { RemoveOrderRequest } from '../modules/order';
import { checkTableAvailability } from '../utils/checks';

const router = express.Router();
const db = getDatabase();

router.delete("/", (req: Request, res: Response): void => {
    var removeOrderRequest: RemoveOrderRequest = req.body as RemoveOrderRequest;
    const {
        table_num,
        time
    } = removeOrderRequest;

    if (!table_num) {
        res.status(400).json({
            error: "Table number is required."
        });

        return;
    }

   checkTableAvailability(removeOrderRequest, db).then((tableBooked) => {
        if (!tableBooked) {
            res.status(400).json({
                error: "You cannot remove an order for a non booked table."
            });

            return;
        }

        db.run(
            `DELETE FROM customers 
            WHERE id IN (
                SELECT customer_id FROM orders WHERE table_num = ? AND time = ?
            )
            AND id NOT IN (
                SELECT customer_id FROM orders WHERE customer_id = customers.id AND (table_num != ? OR time != ?)
            );`,
             [table_num, time],
             (err) => {
                if (err) {
                    return res.status(500).json({ 
                        error: "Error removing order.",
                        details: err.message 
                    });
                }
             }
        );

        db.run(
            `DELETE FROM orders 
            WHERE table_num = ? AND time = ?;`,
            [table_num, time],
            (err) => {
                if (err) {
                    return res.status(500).json({ 
                        error: "Error removing order.",
                        details: err.message 
                    });
                }

                res.status(204).json({
                    table_num,
                    time
                });
            }
        );
   }).catch(error => {
        res.status(500).json({
            error: "Error checking reservation availability.",
            details: error.message
        });
    });
});

export default router;