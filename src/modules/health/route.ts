import express from "express";
import { getHealthStatus } from "./controller.js";

const router = express.Router();

router.get("/", getHealthStatus);

export default router;
