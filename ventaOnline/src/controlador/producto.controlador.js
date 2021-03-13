'use strict'

const { nombreModelo } = require("../modelo/producto.modelo");
var Producto = require("../modelo/producto.modelo");
var Categoria = require("../modelo/categoria.modelo");

function guardarProducto(req, res) {
    var params = req.body;
    var productosModelo = new Producot();
    var usuarioCliente = req.usuarioAdmin.usuario;
  
    if (req.usuarioAdmin.rol == "ADMIN") {
      if (
        params.nombre &&
        params.precio &&
        params.monto &&
        params.categoria &&
        params.monto &&
        params.marca
      ) {
        productosModelo.name = params.nombre;
        productosModelo.price = params.precio;
        productosModelo.amount = params.monto;
        productosModelo.category = params.categoria;
        productosModelo.mark = params.marca;
  
        Categoria.findById(params.categoria, (err, encontrarCategoria) => {
          if (err)
            return res
              .status(200)
              .send({ message: "Error en el id de la categoria " });
  
          if (encontrarCategoria) {
            Producto.find({ nombre: productosModelo.nombre }).exec(
              (err, encontrarProducto) => {
                if (err)
                  return res
                    .status(200)
                    .send({ message: "Error en la peticion" });
  
                if (encontrarProducto && encontrarProducto.length >= 1) {
                  return res
                    .status(200)
                    .send({ message: "El producto ya existe" });
                } else {
                  productosModelo.save((err, guardarProducto) => {
                    if (err)
                      return res
                        .status(200)
                        .send({ message: "Error en la peticion guardar" });
  
                    if (!guardarProducto) {
                      return res
                        .status(200)
                        .send({ message: "No se pudo guardar el pructo" });
                    } else {
                      res.status(200).send({guardarProducto});
                      console.log("Se creo un producto");
                    }
                  });
                }
              }
            );
          } else {
            return res
              .status(200)
              .send({ message: "No se econtro la cetegoria" });
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

  function listarProductos(req, res) {
    Producto.find({}, (err, productos) => {
      Producto.populate(productos, { path: "categoria" }, (err, productos) => {
        res.status(200).send({productos});
      });
    });
  }

  function listarProductoPorNombre(req, res) {
    var params = req.body;
  
    Producto.findOne({ nombre: params.nombre }).exec((err, buscarProducto) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (buscarProducto) {
        return res.status(200).send({buscarProducto});
      }
    });
  }

  function editarProducto(req, res) {
    var ProductoId = req.params.idProducto;
    var params = req.body;
  
    if (req.usuarioAdmin.rol == "ADMIN") {
      Producto.findByIdAndUpdate(
        ProductoId,
        params,
        { new: true },
        (err, actualizarProducto) => {
          if (actualizarProducto) {
            return res.status(200).send({actualizarProducto});
          } else {
            return res
              .status(200)
              .send({ message: "No se pudo editar el producto" });
          }
        }
      );
    } else {
      return res.status(200).send({
        message: "Usted no es administrador no puede editar este producto",
      });
    }
  }

  function verMercancia(req, res) {
    var params = req.body;
  
    Producto.findOne({ nombre: params.nombre }).exec((err, buscarProducto) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (buscarProducto) {
        return res.status(200).send({
          Producto: buscarProducto.nombre,
          Cantidad: buscarProducto.monto,
        });
      } else {
        return res.status(200).send({ message: "No se encotro el producto" });
      }
    });
  }
  
  function eliminarProducto(req, res) {
    var ProductoId = req.params.idProducto;
  
    if (req.usuarioAdmin.rol == "ADMIN") {
      Producto.findByIdAndDelete(ProductoId, (err, eliminarProducto) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });
  
        if (eliminarProducto) {
          return res
            .status(200)
            .send({ message: "Producto eliminado con exito" });
        } else {
          return res
            .status(200)
            .send({ message: "No se pudo borrar el producto" });
        }
      });
    } else {
      return res.status(200).send({
        message: "Usted no es administrador y no puede eliminar este producto",
      });
    }
  }
  
  function verProductoPorCategoria(req, res) {
    var params = req.body;
  
    Categoria.findOne({ nombre: params.categoria }).exec((err, buscarCategoria) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (buscarCategoria) {
        Producto.find({ categoria: buscarCategoria._id }).exec(
          (err, buscarProductoCategoria) => {
            if (err)
              return res.status(200).send({ message: "Error en el servidor" });
  
            if (buscarProductoCategoria) {
              return res.status(200).send({buscarProductoCategoria});
            } else {
              return res.status(200).send({
                message: "No hay productos asociados en esta categoria",
              });
            }
          }
        );
      } else {
        return res.status(200).send({ message: "No se encontro la categoria" });
      }
    });
  }
  
  function verProductosBajos(req, res) {
    Producto.find({
      monto: 0,
    }).exec((err, productos) => {
      res.status(200).send(productos);
    });
  }
  
  function verProductoVendido(req, res) {
    Producto.find({})
      .sort({ vendido: -1 })
      .limit(10)
      .exec((err, productos) => {
        res.status(200).send(productos);
      });
  }

  module.exports = {
      guardarProducto,
      listarProductos,
      listarProductoPorNombre,
      editarProducto,
      verMercancia,
      eliminarProducto,
      verProductoPorCategoria,
      verProductosBajos,
      verProductoVendido,
 };