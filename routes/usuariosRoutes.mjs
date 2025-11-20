// routes/usuariosRoutes.mjs
import express from "express";
import {
  mostrarFormularioRegistro,
  procesarRegistro,
  mostrarFormularioLogin,
  procesarLogin,
  cerrarSesion,
  mostrarDashboardUsuarios,
} from "../controllers/usuariosController.mjs";

import { validarRegistroUsuario, validarLoginUsuario } from "../middlewares/validacionesUsuario.mjs";
import { verificarSesion } from "../middlewares/verificarSesion.mjs";

const router = express.Router();

// Registro
router.get("/registrar", mostrarFormularioRegistro);
router.post("/registrar", validarRegistroUsuario, procesarRegistro);

// Login
router.get("/login", mostrarFormularioLogin);
router.post("/login", validarLoginUsuario, procesarLogin);

// Logout
router.post("/logout", verificarSesion, cerrarSesion);

// Dashboard (protegido)
router.get("/dashboard", verificarSesion, mostrarDashboardUsuarios);

export default router;
