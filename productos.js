const sidebar = document.querySelector('.sidebar')
const barra = document.querySelector('.barra')

function abrirSidebar(){ sidebar.style.display = 'flex' }
function cerrarSidebar(){ sidebar.style.display = 'none' }

const carrito = document.querySelector('.carrito');
const btnCarrito = document.querySelector('.btn_carrito');
const cerrarCarrito = document.getElementById('cerrar_carrito');
const itemsContainer = document.querySelector('.carrito_items');
const totalSpan = document.getElementById('total');
const vaciarBtn = document.getElementById('vaciar_carrito');

let carritoItems = [];

btnCarrito.onclick = () => carrito.classList.add('activo');
cerrarCarrito.onclick = () => carrito.classList.remove('activo');

document.querySelectorAll('.agregar').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.producto_card');
        const nombre = card.dataset.nombre;
        const precio = Number(card.dataset.precio);

        const existente = carritoItems.find(p => p.nombre === nombre);

        if(existente){ existente.cantidad++;}
            else{ carritoItems.push({ nombre, precio, cantidad: 1 }); }

        renderCarrito();
    });
});

function renderCarrito(){
    itemsContainer.innerHTML = '';
    let total = 0;

    carritoItems.forEach((item, index) => {
        total += item.precio * item.cantidad;
        
        const div = document.createElement('div');
        div.classList.add('item');

        if(item.cantidad == 1){ 
            div.innerHTML = `
                <span>${item.nombre}</span>
                <div class="item_controles">
                    <button onclick="cambiarCantidad(${index}, -1)">−</button>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button onclick="eliminarProducto(${index})">✕</button>
                </div>
            `;
        } else{
            div.innerHTML = `
                <span>${item.nombre} × ${item.cantidad}</span>
                <div class="item_controles">
                    <button onclick="cambiarCantidad(${index}, -1)">−</button>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button onclick="eliminarProducto(${index})">✕</button>
                </div>
            `;
        }

        itemsContainer.appendChild(div);
    });

    totalSpan.textContent = total;
}

function cambiarCantidad(index, cambio){
    carritoItems[index].cantidad += cambio;

    if(carritoItems[index].cantidad <= 0){ carritoItems.splice(index, 1); }
    renderCarrito();
}

function eliminarProducto(index){
    carritoItems.splice(index, 1);
    renderCarrito();
}

vaciarBtn.onclick = () => {
    carritoItems = [];
    renderCarrito();
};

const popup = document.getElementById('popup_confirmar');
const confirmarBtn = document.getElementById('confirmar_pedido');
const cancelarBtn = document.getElementById('cancelar_pedido');
const resumenPopup = document.getElementById('popup_resumen');
const totalPopup = document.getElementById('popup_total');

let mensajeFinal = '';

document.getElementById('pedir_whatsapp').onclick = () => {
    if(carritoItems.length === 0) return;

    resumenPopup.innerHTML = '';
    let total = 0;
    let mensaje = `Hola, quisiera hacer el siguiente pedido:%0A%0A`;

    carritoItems.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        // Mostrar en popup
        const div = document.createElement('div');
        div.classList.add('popup_item');
        div.innerHTML = `
            <span>${item.nombre} × ${item.cantidad}</span>
            <span>$${subtotal}</span>
        `;
        resumenPopup.appendChild(div);

        // Mensaje WhatsApp
        mensaje += `%0A- ${item.nombre} x${item.cantidad} → ($${subtotal})`;
    });

    totalPopup.textContent = total;
    mensaje += `%0A%0ATotal: $${total}`;

    mensajeFinal = mensaje;
    popup.classList.add('activo');
};

// Confirmar envío
confirmarBtn.onclick = () => {
    popup.classList.remove('activo');
    window.open(`https://wa.me/5218110813325?text=${mensajeFinal}`, '_blank');
};

// Cancelar
cancelarBtn.onclick = () => {
    popup.classList.remove('activo');
};

// Click fuera del modal
popup.onclick = (e) => {
    if(e.target === popup){
        popup.classList.remove('activo');
    }
};


