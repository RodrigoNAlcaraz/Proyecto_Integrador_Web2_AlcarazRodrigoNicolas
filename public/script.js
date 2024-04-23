fetch('../productos')
    .then(response => response.json())
    .then(productos => {
        const contProducto = document.getElementById('productos');
        productos.forEach((producto, indice) => {
            const descuento = producto.descuento || 0;
            const precioConDescuento = producto.price * (1 - descuento / 100);
            const montoDescontado = producto.price - precioConDescuento;
            const conDescuento = descuento > 0;
            let precioHTML = `<p><strong>Precio:</strong> $${producto.price}</p>`;
            if (conDescuento) {
                precioHTML = `
                    <p><strong>Precio original:</strong> $${producto.price}</p>
                    <p><strong>Descuento:</strong> ${descuento}%</p>
                    <p><strong>Monto descontado:</strong> $${montoDescontado.toFixed(2)}</p>
                    <p class="precioFinal"><strong>Precio final:</strong> $${precioConDescuento.toFixed(2)}</p>
                `;
            }
            contProducto.innerHTML += `
                <div class="card" data-descuento="${conDescuento}">
                    <div class="offer-band">¡¡Oferta!!</div>
                    <img src="${producto.image}" alt="${producto.tituloTrad}">
                    <div class="card-content">
                        <h2>${producto.tituloTrad}</h2>
                        <p><strong>Categoria:</strong> ${producto.category}</p>
                        ${precioHTML}
                        <p class="description" desc="${producto.descripcionTrad}">${producto.descripcionTrad.substring(0, 30)}</p>
                        <button type="button" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
                    </div>
                </div>
            `;
        });
    })
    .catch(error => console.error('Error obteniendo productos:', error));

let carrito = JSON.parse(localStorage.getItem('carrito')) || {};

function agregarAlCarrito(id) {
    carrito[id] = (carrito[id] || 0) + 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    showNotification('Producto agregado al carrito');
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';

    }, 1000);
}

