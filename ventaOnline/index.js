// IMPORTS
const mongoose = require("mongoose");
const app = require("./app");
const Usuario = require("./src/modelo/usuario.modelo");
const Categoria = require("./src/modelo/categoria.modelo");
const bcrypt = require("bcrypt-nodejs");
const { model } = require("./src/modelos/usuario.modelo");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/dbVentaOnline", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Se encuentra conectado a la base de datos");

    app.listen(3000, function () {
      console.log("Servidor corriendo en el puerto 3000");
    });
    defaultUsuario();
    defaultCategoria();
  })
  .catch((err) => console.log(err));

function defaultUsuario(req, res) {
  Usuario.findOne({
    user: "ADMIN",
  }).exec((err, usuarioData) => {
    if (usuarioData) {
      console.log("Usuario por defecto ya creado");
    } else {
      var usuarioModelo = new Usuario({
        nombre: "ADMIN",
        usuario: "ADMIN",
        correo: "ADMIN@correo.com",
        clave: bcrypt.hashSync("123456"),
        rol: "ADMIN",
      });
      usuarioModelo.save();
      console.log("Usuario admin creado con exito");
    }
  });
}

function defaultCategoria(req, res) {
  Categoria.findOne({
    nombre: "Default Categoria",
  }).exec((err, categoriaFind) => {
    if (categoriaFind) {
      console.log("Categoria por defecto ya creada");
    } else {
      var categoriaModelo = new Categoria({
        name: "Default Categoria",
      });
      categoriaModelo.save();
      console.log("Categoria por defecto creada con exito");
    }
  });
}
