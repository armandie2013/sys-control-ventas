// controllers/homeController.mjs
export const mostrarHome = (req, res) => {
  res.render("home", {
    title: "Panel principal",
  });
};
