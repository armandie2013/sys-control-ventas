// services/usuarioService.mjs
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.mjs";

const SALT_ROUNDS = 10;

export const registrarNuevoUsuario = async ({ nombre, apellido, email, password }) => {
  const existe = await Usuario.findOne({ email });
  if (existe) {
    throw new Error("El email ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const cantidadUsuarios = await Usuario.countDocuments();

  const rol =
    cantidadUsuarios === 0
      ? "admin"   // primer usuario → admin
      : "usuario";

  const usuario = new Usuario({
    nombre,
    apellido,
    email,
    passwordHash,
    rol,
  });

  await usuario.save();
  return usuario;
};

export const buscarUsuarioPorEmail = async (email) => {
  return await Usuario.findOne({ email });
};

export const obtenerTodosLosUsuarios = async () => {
  return await Usuario.find().sort({ createdAt: -1 });
};

export const obtenerUsuarioPorId = async (id) => {
  return await Usuario.findById(id);
};

export const actualizarUsuario = async (id, datos) => {
  const usuario = await Usuario.findById(id);
  if (!usuario) throw new Error("Usuario no encontrado");

  usuario.nombre = datos.nombre || usuario.nombre;
  usuario.apellido = datos.apellido || usuario.apellido;
  usuario.email = datos.email || usuario.email;

  if (datos.password && datos.password.trim() !== "") {
    usuario.passwordHash = await bcrypt.hash(datos.password, 10);
  }

  if (datos.rol) {
    usuario.rol = datos.rol;
  }

  await usuario.save();
  return usuario;
};

export const cambiarEstadoUsuario = async (id) => {
  const usuario = await Usuario.findById(id);
  if (!usuario) throw new Error("Usuario no encontrado");

  usuario.activo = !usuario.activo;
  await usuario.save();

  return usuario;
};

export const eliminarUsuario = async (id) => {
  return await Usuario.findByIdAndDelete(id);
};