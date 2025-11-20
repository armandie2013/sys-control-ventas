// app.mjs
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import session from "express-session";
import MongoStore from "connect-mongo";

import { connectDB } from "./config/db.mjs";
import homeRoutes from "./routes/homeRoutes.mjs";
import usuariosRoutes from "./routes/usuariosRoutes.mjs";
import { setUsuarioEnLocals } from "./middlewares/setUsuarioEnLocals.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Conexión a Mongo
await connectDB();

// Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressEjsLayouts);
app.set("layout", "layout");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sesiones",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
    },
  })
);

// Poner usuario en res.locals para las vistas
app.use(setUsuarioEnLocals);

// Rutas
app.use("/", homeRoutes);
app.use("/usuarios", usuariosRoutes);

// 404 simple
app.use((req, res) => {
  res.status(404).render("home", {
    title: "No encontrado",
  });
});

// Arranque
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
