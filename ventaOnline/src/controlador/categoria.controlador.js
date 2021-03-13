'use strict'

var Categoria = require("../modelo/categoria.modelo");
var bcrypt = require("bcrypt-nodejs");
var Producto = require("../modelo/producto.modelo");

function guardarCategoria(req, res) {
    var categoriaModelo = new Categoria();
    var params = req.body;
    var usuarioCliente = req.usuarioAdmin.usuario;
  
    if (req.usuarioAdmin.rol == "ADMIN") {
      if (params.nombre) {
        categoriaModelo.nombre = params.nombre;
        Categoria.find({ nombre: categoriaModelo.nombre }).exec((err, encontrarCategoria) => {
          if (err)
            return res.status(500).send({ message: "Error en la peticion" });
  
          if (encontrarCategoria && encontrarCategoria.length >= 1) {
            return res.status(500).send({
              message: "La categoria ya existe",
            });
          } else {
            categoriaModelo.save((err, guardarCategoria) => {
              if (err)
                return res.status(500).send({
                  message: "Error en la peticion de guardar categoria",
                });
  
              if (guardarCategoria) {
                res.status(500).send({
                  guardarCategoria,
                });
              } else {
                return res
                  .status(200)
                  .send({ message: "No se pudo guardar la categoria" });
              }
            });
          }
        });
      } else {
        return res.status(200).send({ message: "Ingrese todos los parametros" });
      }
    } else {
      return res
        .status(200)
        .send({ message: `${usuarioCliente} Usted no es administrador ` });
    }
  }

  function listarCategoria(req, res) {
    Categoria.find().exec((err, Categorias) => {
      if (err) return res.status(200).send({ message: "Error en la peticion" });
  
      if (!Categorias) {
        return res
          .status(200)
          .send({ message: "Error en la consulta de Categorias" });
      } else {
        return res.status(200).send({Categorias});
      }
    });
  }

  function eliminarCategoria(req, res) {
    var categoriaId = req.params.id;
    var idPorDefecto = "";
  
    if (req.usuarioAdmin.rol == "ADMIN") {
      Categoria.findOne({ name: "PorDefecto Categoria" }).exec(
        (err, buscarCategoriaPorDefecto) => {
          if (err)
            return res.status(200).send({ message: "Error en el servidor" });
  
          if (buscarCategoriaPorDefecto) {
            idPorDefecto = buscarCategoriaPorDefecto._id;
          }
        }
      );

    Categoria.findById(categoriaId, (err, encontrarCategoria) => {
    if (err) {
          res.status(500).send({ message: "Error en el servidor" });
        } else if (encontrarCategoria) {
          Producto.updateMany(
            { categoria: categoriaId },
            { $set: { categoria: idPorDefecto } },
            { new: true },
            (err, setPorDefecto) => {
              if (err) {
                res.status(500).send({ message: "Error en el servidor" });
              } else if (setPorDefecto) {
                Category.findByIdAndDelete(categoriaId, (err, eliminarCategoria) => {
                  if (err) {
                    res.status(500).send({ message: "Error en el servidor" });
                  } else if (eliminarCategoria) {
                    res.send({
                      message: "Categoria eliminada correctamente",
                      eliminarCategoria,
                    });
                  } else {
                    res
                      .status(404)
                      .send({ message: "No se pudo borrar la categoria" });
                  }
                });
              } else {
                res.status(404).send({
                  message: "No se pudo pasar a la categoria por defecto",
                });
              }
            }
          );
        } else {
          res.status(404).send({ message: "No se pudo encontrar la categoria" });
        }
      });
    } else {
      return res.status(200).send({
        message: "Usted no administrador no puede eliminar categorias",
      });
    }
  }
  
  function editarCategoria(req, res) {
    var categoriaId = req.params.idCategoria;
    var params = req.body;
  
    if (params.nombre) {
      Categoria.findByIdAndUpdate(
        categoriaId,
        params,
        { new: true },
        (err, actualizarCategoria) => {
          if (err)
            return res.status(200).send({ message: "Error en el servidor" });
  
          if (actualizarCategoria) {
            return res.status(200).send({ categoryUpdate });
          } else {
            return res.status(200).send({ message: "No se pudo editar" });
          }
        }
      );
    } else {
      return res.status(200).send({ message: "Error con los parametros" });
    }
  }
module.exports = {
    guardarCategoria,
    listarCategoria,
    eliminarCategoria,
    editarCategoria,

};