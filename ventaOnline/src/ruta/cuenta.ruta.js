'use strict'

var express = require("express");
var cuentaControlador = require("../controlador/cuenta.controlador");
var api = express();
var md_autentication = require("../middlewares/authentication");

api.get("/crearCuenta/:id", cuentaControlador.crearCuenta);
api.get(
  "/listaCuenta",
  md_autentication.ensureAuthAdmin,
  cuentaControlador.listarCuentas
);
api.get(
  "/verProductoFactura/:id",
  md_autentication.ensureAuthAdmin,
  cuentaControlador.verProductoFactura
);

module.exports = api;