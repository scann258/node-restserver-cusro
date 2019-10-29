const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');



// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se a seleccionado ningun archivo'
                }
            });
    }

    // Validar Tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        });

    }


    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });

    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });

        // Imagen Cargada

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

// IMAGEN USUARIO
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            //Borrar archivo
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err,
                message: 'El usuario no existe'
            });
        }

        if (!usuarioDB) {

            //Borrar archivo
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });

        }

        //Borrar archivo
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })

        })

    })
}

// IMAGEN PRODUCTO
function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            //Borrar archivo
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err,
                message: 'El producto no existe'
            });
        }

        if (!productoDB) {

            //Borrar archivo
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        }

        //Borrar archivo
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoDB) => {

            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            })

        })

    })




}





function borraArchivo(nombreImagen, tipo) {


    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {

        fs.unlinkSync(pathImagen);

    }


}


module.exports = app;