import express from "express";
import { getReservations } from "./get_reservations";
import { createReservation } from "./create_reservation";
import { removeReservation } from "./remove_reservation";
import { updateReservation } from "./update_reservation";
import { getTables } from "./get_tables";
import { saveTables } from "./save_tables";

const router = express.Router();

router.get("/reservations", getReservations);
router.put("/reservations", createReservation);
router.delete("/reservations", removeReservation);
router.post("/reservations", updateReservation);

router.get("/tables", getTables);
router.post("/tables", saveTables);

export default router;