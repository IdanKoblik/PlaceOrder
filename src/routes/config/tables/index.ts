import express from "express";
import { uploadTableLayout } from "./upload";
import { getTableLayout } from "./get";

const router = express.Router();

router.post("/layout", uploadTableLayout);
router.get("/layout", getTableLayout);

export default router;