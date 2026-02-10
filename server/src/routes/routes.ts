import express from "express";
import BasicRoutes from "./basic.js";
import ApproachesRoutes from "./approaches.js";

const router = express.Router();

router.use("/health", BasicRoutes);
router.use("/approaches", ApproachesRoutes);

export default router;