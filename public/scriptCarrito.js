let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let productos = [];

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
                    const total = producto.price * cantidad;
                    contCarrito.innerHTML += `
                    <tr>
                        <td><img class="imgCarrito" src="${producto.image}" alt="${producto.tituloTrad}"></td>    
                        <td>${producto.tituloTrad}</td>
                        <td>$${producto.price}</td>
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
    })
    .catch(error => console.error('Error obteniendo productos:', error));

function precioTotal() {
    let precioTotal = 0;
    for (let id in carrito) {
        if (id !== 'precioTotal') {
            const producto = productos.find(producto => producto.id === Number(id));
            if (producto) {
                const cantidad = carrito[id];
                const total = producto.price * cantidad;
                precioTotal += total;
            }
        }
    }
    carrito.precioTotal = precioTotal.toFixed(2);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log(`el precio total es ${precioTotal}`);
}

function disminuirCantidad(id) {
    if (carrito[id] > 1) {
        carrito[id]--;
    } else {
        delete carrito[id];
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
    precioTotal();
}

function aumentarCantidad(id) {
    carrito[id] = (carrito[id] || 0) + 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
    precioTotal();
}

function eliminarDelCarrito(id) {
    delete carrito[id];
    localStorage.clear;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();
    precioTotal();
}


function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}


function comprar() {
    precioTotal();
    let total = 0;
    for (let id in carrito) {
        if (id !== 'precioTotal') {
            const producto = productos.find(producto => producto.id === Number(id));
            if (producto) {
                const cantidad = carrito[id];
                const totalProducto = producto.price * cantidad;
                total += totalProducto;
            }
        }
    }

    fetch('/comprar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carrito),
    })
        .then(response => response.json())
        .then(data => {

            showNotification("Compra realizada con éxito, por un valor de $" + total.toFixed(2));
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
