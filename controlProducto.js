const fetch = require('node-fetch');
const traducir = require('node-google-translate-skidz');
const fs = require('fs');
const productosConDescuento = require('./productosEnDescuento.json');

const obtenerDescuento = (idProducto) => {
    const producto = productosConDescuento.find(p => p.id === idProducto);
    return producto ? producto.descuento : 0;
}

const traducirTexto = (texto, ingles, esp) => new Promise((resolver, rechazar) => {
    traducir({
        text: texto,
        source: ingles,
        target: esp
    }, (resultado) => {
        if (resultado) {
            resolver(resultado.translation);
        } else {
            rechazar('Error al traducir texto');
        }
    });
});

const traducirProductos = async (productos) => {
    try {
        const productosTraducidos = await Promise.all(productos.map(async (producto) => {
            const tituloTrad = await traducirTexto(producto.title, 'en', 'es');
            const descripcionTrad = await traducirTexto(producto.description, 'en', 'es');
            return { ...producto, tituloTrad, descripcionTrad };
        }));
        return productosTraducidos;
    } catch (error) {
        console.error('Error al traducir productos:', error);
        return productos;
    }
}

const guardarDatosEnJson = async () => {
    try {
        const respuesta = await fetch('https://fakestoreapi.com/products');
        const productos = await respuesta.json();
        const productosConDescuento = productos.map(producto => {
            const descuento = obtenerDescuento(producto.id);
            return { ...producto, descuento };
        });

        const productosTraducidos = await traducirProductos(productosConDescuento);

        fs.writeFileSync('productos.json', JSON.stringify(productosTraducidos, null, 2));
        console.log('Productos guardados correctamente.');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
    }
}

const cargarProductosDesdeArchivo = (callback) => {
    fs.readFile('productos.json', 'utf8', (error, datos) => {
        if (error) {
            console.error('Error al cargar los datos:', error);
            callback([]);
        } else {
            callback(JSON.parse(datos));
        }
    });
}

module.exports = {
    guardarDatosEnJson,
    cargarProductosDesdeArchivo
}
