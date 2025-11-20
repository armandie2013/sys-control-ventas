// routes/usuariosRoutes.mjs
import express from "express";
import {
  mostrarFormularioRegistro,
  procesarRegistro,
  mostrarFormularioLogin,
  procesarLogin,
  cerrarSesion,
  mostrarDashboardUsuarios,
  mostrarFormularioEditar,
  procesarEdicion,
  toggleEstadoUsuario,
  borrarUsuario,
} from "../controllers/usuariosController.mjs";

import { validarRegistroUsuario, validarLoginUsuario } from "../middlewares/validacionesUsuario.mjs";
import { verificarSesion } from "../middlewares/verificarSesion.mjs";
import { verificarAdmin } from "../middlewares/verificarAdmin.mjs";

const router = express.Router();

// Registro
router.get("/registrar", mostrarFormularioRegistro);
router.post("/registrar", validarRegistroUsuario, procesarRegistro);

// Login
router.get("/login", mostrarFormularioLogin);
router.post("/login", validarLoginUsuario, procesarLogin);

// Logout
router.post("/logout", verificarSesion, cerrarSesion);

// Dashboard
router.get("/dashboard", verificarSesion, verificarAdmin, mostrarDashboardUsuarios);

// Editar
router.get("/editar/:id", verificarSesion, verificarAdmin, mostrarFormularioEditar);
router.put("/editar/:id", verificarSesion, verificarAdmin, procesarEdicion);

// Activar / desactivar
router.patch("/estado/:id", verificarSesion, verificarAdmin, toggleEstadoUsuario);

// Eliminar
router.delete("/eliminar/:id", verificarSesion, verificarAdmin, borrarUsuario);


export default router;
