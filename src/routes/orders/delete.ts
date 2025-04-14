import { Request, Response } from "express";
import { getDatabase } from "../../database";
import { RemoveOrderRequest } from "../../modules/order";
import { checkTableAvailability } from "../../utils/validator";
import { removeOrder } from "../../services/order";
import { removeEvent } from "../../services/calendar";

const db = getDatabase();

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const request: RemoveOrderRequest = req.body;
        if (!request.tableNumber) {
            res.status(400).json({ error: "Table number is required." });
            return;
        }

        const tableBooked = await checkTableAvailability(request, db);
        if (!tableBooked) {
            res.status(400).json({ error: "You cannot remove an order for a non-booked table." });
            return;
        }

        await removeOrder(request);
        await removeEvent(request);
        res.status(204).json({ tableNumber: request.tableNumber, time: request.time });
    } catch (error: any) {
        res.status(500).json({ error: "Error removing order.", details: error.message });
    }
};
