import express from "express";
import { getApproaches } from "../controllers/approaches.js";

const router = express.Router();

router.post("/", getApproaches);

export default router;