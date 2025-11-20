// middlewares/validacionesUsuario.mjs
import { body } from "express-validator";

export const validarRegistroUsuario = [
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Debe ser un email válido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("password2")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas no coinciden"),
];

export const validarLoginUsuario = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Debe ser un email válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
