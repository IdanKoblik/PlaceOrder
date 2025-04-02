import { getDatabase } from "../../database";
import { Request, Response } from "express";
import { UpdateActivityRequest } from "../../modules/order";
import { runQuery } from "../../services/order";

export const updateOrderActivity = async (req: Request, res: Response) : Promise<void> => {
    const request = req.body as UpdateActivityRequest;

    const query = `
        UPDATE orders
        SET active = ? WHERE id = ?
    `;

    await runQuery(query, [request.activity, request.order_id]);
    res.status(201).json({ activity: request.activity, order_id: request.order_id });
};