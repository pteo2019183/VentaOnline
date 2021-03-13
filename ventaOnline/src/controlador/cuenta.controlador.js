"use strict";

var Cuenta = require("../modelo/cuenta.modelo");
var Carro = require("../modelo/carro.modelo");
var Producto = require("../modelo/producto.modelo");
var Usuario = require("../modelo/usuario.modelo");

function crearCuenta(req, res) {
  var idUsuario = req.params.id;
  var cuentaModelo = new Cuenta();
  var usuarioModelo = new Usuario();
  var Cuentas = [];

  Carro.findOne({ usuario: idUsuario }).exec((err, buscarCarro) => {
    if (err) return res.status(200).send({ message: "Error en el servidor 1" });

    if (buscarCarro) {
      if (buscarCarro.productos.length == 0) {
        return res
          .status(200)
          .send({ message: "No hay productos agregados en el carrito" });
      } else {
        cuentaModelo.usuario = idUsuario;
        cuentaModelo.fecha = new fecha();
        cuentaModelo.productos = buscarCarro.productos;
        cuentaModelo.total = buscarCarro.total;

        cuentaModelo.guardar((err, cuentaGuardar) => {
          if (err)
            return res.status(200).send({ message: "Error en el servidor 2" });

          if (cuentaGuardar) {
            buscarCarro.productos.forEach((productoCarrito) => {
              Producto.findOne({ _id: productoCarrito.producto }).exec(
                (err, datoProductos) => {
                  if (err) {
                  } else {
                    var newMercancia =
                      parseInt(datoProductos.monto) -
                      parseInt(productoCarrito.cantidad);
                    var newVenta =
                      parseInt(productoCarrito.cacntidad) +
                      parseInt(datoProductos.sales);

                    var newSchema = { monto: newMercancia, venta: newVenta };

                    Producto.findByIdAndUpdate(
                      productoCarrito.producto,
                      newSchema,
                      {
                        new: true,
                        useFindAndModify: false,
                      },
                      (err, productoActualizado) => {
                        if (err) {
                          console.log(err);
                        } else {
                          if (productoActualizado) {
                            console.log("Producto Actualizado");
                          } else {
                            console.log("Error");
                          }
                        }
                      }
                    );
                  }
                }
              );
            });
            Usuario.findByIdAndUpdate(
              idUsuario,
              {
                $push: {
                  compras: {
                    idCuenta: cuentaGuardar._id,
                    productos: buscarCarro.productos,
                    total: buscarCarro.total,
                  },
                },
              },
              { new: true },
              (err, compraGuardada) => {
                if (err) {
                  console.log(idUsuario);
                  return res
                    .status(200)
                    .send({ message: "Error en el servidor 3" });
                }
                if (compraGuardada) {
                  Carro.findByIdAndUpdate(
                    buscarCarro._id,
                    { $set: { productos: [], total: 0 } },
                    { new: true },
                    (err, borrarCarro) => {
                      if (err)
                        return res
                          .status(200)
                          .send({ message: "Error en el servidor" });

                      if (borrarCarro) {
                        return res.status(200).send({
                          message: "Factura creada con exito",
                          compraGuardada,
                        });
                      } else {
                        return res
                          .status(200)
                          .send({ message: "No se pudo limpiar el carrito" });
                      }
                    }
                  );
                } else {
                  return res.status(200).send({
                    message: "No se pudo guardar la compra en el usario",
                  });
                }
              }
            );
          } else {
            return res
              .status(200)
              .send({ message: "No se pudo guardar la factura" });
          }
        });
      }
    } else {
      return res.status(200).send({ message: "No se encotro el usuario" });
    }
  });
}


function listarCuentas(req, res) {
    if (req.usuarioAdmin.rol == "ADMIN") {
      Cuenta.find({}).exec((err, dato) => {
        if (dato) {
          res.status(200).send(dato);
        }
      });
    }
  }
  
  function verProductoFactura(req, res) {
    var cuentaId = req.params.id;
  
    if (req.usuarioAdmin.rol == "ADMIN") {
      Cuenta.findById(cuentaId).exec((err, dato) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });
  
        if (dato) {
          res.status(200).send(dato.productos);
        } else {
          return res
            .status(200)
            .send({ message: "Ingrese un id de factura correcto" });
        }
      });
    } else {
      return res.status(200).send({ message: "Usted no es administrador" });
    }
  }  

  module.exports = {
      crearCuenta,
      listarCuentas,
      verProductoFactura,
  };