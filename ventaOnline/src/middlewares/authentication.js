'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_password_RQ";

exports.ensureAuthAdmin = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(404).send({
      message: "La peticion no tiene la cabecera en la Autenticacion",
    });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        message: "El token ha experido",
      });
    }
  } catch (error) {
    return res.status(404).send({ message: "El token no es valido" });
  }

  req.userAdmin = payload;
  next();
};

exports.ensureAuthCliente = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(404).send({
      message: "La peticion no tiene la cabecera en la Autenticacion",
    });
  }

  var token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        message: "El token ha experido",
      });
    }
  } catch (error) {
    return res.status(404).send({ message: "El token no es valido" });
  }

  req.userCliente = payload;
  next();
};
