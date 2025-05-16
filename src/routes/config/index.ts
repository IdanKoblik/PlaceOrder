import express from "express";
import tableRoutes from "./tables/index"
import { getRow } from "./get";
import { lock } from "./lock/lock";

const router = express.Router();

router.get("/", getRow);
router.use("/tables", tableRoutes);
router.post("/lock", lock);

export default router;