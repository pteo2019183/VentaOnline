'use strict'

var Usuario = require("../modelo/usuario.modelo");
var Carro = require("../modelo/categoria.modelo");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../servicio/jwt");
const e = require("express");

function guardarUsuario(req, res) {
    var modeloUsuario = new Usuario();
    var modeloCarro = new Carro();
    var params = req.body;
  
    if (params.name && params.user && params.password && params.email) {
      modeloUsuario.nombre = params.nombre;
      modeloUsuario.usuario = params.usuario;
      modeloUsuario.correo = params.correo;
      modeloUsuario.clave = params.clave;
  
      Usuario.find({
        $or: [{ usuario: modeloUsuario.usuario }, { correo: modeloUsuario.correo }],
      }).exec((err, buscarUsuario) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" });
  
        if (buscarUsuario && buscarUsuario.length >= 1) {
          return res.status(500).send({ message: "El usuario ya existe" });
        } else {
          bcrypt.hash(params.clave, null, null, (err, encryptedClave) => {
            modeloUsuario.clave = encryptedClave;
  
            modeloUsuario.save((err, guardarUsuario) => {
              if (err)
                return res
                  .status(200)
                  .send({ message: "Error al guardar usuario" });
  
              if (guardarUsuario) {
                modeloCarro.usuario = guardarUsuario._id;
                modeloCarro.save((err, guardarCarro) => {
                  if (err)
                    return res
                      .status(200)
                      .send({ message: "Error en el servidor" });
  
                  if (guardarCarro) {
                    res.status(200).send({
                      userSaved,
                      message: "Se creo su carrito listo para agregar productos",
                    });
                  } else {
                    return res
                      .status(200)
                      .send({ message: "No se pudo crear el carrito" });
                  }
                });
              } else {
                res
                  .status(404)
                  .send({ mensaje: "No se ha podido registrar el usuario" });
              }
            });
          });
        }
      });
    } else {
      return res.status(200).send({ message: "Ingrese todos los parametros" });
    }
  }

  function login(req, res) {
    var params = req.body;
    Usuario.findOne(
      {
        usuario: params.usuario,
      },
      (err, buscarUsuario) => {
        if (err) return res.status(200).send({ message: "Error en la peticion" });
  
        if (buscarUsuario) {
          bcrypt.compare(
            params.clave,
            buscarUsuario.clave,
            (err, verificarClave) => {
              if (verificarClave) {
                if (buscarUsuario.rol == "ADMIN") {
                  if (params.getToken === "true") {
                    console.log("Token de aministrador creado");
                    return res.status(200).send({
                      token: jwt.createTokenAdmin(buscarUsuario),
                    });
                  } else {
                    buscarUsuario.clave = undefined;
                    return res.status(200).send({
                      buscarUsuario,
                    });
                  }
                } else if (buscarUsuario.rol == "CLIENTE") {
                  if (params.getToken === "true") {
                    console.log("Token de Cliente creado");
  
                    var arrayCompra = [];
                    buscarUsuario.purchases.forEach((arryCompras) => {
                      arrayCompra.push(arrayCompra);
                      console.log(arrayCompra);
                      console.log(arrayCompra);
                    });
                    return res.status(200).send({
                      token: jwt.createTokenClient(buscarUsuario),
                      arrayCompra,
                    });
                  } else {
                    buscarUsuario.clave = undefined;
                    return res.status(200).send({
                      buscarUsuario,
                      arrayCompra,
                    });
                  }
                }
              } else {
                return res
                  .status(500)
                  .send({ message: "El usuario no se a podido identificar" });
              }
            }
          );
        } else {
          return res.status(500).send({ message: "Error al buscar usuario" });
        }
      }
    );
  }

  function ascenderCliente(req, res) {
  var params = req.body;

  if (req.usuarioAdmin.rol == "ADMIN") {
    Usuario.findOne({ usuario: params.usuario }).exec((err, buscarUsuario) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
      if (buscarUsuario) {
        Usuario.findByIdAndUpdate(
          buscarUsuario._id,
          { $set: { rol: "ADMIN" } },
          { new: true },
          (err, actualizarUsuario) => {
            if (err)
              return res.status(200).send({ message: "Error en el servidor" });
            if (actualizarUsuario) {
              return res
                .status(200)
                .send({ message: "Usuario Ascendido con exito", updateUser });
            } else {
              return res.status(200).send({ message: "No se pudo ascencer" });
            }
          }
        );
      } else {
        return res
          .status(200)
          .send({ message: "No se encontro el usuario con ese nombre" });
      }
    });
  } else {
    return res
      .status(200)
      .send({ message: "Usted no es administrador para ascender clientes" });
  }
}

