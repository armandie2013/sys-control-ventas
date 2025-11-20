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
