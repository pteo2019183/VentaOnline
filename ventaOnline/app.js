"use strict";

//Variables Globals
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Import Routes
var usuario_ruta = require("./src/rutas/usuario.ruta");
var categoria_ruta = require("./src/ruta/categoria.rutas");
var producto_ruta = require("./src/ruta/producto.ruta");
var carro_ruta = require("./src/ruta/carro.ruta");
var cuenta_ruta = require("./src/ruta/cuenta.ruta");

//Middlewares
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//Route Application localhost:3000/api/
app.use(
  "/api",
  usuario_ruta,
  categoria_ruta,
  producto_ruta,
  carro_ruta,
  cuenta_ruta
);

//Exports
module.exports = app;
