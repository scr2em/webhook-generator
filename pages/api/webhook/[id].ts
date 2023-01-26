import type { NextApiRequest, NextApiResponse } from "next";
import { saveReq } from "../../../lib/dbQueries";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    saveReq(req).then(({ error, data }) => {
        if (error) {
            res.status(400).end();
            return;
        }
        res.status(200).json({ success: true });
    });
}
