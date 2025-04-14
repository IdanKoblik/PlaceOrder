import { Request, Response } from "express";
import { runQuery } from "../../../services/order";

export const uploadTableLayout = async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const query = `
        INSERT OR REPLACE INTO config (key, value) 
        VALUES ('layout', ?)
    `;
    
    runQuery(query, [JSON.stringify(body)]).then(() => {
        res.status(200).send("Layout uploaded successfully");
    }).catch(() => {
        res.status(500).send("Database error");
    });
};