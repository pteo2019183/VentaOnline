'use strict'

var express = require("express");
var usuarioControlador = require("../controlador/usuario.controlador");
var md_authentication = require("../middlewares/authentication");


var api = express.Router();
api.post("/guardarUsuario", usuarioControlador.guardarUsuario);
api.post("/login", usuarioControlador.login);
api.put(
  "/ascenderCliente",
  md_authentication.ensureAuthAdmin,
  usuarioControlador.ascenderCliente
);
api.put(
  "/editarUsuarioCliente/:idCliente",
  md_authentication.ensureAuthAdmin,
  usuarioControlador.editarUsuarioCliente
);
api.put(
  "/editarMiCuenta/:idCliente",
  md_authentication.ensureAuthClient,
  usuarioControlador.editarMiCuenta
);
api.delete(
  "/eliminarUsuarioCliente/:idCliente",
  md_authentication.ensureAuthAdmin,
  usuarioControlador.eliminarUsuarioCliente
);
api.delete(
  "/eliminarMiCuenta/:idCliente",
  md_authentication.ensureAuthClient,
  usuarioControlador.eleminarMiCuenta
);

module.exports = api;
