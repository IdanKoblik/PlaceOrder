import { Request, Response } from "express";
import { getDatabase } from "../../database";
import { config } from "../../modules/config";

const db = getDatabase();

export const getRow = async (req: Request, res: Response): Promise<void> => {
    const dbRow = req.query.row;
    const query = `
        SELECT value FROM config WHERE key = '${dbRow}';
    `;

    db.get(query, (err: Error, row: config<string, string>) => {
        if (err) {
            res.status(500).json({ error: `Cannot run query for row ${dbRow}` });
            return;
        }

        if (!row) {
            const insertQuery = `
                INSERT INTO config (key, value) VALUES ('${dbRow}', '');
            `;
            
            db.run(insertQuery, (insertErr: Error) => {
                if (insertErr) {
                    res.status(500).json({ error: `Cannot create default ${dbRow} row` });
                    return;
                }

                res.status(200).json("");
            });
            return;
        }

        res.status(200).json(row.value || "");
    });
};
