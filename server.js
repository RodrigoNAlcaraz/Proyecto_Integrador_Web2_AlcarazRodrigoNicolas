const express = require('express');
const fs = require('fs');
//const fetch = require('node-fetch');
const app = express();
const PUERTO = process.env.PORT || 3000;

const {
    guardarDatosEnJson,
    cargarProductosDesdeArchivo
} = require('./controlProducto.js');

app.use(express.json());

app.get('/productos', async (req, res) => {
    try {
        cargarProductosDesdeArchivo((productos) => {
            res.json(productos);
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.post('/comprar', (req, res) => {
    const carrito = req.body;

    // Lee las compras existentes
    let compras;
    try {
        compras = JSON.parse(fs.readFileSync('compras.json', 'utf8'));
    } catch (error) {
        compras = [];
    }

    let ultimoIdCompra = 0;
    if (compras.length > 0) {
        ultimoIdCompra = Math.max(...compras.map(compra => compra.id));
    }
    ultimoIdCompra++;

    const compra = { id: ultimoIdCompra, detalles: { ...carrito, fecha: new Date().toLocaleString() } };

    // Agrega la nueva compra a la lista
    compras.push(compra);
    // Guarda la lista actualizada de compras
    fs.writeFileSync('compras.json', JSON.stringify(compras, null, 2));
    console.log('Compra realizada:', compra);
    res.json({ message: 'Compra realizada con éxito, con el ID de compra ' + ultimoIdCompra });
});

app.use(express.static('public'));

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

guardarDatosEnJson();

