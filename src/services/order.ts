import { getDatabase } from "../database";
import { RemoveOrderRequest } from "../modules/order";

const db = getDatabase();

export const removeOrder = async (removeOrderRequest: RemoveOrderRequest): Promise<void> => {
    const { table_num, time } = removeOrderRequest;

    await runQuery(
        `DELETE FROM customers WHERE id IN (
            SELECT customer_id FROM orders WHERE table_num = ? AND time = ?
        ) AND id NOT IN (
            SELECT customer_id FROM orders WHERE customer_id = customers.id 
            AND (table_num != ? OR time != ?)
        );`,
        [table_num, time, table_num, time]
    );

    await runQuery(
        `DELETE FROM orders WHERE table_num = ? AND time = ?;`,
        [table_num, time]
    );

    await runQuery(
        `DELETE FROM events WHERE id NOT IN (
            SELECT event_id FROM orders WHERE event_id IS NOT NULL
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
    });
