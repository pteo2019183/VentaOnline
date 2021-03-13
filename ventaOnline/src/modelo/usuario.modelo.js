"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
  nombre: String,
  usuario: String,
  correo: String,
  clave: String,
  rol: { type: String, default: "CLIENTE" },
  purchases: [
    {
      idcuenta: { type: Schema.Types.ObjectId, ref: "cuenta" },
      productos: [],
      total: Number,
    },
  ],
});

module.exports = mongoose.model("usuario", usuarioSchema);
