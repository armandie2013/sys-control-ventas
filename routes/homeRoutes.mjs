// routes/homeRoutes.mjs
import express from "express";
import { mostrarHome } from "../controllers/homeController.mjs";

const router = express.Router();

router.get("/", mostrarHome);

export default router;
