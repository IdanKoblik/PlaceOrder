import express from "express";
import { getReservations } from "./get_reservations";
import { createReservation } from "./create_reservation";
import { removeReservation } from "./remove_reservation";
import { updateReservation } from "./update_reservation";

const router = express.Router();

router.get("/reservations", getReservations);
router.put("/reservations", createReservation);
router.delete("/reservations", removeReservation);
router.post("/reservations", updateReservation);

export default router;