import express, { Request, Response } from 'express';
import { getDatabase } from "../database";
import { CreateOrderRequest } from '../modules/order';
import { checkExistingCustomer, checkTableAvailability} from "../utils/checks";

const router = express.Router();
const db = getDatabase();

router.post("/", (req: Request, res: Response): void => {
    var createOrederRequest: CreateOrderRequest = req.body as CreateOrderRequest
    const { 
        name, 
        phone_number, 
        guests, 
        table_num,
        time
    } = createOrederRequest;

    if (!name || !guests || !table_num || !time || !phone_number) {
        res.status(400).json({ 
            error: "Name, number of people, table number, phone number, and reservation time are required." 
        });

        return;
    }

    Promise.all([
        checkExistingCustomer(createOrederRequest, db),
        checkTableAvailability(createOrederRequest, db)
    ]).then(([customerExists, tableBooked]) => {
        if (customerExists) {
            return res.status(400).json({
                error: "You have already made a reservation for this time."
            });
        }

        if (tableBooked) {
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

                db.run(
                    "INSERT INTO orders (customer_id, table_num, time) VALUES (?, ?, ?)", 
                    [customer_id, table_num, time], 
                    (err) => {
                        if (err) {
                            return res.status(500).json({ 
                                error: "Error placing order.",
                                details: err.message 
                            });
                        }
                        
                        res.status(201).json({ 
                            customer_id,
                            order_id: this.lastID,
                            name, 
                            phone_number, 
                            guests,
                            table_num,
                            time
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