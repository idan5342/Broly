import express from "express";
import BasicRoutes from "./basic.js";
import ApproachesRoutes from "./approaches.js";
import TLEsRoutes from "./tles.js";

const router = express.Router();

router.use("/health", BasicRoutes);
router.use("/approaches", ApproachesRoutes);
router.use("/tles", TLEsRoutes);


export default router;