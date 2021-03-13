'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_password_RQ";

exports.createTokenAdmin = function (userAdmin) {
  var payload = {
    sub: usuarioAdmin._id,
    nombre: usuarioAdmin.nombre,
    correo: usuarioAdmin.correo,
    usuario: usuarioAdmin.usuario,
    clave: usuarioAdmin.clave,
    rol: usuarioAdmin.rol,
    iat: moment().unix(),
    exp: moment().day(10, "days").unix(),
  };
  return jwt.encode(payload, secret);
};

exports.createTokenCliente = function (userCliente) {
  var payload = {
    sub: usuarioCliente._id,
    nombre: usuarioCliente.nombre,
    correo: usuarioCliente.correo,
    usuario: usuarioCliente.usuario,
    clave: usuarioCliente.clave,
    rol: userClient.rol,
    iat: moment().unix(),
    exp: moment().day(10, "days").unix(),
  };
  return jwt.encode(payload, secret);
};
