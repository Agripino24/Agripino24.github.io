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

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    const existente = carritoItems.find(p => p.nombre === nombre);
    
    if(existente) {
        existente.cantidad++;
    } else {
        carritoItems.push({ nombre, precio, cantidad: 1 });
    }
    
    renderCarrito();
}

// Event listener para botones de productos normales (si existen)
document.querySelectorAll('.agregar').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.producto_card');
        const nombre = card.dataset.nombre;
        const precio = Number(card.dataset.precio);
        agregarAlCarrito(nombre, precio);
    });
});

// Event listener para botones de productos en carruseles
document.querySelectorAll('.agregar_carrusel').forEach(btn => {
    btn.addEventListener('click', () => {
        const corte = btn.closest('.corte');
        const nombre = corte.dataset.nombre;
        const precio = Number(corte.dataset.precio);
        agregarAlCarrito(nombre, precio);
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
const mensaje_envio = document.getElementById('aviso_envio')
const btnWhatsEst1 = document.getElementById('pedir_whatsapp_est1');
const btnWhatsEst2 = document.getElementById('pedir_whatsapp_est2');

let mensajeFinal = '';
let numEst = '';

// Función para abrir el popup de confirmación
function abrirPopupConfirmacion(numeroWhatsApp) {
    if(carritoItems.length === 0) return;

    numEst = numeroWhatsApp;
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
    console.log(totalPopup)
    mensaje += `%0A%0ATotal: $${total}`;

    if(totalPopup.textContent >= 2500){ mensaje_envio.innerHTML = `<span style="color: lightgreen;">Envío gratis</span>` }
    else{ mensaje_envio.innerHTML = `<span style="color: #d4a373;">Tu cuenta no supera los $2500</span>` }

    mensajeFinal = mensaje;
    popup.classList.add('activo');
}

// Event listeners para ambos botones de WhatsApp
if(btnWhatsEst1) {
    btnWhatsEst1.addEventListener('click', () => {
        abrirPopupConfirmacion('https://wa.me/5514311482');
    });
}

if(btnWhatsEst2) {
    btnWhatsEst2.addEventListener('click', () => {
        abrirPopupConfirmacion('https://wa.me/5620412727');
    });
}

// Confirmar envío
confirmarBtn.onclick = () => {
    popup.classList.remove('activo');
    window.open(`${numEst}?text=${mensajeFinal}`, '_blank');
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



// Función para inicializar un carrusel
function inicializarCarrusel(contenedor) {
    const track = contenedor.querySelector('.carrusel_track');
    const items = contenedor.querySelectorAll('.corte');
    const btnLeft = contenedor.querySelector('.btn_left_carne, .btn_left_queso, .btn_left_marisco');
    const btnRight = contenedor.querySelector('.btn_right_carne, .btn_right_queso, .btn_right_marisco');

    let index = 0;
    let itemsVisible = 3;

    function updateItemsVisible() {
        if(window.innerWidth <= 768) itemsVisible = 1;
        else if(window.innerWidth <= 1024) itemsVisible = 2;
        else itemsVisible = 3;

        moveCarousel();
    }

    function moveCarousel() {
        const itemWidth = items[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        track.style.transform = `translateX(-${index * (itemWidth + gap)}px)`;
    }

    if(btnRight) {
        btnRight.onclick = () => {
            if(index < items.length - itemsVisible) {
                index++;
                moveCarousel();
            }
        };
    }

    if(btnLeft) {
        btnLeft.onclick = () => {
            if(index > 0) {
                index--;
                moveCarousel();
            }
        };
    }

    window.addEventListener('resize', updateItemsVisible);
    updateItemsVisible();
}

// Inicializar todos los carruseles
const carruselCarne = document.querySelector('.div_cortes_carne');
const carruselQueso = document.querySelector('.div_quesos');
const carruselMarisco = document.querySelector('.div_mariscos');

if(carruselCarne) inicializarCarrusel(carruselCarne);
if(carruselQueso) inicializarCarrusel(carruselQueso);
if(carruselMarisco) inicializarCarrusel(carruselMarisco);