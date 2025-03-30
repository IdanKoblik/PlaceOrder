import express, { Request, Response } from 'express';
import { getDatabase } from "../database";
import { CreateOrderRequest, CreateEventRequest } from '../modules/order';
import { checkExistingCustomer, checkTableAvailability} from "../utils/checks";
import { createEvent } from '../services/calendar';

const router = express.Router();
const db = getDatabase();

router.post("/", (req: Request, res: Response): void => {
    var createOrederRequest: CreateOrderRequest = req.body as CreateOrderRequest
    const { 
        name, 
        phone_number, 
        guests, 
        table_num,
        time,
        note,
        token
    } = createOrederRequest;

    if (!name || !guests || !table_num || !time || !phone_number) {
        res.status(400).json({ 
            error: "Name, number of people, table number, phone number, and reservation time are required." 
        });

        return;
    }

    if (guests < 0) {
        res.status(400).json({ 
            error: "Number of guests cannot be less then 0" 
        });

        return;
    }

    if (table_num < 0) {
        res.status(400).json({ 
            error: "Table number cannot be less then 0" 
        });

        return;
    }

    Promise.all([
        checkExistingCustomer(createOrederRequest, db),
        checkTableAvailability(createOrederRequest, db)
    ]).then(([customerExists, tableBooked]) => {
        if (customerExists) {
            console.log("You have already made a reservation for this time.");
            return res.status(400).json({
                error: "You have already made a reservation for this time."
            });
        }

        if (tableBooked) {
            console.log("This table is already booked for the specified time.");
            return res.status(400).json({
                error: "This table is already booked for the specified time."
            });
        }

        db.run(
            "INSERT INTO customers (name, phone_number, guests) VALUES (?, ?, ?)", 
            [name, phone_number, guests], 
            function(err) {
                if (err) {
                    return res.status(500).json({ 
                        error: "Error creating customer.",
                        details: err.message 
                    });
                }
                
                const customer_id = this.lastID;

                const is_active: number = new Date(time).getTime === Date.now ? 1 : 0;
                db.run(
                    "INSERT INTO orders (customer_id, table_num, time, note, active) VALUES (?, ?, ?, ?, ?)", 
                    [customer_id, table_num, time, note, is_active], 
                    (err) => {
                        if (err) {
                            return res.status(500).json({ 
                                error: "Error placing order.",
                                details: err.message 
                            });
                        }
                        
                        const request: CreateEventRequest = {
                            name: name,
                            phone_number: phone_number,
                            guests: guests,
                            note: note,
                            table_num: table_num,
                            time: time,
                            token: token,
                            active: is_active
                        };

                        createEvent(request);
                        res.status(201).json({ 
                            customer_id,
                            order_id: this.lastID,
                            name, 
                            phone_number, 
                            guests,
                            table_num,
                            time,
                            note
                        });
                    }
                );
            }
        );
    })
    .catch(error => {
        res.status(500).json({
            error: "Error checking reservation availability.",
            details: error.message
        });
    });
});

export default router;