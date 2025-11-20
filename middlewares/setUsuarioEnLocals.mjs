// middlewares/setUsuarioEnLocals.mjs
export const setUsuarioEnLocals = (req, res, next) => {
  res.locals.usuario = req.session?.usuario || null;
  next();
};
