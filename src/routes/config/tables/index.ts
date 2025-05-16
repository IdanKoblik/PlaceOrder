import express from "express";
import { uploadTableLayout } from "./upload";

const router = express.Router();

router.post("/layout", uploadTableLayout);

export default router;