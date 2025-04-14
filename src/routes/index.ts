import express from "express";
import orderRoutes from "./orders";
import configRoutes from "./config/index"

const router = express.Router();

router.use("/orders", orderRoutes);
router.use("/config", configRoutes);

export default router;