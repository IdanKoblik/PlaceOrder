import express from "express";
import orderRoutes from "./orders";

const router = express.Router();

router.use("/orders", orderRoutes);

export default router;