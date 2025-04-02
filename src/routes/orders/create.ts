import { Request, Response } from "express";
import { getDatabase } from "../../database";
import { CreateOrderRequest, CreateEventRequest } from "../../modules/order";
import { checkExistingCustomer, checkTableAvailability, validateOrderRequest } from "../../utils/validator";
import { createEvent } from "../../services/calendar";
import { encryptToken } from "../../utils/crypto";

const db = getDatabase();

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const createOrderRequest: CreateOrderRequest = req.body;

        const error = validateOrderRequest(createOrderRequest);
        if (error) {
            res.status(400).json({ error });
            return;
        }

        const [customerExists, tableBooked] = await Promise.all([
            checkExistingCustomer(createOrderRequest, db),
            checkTableAvailability(createOrderRequest, db)
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
                "INSERT INTO customers (name, phone_number, guests) VALUES (?, ?, ?)",
                [createOrderRequest.name, createOrderRequest.phone_number, createOrderRequest.guests],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const is_active = 0;
        const orderId = await new Promise<number>((resolve, reject) => {
            db.run(
                "INSERT INTO orders (customer_id, table_num, time, note, active, token) VALUES (?, ?, ?, ?, ?, ?)",
                [customerId, createOrderRequest.table_num, createOrderRequest.time, createOrderRequest.note, is_active, encryptToken(createOrderRequest.token)],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        const request: CreateEventRequest = { ...createOrderRequest, active: is_active };
        const eventId = await createEvent(request);

        await new Promise<void>((resolve, reject) => {
            db.run(
                "INSERT INTO events (id) VALUES (?);",
                [eventId],
                (err) => {
                    if (err) reject(err);
                    else {
                        db.run(
                            "UPDATE orders SET event_id = ? WHERE id = ?;",
                            [eventId, orderId],
                            (err) => (err ? reject(err) : resolve())
                        );
                    }
                }
            );
        });

        res.status(201).json({ customer_id: customerId, order_id: orderId, ...createOrderRequest, eventId: eventId });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Unexpected error occurred.", details: error });
    }
};
