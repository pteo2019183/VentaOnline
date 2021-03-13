"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductosSchema = {
  nombre: String,
  precio: Number,
  monto: Number,
  marca: String,
  categoria: { type: Schema.Types.ObjectId, ref: "categorias" },
  venta: { type: Number, default: 0 },
};

module.exports = mongoose.model("productos", ProductosSchema);
