// controllers/usuariosController.mjs
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { registrarNuevoUsuario, buscarUsuarioPorEmail } from "../services/usuarioService.mjs";
import Usuario from "../models/Usuario.mjs";

export const mostrarFormularioRegistro = (req, res) => {
  res.render("usuariosViews/registrarUsuario", {
    title: "Registrar usuario",
    errores: [],
    oldData: {},
  });
};

export const procesarRegistro = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("usuariosViews/registrarUsuario", {
      title: "Registrar usuario",
      errores: errors.array(),
      oldData: req.body,
    });
  }

  const { nombre, apellido, email, password } = req.body;

  try {
    const nuevoUsuario = await registrarNuevoUsuario({
      nombre,
      apellido,
      email,
      password,
    });

    // Loguear automáticamente tras registro
    req.session.usuario = {
      _id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
    };

    return res.redirect("/usuarios/dashboard");
  } catch (error) {
    return res.status(400).render("usuariosViews/registrarUsuario", {
      title: "Registrar usuario",
      errores: [{ msg: error.message }],
      oldData: req.body,
    });
  }
};

export const mostrarFormularioLogin = (req, res) => {
  res.render("usuariosViews/loginUsuario", {
    title: "Iniciar sesión",
    errores: [],
    oldData: {},
  });
};

export const procesarLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("usuariosViews/loginUsuario", {
      title: "Iniciar sesión",
      errores: errors.array(),
      oldData: req.body,
    });
  }

  const { email, password } = req.body;

  try {
    const usuario = await buscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(400).render("usuariosViews/loginUsuario", {
        title: "Iniciar sesión",
        errores: [{ msg: "Email o contraseña incorrectos" }],
        oldData: { email },
      });
    }

    const coincide = await bcrypt.compare(password, usuario.passwordHash);
    if (!coincide) {
      return res.status(400).render("usuariosViews/loginUsuario", {
        title: "Iniciar sesión",
        errores: [{ msg: "Email o contraseña incorrectos" }],
        oldData: { email },
      });
    }

    // Guardamos datos mínimos en sesión
    req.session.usuario = {
      _id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
    };

    return res.redirect("/usuarios/dashboard");
  } catch (error) {
    console.error(error);
    return res.status(500).render("usuariosViews/loginUsuario", {
      title: "Iniciar sesión",
      errores: [{ msg: "Error interno. Intente nuevamente." }],
      oldData: { email },
    });
  }
};

export const cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/usuarios/login");
  });
};

export const mostrarDashboardUsuarios = async (req, res) => {
  const usuarios = await Usuario.find().sort({ createdAt: -1 });

  res.render("usuariosViews/dashboardUsuarios", {
    title: "Dashboard de usuarios",
    usuarios,
  });
};
