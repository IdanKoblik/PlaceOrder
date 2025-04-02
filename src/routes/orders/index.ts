import express from "express";
import { createOrder } from "./create";
import { deleteOrder } from "./delete";
import { getOrders } from "./get";
import { updateOrderActivity } from "./update";

const router = express.Router();

router.post("/create", createOrder);
router.delete("/delete", deleteOrder);
router.get("/", getOrders);
router.put("/update/activity", updateOrderActivity);

export default router;
