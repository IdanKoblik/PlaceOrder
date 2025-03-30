import {OrderRequest, CreateOrderRequest} from "../modules/order";
import sqlite3, { Database } from "sqlite3";

export const checkExistingCustomer = (orderRequest: CreateOrderRequest, db: Database): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (!orderRequest.phone_number) {
            resolve(false);
            return;
        }

        db.get(
            `SELECT id FROM customers 
             WHERE phone_number = ? 
             AND id IN (
                 SELECT customer_id FROM orders 
                 WHERE time = ?
             )`,
            [orderRequest.phone_number, orderRequest.time],
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
             WHERE table_num = ? 
             AND time = ?`,
            [orderRequest.table_num, orderRequest.time],
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