'Use Strict'

var Carro =  require("../modelo/carro.modelo");
var Producto = require("../modelo/producto.modelo");

function agregarProductoACarrito(req, res){
    var idUsuario = req.usuarioCliente.sub;
    var params = req.body;

    if (req.usuarioCliente.rol == "CLIENTE") {
        if (params.nombre && params.cantidad) {
          Carro.findOne({ usuario: idUsuario }).exec((err, buscarCarro) => {
            if (err)
              return res.status(200).send({ message: "Error en el servidor" });
            if (buscarCarro) {
              carroId = buscarCarro._id;
              Producto.findOne({ nombre: params.nombre }).exec((err, buscarProducto) => {
                if (err)
                  return res.status(200).send({ message: "Error en el servidor" });
                if (buscarProducto) {
                  if (buscarProducto.cantidad == 0) {
                    return res.status(200).send({
                      message: "No hay articulos disponibles en este momento",
                    });
                  } else {
                    Carro.findByIdAndUpdate(
                      carroId,
                      {
                        $push: {
                          productos: {
                            producto: buscarProducto._id,
                            nombre: params.nombre,
                            cantidad: params.cantidad,
                            precio: buscarProducto.precio,
                          },
                        },
                      },
                      { new: true },
                      (err, agregarProducto) => {
                        if (err)
                          return res
                            .status(200)
                            .send({ message: "Error en el servidor" });
    
                        if (agregarProducto) {
                          var totalCarro =
                            parseInt(buscarCarro.total) +
                            parseInt(buscarProducto.precio) * parseInt(params.cantidad);
    
                          Carro.findByIdAndUpdate(
                            carroId,
                            { $set: { total: totalCarro } },
                            { new: true },
                            (err, finalTotal) => {
                              if (err)
                                return res
                                  .status(200)
                                  .send({ message: "Error en el servidor" });
    
                              if (finalTotal) {
                                return res.status(200).send({
                                  message:
                                    "Producto agregado al carrito correctamente",
                                  Total: finalTotal.total,
                                });
                              } else {
                                return res
                                  .status(200)
                                  .send({ message: "No se pudo agregar el total" });
                              }
                            }
                          );
                        } else {
                          return res.status(200).send({
                            message: "No se pudo agregar el producto al carrito",
                          });
                        }
                      }
                    );
                  }
                } else {
                  return res
                    .status(200)
                    .send({ message: "No se encontro el producto" });
                }
              });
            } else {
              return res.status(200).send({ message: "Error de login" });
            }
          });
        } else {
          return res.status(200).send({ message: "Ingrese todos los paramentros" });
        }
      } else {
        return res.status(200).send({
          message: "Usted es administrador y no puede agregar productos al carrito",
        });
      }
}

module.exports = {
    agregarProductoACarrito,
};