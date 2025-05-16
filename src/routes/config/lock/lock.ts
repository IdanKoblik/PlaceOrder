import { Request, Response } from "express";
import { runQuery } from "../../../services/order";
import { lockRequest } from "../../../modules/lock";

export const lock = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as lockRequest;
    const query = `
        INSERT OR REPLACE INTO config (key, value) 
        VALUES ('lock', ?)
    `;
    
    runQuery(query, [body.value]).then(() => {
        res.status(200).send("Successfully added edit lock");
    }).catch(() => {
        res.status(500).send("Database error");
    });
};