// middlewares/verificarSesion.mjs
export const verificarSesion = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.redirect("/usuarios/login");
  }
  next();
};
