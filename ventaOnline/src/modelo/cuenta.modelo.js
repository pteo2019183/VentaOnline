"use strict";

const mongoose = require("mongoose");
var Schemma = mongoose.Schema;

var cuentaSchema = Schemma({
  fecha: Date,
  total: Number,
  usuario: [
    {
      type: Schemma.Types.ObjectId,
      ref: "usuario",
      required: true,
    },
  ],
  productos: [
    {
      producto: Schemma.Types.ObjectId,
      nombre: String,
      cantidad: Number,
      precio: Number,
      subtotal: Number,
    },
  ],
});

module.exports = mongoose.model("cuenta", cuentaSchema);