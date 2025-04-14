import { Request, Response } from "express";
import { getDatabase } from "../../../database";
import { config } from "../../../modules/config";

const db = getDatabase();

export const getTableLayout = async (req: Request, res: Response): Promise<void> => {
    const query = `
        SELECT value FROM config WHERE key = 'layout';
    `;

    db.get(query, (err: Error, row: config<string, string>) => {
        if (err) {
            res.status(500).json({ error: "Cannot get tables layout" });
            return;
        }

        if (!row) {
            const insertQuery = `
                INSERT INTO config (key, value) VALUES ('layout', '');
            `;
            
            db.run(insertQuery, (insertErr: Error) => {
                if (insertErr) {
                    res.status(500).json({ error: "Cannot create default tables layout" });
                    return;
                }

                res.status(200).json("");
            });
            return;
        }

        res.status(200).json(row.value || "");
    });
};
