// controllers/usuariosController.mjs
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { registrarNuevoUsuario,
    buscarUsuarioPorEmail, 
    obtenerTodosLosUsuarios, 
    obtenerUsuarioPorId, 
    actualizarUsuario, 
    cambiarEstadoUsuario, 
    eliminarUsuario } from "../services/usuarioService.mjs";
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



// Dashboard (LISTADO)
export const mostrarDashboardUsuarios = async (req, res) => {
  const usuarios = await Usuario.find()
    .sort({ rol: 1, createdAt: -1 });

  res.render("usuariosViews/dashboardUsuarios", {
    title: "Usuarios",
    usuarios,
  });
};

// FORM EDITAR
export const mostrarFormularioEditar = async (req, res) => {
  const usuario = await obtenerUsuarioPorId(req.params.id);

  if (!usuario) {
    return res.status(404).send("Usuario no encontrado");
  }

  res.render("usuariosViews/editarUsuario", {
    title: "Editar usuario",
    usuario,
    errores: [],
  });
};

// PROCESAR EDICIÓN
export const procesarEdicion = async (req, res) => {
  const errors = validationResult(req);
  const id = req.params.id;

  if (!errors.isEmpty()) {
    const usuario = await obtenerUsuarioPorId(id);
    return res.status(400).render("usuariosViews/editarUsuario", {
      title: "Editar usuario",
      usuario,
      errores: errors.array(),
    });
  }

  try {
    await actualizarUsuario(id, req.body);
    return res.redirect("/usuarios/dashboard");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// ACTIVAR / DESACTIVAR
export const toggleEstadoUsuario = async (req, res) => {
  try {
    await cambiarEstadoUsuario(req.params.id);
    return res.redirect("/usuarios/dashboard");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ELIMINAR
export const borrarUsuario = async (req, res) => {
  try {
    await eliminarUsuario(req.params.id);
    return res.redirect("/usuarios/dashboard");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
