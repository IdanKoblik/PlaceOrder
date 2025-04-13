import { getDatabase } from "../database";
import { RemoveOrderRequest } from "../modules/order";

const db = getDatabase();

export const removeOrder = async (removeOrderRequest: RemoveOrderRequest): Promise<void> => {
    const { tableNumber, time } = removeOrderRequest;

    await runQuery(
        `DELETE FROM customers WHERE id IN (
            SELECT customerId FROM orders WHERE tableNumber = ? AND time = ?
        ) AND id NOT IN (
            SELECT customerId FROM orders WHERE customerId = customers.id 
            AND (tableNumber != ? OR time != ?)
        );`,
        [tableNumber, time, tableNumber, time]
    );

    await runQuery(
        `DELETE FROM orders WHERE tableNumber = ? AND time = ?;`,
        [tableNumber, time]
    );

    await runQuery(
        `DELETE FROM events WHERE id NOT IN (
            SELECT eventId FROM orders WHERE eventId IS NOT NULL
        );`
    );
};

export const runQuery = (query: string, params: any[] = []) =>
    new Promise<void>((resolve, reject) => {
        db.run(query, params, (err: Error | null) => {
            if (err) {
                console.error("Database error:", err);
                reject(err);
            } else {
                resolve();
            }
        });
    }
);
