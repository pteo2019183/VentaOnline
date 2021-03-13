"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var carroSchema = Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "usuarios" },
  productos: [
    {
      producto: { type: Schema.Types.ObjectId, ref: "productos" },
      nombre: String,
      precio: Number,
      cantidad: Number,
    },
  ],
  total: { type: Number, default: 0 },
});

module.exports = mongoose.model("carro", carroSchema);
