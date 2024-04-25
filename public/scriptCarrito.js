let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let productos = [];
let precioFinal = document.getElementById('precioFinalCompra');

fetch('../productos')
    .then(response => response.json())
    .then(data => {
        productos = data;
        const contCarrito = document.getElementById('carrito');
        Object.keys(carrito).forEach(id => {
            if (id !== 'precioTotal') {
                const producto = productos.find(producto => producto.id === Number(id));
                if (producto) {
                    const cantidad = carrito[id] || 1;
                    const descuento = producto.descuento || 0;
                    const precioConDescuento = producto.price * (1 - descuento / 100);
                    const total = precioConDescuento * cantidad;
                    let precioHTML = `<td>$${producto.price.toFixed(2)}</td>`;
                    if (descuento > 0) {
                        precioHTML = `
                            <td><del>$${producto.price.toFixed(2)}</del> <span style="color:green">$${precioConDescuento.toFixed(2)}</span> (${descuento}% descuento)</td>
                        `;
                    }
                    contCarrito.innerHTML += `
                        <tr>
                            <td><img class="imgCarrito" src="${producto.image}" alt="${producto.tituloTrad}"></td>    
                            <td>${producto.tituloTrad}</td>
                            ${precioHTML}
                            <td>
                                <button onclick="disminuirCantidad(${id})">-</button>
                                ${cantidad}
                                <button onclick="aumentarCantidad(${id})">+</button>
                            </td>
                            <td>$${total.toFixed(2)}</td>
                            <td><button onclick="eliminarDelCarrito(${id})">Eliminar</button></td>
                        </tr>
                    `;
                } else {
                    console.error(`No se encontró ningún producto con el id ${id}`);
                }
            }
        });
        precioTotal();
        precioFinal.innerHTML = `Total a Pagar: $${carrito.precioTotal}.-`;
    })
    .catch(error => console.error('Error obteniendo productos:', error));


const precioTotal = () =>{
    let precioTotal = 0;
    for (let id in carrito) {
        if (id !== 'precioTotal') {
            const producto = productos.find(producto => producto.id === Number(id));
            if (producto) {
                const cantidad = carrito[id];
                const descuento = producto.descuento || 0;
                const precioConDescuento = producto.price * (1 - descuento / 100);
                const total = precioConDescuento * cantidad;
                precioTotal += total;
            }
        }
    }
    carrito.precioTotal = precioTotal.toFixed(2);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const disminuirCantidad = (id) => {
    if (carrito[id] > 1) {
        carrito[id]--;
    } else {
        delete carrito[id];
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
    precioTotal();
}

const aumentarCantidad = (id) =>{
    carrito[id] = (carrito[id] || 0) + 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
    precioTotal();
}

const eliminarDelCarrito = (id) => {
    delete carrito[id];
    localStorage.clear;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
    precioTotal();
}


const showNotification = (message) => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}


const comprar = () =>{
    fetch('/comprar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carrito),
    })
        .then(response => response.json())
        .then(data => {

            showNotification("Compra realizada con éxito, por un valor de $" + carrito.precioTotal);
            carrito = {};
            localStorage.setItem('carrito', JSON.stringify(carrito));
            setTimeout(() => {
                location.reload();
            }, 3200);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