function editarUsuarioCliente(req, res) {
    var ClienteId = req.params.idCliente;
    var params = req.body;
  
    delete params.clave;
  
    Usuario.findOne({ _id: ClienteId, rol: "CLIENTE" }).exec((err, rolAdquerido) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (rolAdquerido) {
        if (req.usuarioAdmin.rol == "ADMIN") {
          Usuario.findByIdAndUpdate(
            rolAdquerido._id,
            params,
            { new: true },
            (err, actualizarUsuario) => {
              if (err)
                return res.status(200).send({ message: "Error en el servidor" });
  
              if (actualizarUsuario) {
                return res.status(200).send({ userUpdate });
              }
            }
          );
        } else {
          return res.status(200).send({
            message:
              "Usted no es un administrador no puede editar otros clientes",
          });
        }
      } else {
        return res
          .status(200)
          .send({ message: "No se pudo encontrar el cliente" });
      }
    });
  }

  function editarMiCuenta(req, res) {
    var ClienteId = req.params.idCliente;
    var params = req.body;
  
    delete params.clave;
  
    Usuario.findOne({ _id: ClienteId, rol: "CLIENTE" }).exec((err, rolAdquerido) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (rolAdquerido) {
        if (req.usuarioCliente.sub == ClienteId) {
          Usuario.findByIdAndUpdate(
            rolAdquerido._id,
            params,
            { new: true },
            (err, actualizarUsuario) => {
              if (err)
                return res.status(200).send({ message: "Error en el servidor" });
  
              if (actualizarUsuario) {
                return res.status(200).send({ userUpdate });
              }
            }
          );
        } else {
          return res.status(200).send({
            message: "No puede editar una cuenta diferente",
          });
        }
      } else {
        return res
          .status(200)
          .send({ message: "No se pudo encontrar el cliente" });
      }
    });
  }

  function eliminarUsuarioCliente(req, res) {
    var ClienteId = req.params.idCliente;
  
    Usuario.findOne({ _id: ClienteId, rol: "CLIENTE" }).exec((err, rolAdquerido) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (rolAdquerido) {
        if (req.usuarioAdmin.rol == "ADMIN") {
          Usuario.findByIdAndDelete(rolAdquerido._id, (err, eliminarUsuario) => {
            if (err)
              return res.status(200).send({ message: "Error en el servidor" });
  
            if (eliminarUsuario) {
              Carro.findOneAndDelete({ usuario: ClienteId }, (err, eliminarCarro) => {
                if (err)
                  return res
                    .status(200)
                    .send({ message: "Error en el servidor" });
  
                if (eliminarCarro) {
                  return res
                    .status(200)
                    .send({ message: "Se elimino el cliente con exito" });
                } else {
                  return res
                    .status(200)
                    .send({ message: "No se pudo eliminar el carrito  " });
                }
              });
            } else {
              return res
                .status(200)
                .send({ message: "No se pudo eliminar el cliente" });
            }
          });
        } else {
          return res.status(200).send({
            message: "Usted no es un administrador no puede eliminar clientes",
          });
        }
      } else {
        return res.status(200).send({
          message:
            "No se pudo encontrar el cliente o el usuario es administrador",
        });
      }
    });
  }

  function eleminarMiCuenta(req, res) {
    var ClienteId = req.params.idCliente;
  
    Usuario.findOne({ _id: ClienteId, rol: "CLIENTE" }).exec((err, rolAdquerido) => {
      if (err) return res.status(200).send({ message: "Error en el servidor" });
  
      if (rolAdquerido) {
        if (req.usuarioCliente.sub == ClienteId) {
          Usuario.findByIdAndDelete(rolAdquerido._id, (err, eliminarUsuario) => {
            if (err)
              return res.status(200).send({ message: "Error en el servidor" });
  
            if (eliminarUsuario) {
              Cart.findOneAndDelete({ usuario: ClienteId }, (err, eliminarCarro) => {
                if (err)
                  return res
                    .status(200)
                    .send({ message: "Error en el servidor" });
  
                if (eliminarCarro) {
                  return res
                    .status(200)
                    .send({ message: "Se elimino el cliente con exito" });
                } else {
                  return res
                    .status(200)
                    .send({ message: "No se pudo eliminar el carrito  " });
                }
              });
            } else {
              return res
                .status(200)
                .send({ message: "No se pudo eliminar el cliente" });
            }
          });
        } else {
          return res.status(200).send({
            message: "Usted no puede eliminar este cliente",
          });
        }
      } else {
        return res.status(200).send({
          message:
            "No se pudo encontrar el cliente o el usuario es administrador",
        });
      }
    });
  }

module.exports ={
    guardarUsuario,
    login,
    ascenderCliente,
    editarUsuarioCliente,
    eliminarUsuarioCliente,
    eleminarMiCuenta,
    editarMiCuenta,
};