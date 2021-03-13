"use strict";

var carroControlador = require("../controlador/carro.controlador");
var express = require("express");
var md_autentication = require("../middlewares/authentication");

var app = express.Router();

app.post(
  "/agregarProductoACarrito",
  md_autentication.ensureAuthClient,
  carroControlador.agregarProductoACarrito
);

module.exports = app;
