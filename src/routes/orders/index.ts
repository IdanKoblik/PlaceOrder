import express from "express";
import { createOrder } from "./create";
import { deleteOrder } from "./delete";
import { getOrders } from "./get";
import { updateOrderActivity } from "./update/activity";

const router = express.Router();

router.put("/create", createOrder);
router.delete("/delete", deleteOrder);
router.get("/", getOrders);
router.post("/update/activity", updateOrderActivity);

export default router;
