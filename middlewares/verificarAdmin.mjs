// middlewares/verificarAdmin.mjs

export const verificarAdmin = (req, res, next) => {
  const usuario = req.session?.usuario;

  if (!usuario) {
    // Por las dudas, si no hay sesión, lo mandamos al login
    return res.redirect("/usuarios/login");
  }

  if (usuario.rol !== "admin") {
    // Si está logueado pero no es admin, mostramos 403
    return res.status(403).render("partials/error403", {
      title: "Acceso denegado",
    });
  }

  next();
};
