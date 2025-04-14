import { Request, Response } from "express";
import { OrderStatusRequest } from "../../../modules/order";
import { runQuery } from "../../../services/order";

export const updateOrderActivity = async (req: Request, res: Response) : Promise<void> => {
    const request = req.body as OrderStatusRequest;
    const query = `
        UPDATE orders
        SET status = ? WHERE id = ?
    `;

    await runQuery(query, [request.status, request.orderId]);
    res.status(200).json({ status: request.status, orderId: request.orderId });
};