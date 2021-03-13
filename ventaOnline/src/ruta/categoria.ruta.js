'use strict'

var express = require("express");
var categoriaControlador = require("../controlador/categoria.controlador");
var md_autentication = require("../middlewares/authentication");

var api = express.Router();
api.post(
  "/guardarCategoria",
  md_autentication.ensureAuthAdmin,
  categoriaControlador.guardarCategoria
);

api.get(
  "/listarCategorias",
  md_autentication.ensureAuthAdmin,
  categoriaControlador.listarCategoria
);

api.delete(
  "/eliminarCategoria/:id",
  md_autentication.ensureAuthAdmin,
  categoriaControlador.eliminarCategoria
);

api.put(
  "/editarCategoria/:idCategoria",
  md_autentication.ensureAuthAdmin,
  categoriaControlador.editarCategoria
);

module.exports = api;