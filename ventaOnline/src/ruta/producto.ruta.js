'use strict'

var express = require("express");
var productoControlador = require("../controlador/producto.controlador");
var md_autentication = require("../middlewares/authentication");

var app = express.Router();

app.post(
  "/guardarProducto",
  md_autentication.ensureAuthAdmin,
  productoControlador.guardarProducto
);
app.get(
  "/listarProducto",
  md_autentication.ensureAuthAdmin,
  productoControlador.listarProductos
);
app.get(
  "/listarProductoPorNombre",
  md_autentication.ensureAuthAdmin,
  productoControlador.listarProductoPorNombre
);

app.put(
  "/editarProducto/:idProducto",
  md_autentication.ensureAuthAdmin,
  productoControlador.editarProducto
);
app.get(
  "/verMercancia",
  md_autentication.ensureAuthAdmin,
  productoControlador.verMercancia
);
app.delete(
  "/eliminarProducto/:idProducto",
  md_autentication.ensureAuthAdmin,
  productoControlador.eliminarProducto
);
app.get(
  "/verProductoPorCategoria",
  productoControlador.verProductoPorCategoria
);
app.get(
  "/verProductosBajos",
  md_autentication.ensureAuthAdmin,
  productoControlador.verProductosBajos
);
app.get(
  "/verProductoVendido",
  md_autentication.ensureAuthAdmin,
  productoControlador.verProductoVendido
);

module.exports = app;
