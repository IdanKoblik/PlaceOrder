import { CreateOrderRequest, OrderRequest } from "../modules/order";
import sqlite3, { Database } from "sqlite3";

export const validateOrderRequest = (orderRequest: CreateOrderRequest): string | null => {
    if (!orderRequest.name || !orderRequest.guests || !orderRequest.tableNumber || !orderRequest.time || !orderRequest.phoneNumber) 
        return "Name, number of people, table number, phone number, and reservation time are required.";
    
    if (orderRequest.guests < 0)
         return "Number of guests cannot be less than 0.";

    if (orderRequest.tableNumber < 0)
         return "Table number cannot be less than 0.";

    if (!orderRequest.googleToken) 
        return "Google token cannot be null!";

    return null;
};

export const checkExistingCustomer = (orderRequest: CreateOrderRequest, db: Database): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (!orderRequest.phoneNumber) {
            resolve(false);
            return;
        }

        db.get(
            `SELECT id FROM customers 
             WHERE phoneNumber = ? 
             AND id IN (
                 SELECT customerId FROM orders 
                 WHERE time = ?
             )`,
            [orderRequest.phoneNumber, orderRequest.time],
            (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(!!row);
            }
        );
    });
};

export const checkTableAvailability = (orderRequest: OrderRequest, db: Database): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT id FROM orders 
             WHERE tableNumber = ? 
             AND time = ?`,
            [orderRequest.tableNumber, orderRequest.time],
            (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(!!row);
            }
        );
    });
};