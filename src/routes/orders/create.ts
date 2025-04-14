import { Request, Response } from "express";
import { getDatabase } from "../../database";
import { CreateOrderRequest, CreateOrderResponse } from "../../modules/order";
import { checkExistingCustomer, checkTableAvailability, validateOrderRequest } from "../../utils/validator";
import { createEvent } from "../../services/calendar";
import { encryptToken } from "../../utils/crypto";

const db = getDatabase();

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const request: CreateOrderRequest = req.body;
        const error = validateOrderRequest(request);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const [customerExists, tableBooked] = await Promise.all([
            checkExistingCustomer(request, db),
            checkTableAvailability(request, db)
        ]);

        if (customerExists) {
            res.status(400).json({ error: "You have already made a reservation for this time." });
            return;
        }

        if (tableBooked) {
            res.status(400).json({ error: "This table is already booked for the specified time." });
            return;
        }

        const customerId = await new Promise<number>((resolve, reject) => {
            db.run(
                "INSERT INTO customers (name, phoneNumber, guests) VALUES (?, ?, ?)",
                [request.name, request.phoneNumber, request.guests],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const orderId = await new Promise<number>((resolve, reject) => {
            db.run(
                "INSERT INTO orders (customerId, tableNumber, time, note, status, googleToken) VALUES (?, ?, ?, ?, ?, ?)",
                [customerId, request.tableNumber, request.time, request.note, 0, encryptToken(request.googleToken)],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const eventId = await createEvent(request);
        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO events (id) VALUES (?);",
                [eventId],
                (err) => {
                    if (err) reject(err);
                    else {
                        db.run(
                            "UPDATE orders SET eventId = ? WHERE id = ?;",
                            [eventId, orderId],
                            (err) => (err ? reject(err) : resolve())
                        );
                    }
                }
            );
        });

        const response: CreateOrderResponse = {
            name: request.name,
            phoneNumber: request.phoneNumber,
            tableNumber: request.tableNumber,
            time: request.time,
            guests: request.guests,
            note: request.note,
        };

        res.status(201).json(response);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Unexpected error occurred.", details: error });
    }
};
