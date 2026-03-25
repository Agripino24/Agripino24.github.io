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

const divNotifProd = document.querySelector('.notif_prod');
const notifProd = document.querySelector('.notif_prod span');

let carritoItems = [], nItems = 0;

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

    nItems += 1
    if(nItems > 0){ divNotifProd.style.display = 'flex'; }
    
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

// Event listener para botones de productos en carruseles Y paquetes
document.querySelectorAll('.agregar_carrusel').forEach(btn => {
    btn.addEventListener('click', () => {
        // Buscar el elemento padre más cercano (corte o paquete)
        const item = btn.closest('.corte') || btn.closest('.paquete');
        
        if(item) {
            const nombre = item.dataset.nombre;
            const precio = Number(item.dataset.precio);
            agregarAlCarrito(nombre, precio);
        }
    });
});

function renderCarrito(){
    itemsContainer.innerHTML = '';
    let total = 0;

    carritoItems.forEach((item, index) => {
        total += item.precio * item.cantidad;
        
        const div = document.createElement('div');
        div.classList.add('item');

        div.innerHTML = `
            <span>${item.nombre} × ${item.cantidad}</span>
            <div class="item_controles">
                <button onclick="cambiarCantidad(${index}, -1)">−</button>
                <button onclick="cambiarCantidad(${index}, 1)">+</button>
                <button onclick="eliminarProducto(${index}, ${item.cantidad})">✕</button>
            </div>
        `;
        notifProd.innerHTML = `<span>${nItems}</span>`

        itemsContainer.appendChild(div);
    });

    totalSpan.textContent = total;
}

function cambiarCantidad(index, cambio){
    carritoItems[index].cantidad += cambio;
    if(cambio == 1){
        nItems += 1
        notifProd.innerHTML = `<span>${nItems}</span>`
    } else if(cambio == -1){
        nItems -= 1
        notifProd.innerHTML = `<span>${nItems}</span>`
    }
    if(nItems <= 0){ divNotifProd.style.display = 'none'; }

    if(carritoItems[index].cantidad <= 0){ carritoItems.splice(index, 1); }
    renderCarrito();
}

function eliminarProducto(index, cantidad){
    nItems -= cantidad
    notifProd.innerHTML = `<span>${nItems}</span>`
    if(nItems <= 0){ divNotifProd.style.display = 'none'; }

    carritoItems.splice(index, 1);
    renderCarrito();
}

vaciarBtn.onclick = () => {
    carritoItems = [];
    renderCarrito();
    nItems = 0;
    divNotifProd.style.display = 'none';
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
function abrirPopupConfirmacion(numeroWhatsApp){
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
if(btnWhatsEst1){
    btnWhatsEst1.addEventListener('click', () => {
        abrirPopupConfirmacion('https://wa.me/5514311482');
    });
}

if(btnWhatsEst2){
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
cancelarBtn.onclick = () => { popup.classList.remove('activo'); };

// Click fuera del modal
popup.onclick = (e) => { if(e.target === popup){ popup.classList.remove('activo'); } };

// Función para inicializar un carrusel
function inicializarCarrusel(contenedor){
    const track = contenedor.querySelector('.carrusel_track');
    const items = contenedor.querySelectorAll('.corte');
    const btnLeft = contenedor.querySelector('[class*="btn_left"]'); 
    const btnRight = contenedor.querySelector('[class*="btn_right"]');

    let index = 0;
    let itemsVisible = 3;

    function updateItemsVisible(){
        if(window.innerWidth <= 768) itemsVisible = 1;
        else if(window.innerWidth <= 1024) itemsVisible = 2;
        else itemsVisible = 3;

        if(index > items.length - itemsVisible){ index = Math.max(0, items.length - itemsVisible); }

        moveCarousel();
    }

    function moveCarousel(){
        const itemWidth = items[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        track.style.transform = `translateX(-${index * (itemWidth + gap)}px)`;
    }

    if(btnRight){
        btnRight.onclick = () => {
            if(index + itemsVisible < items.length){
                index += itemsVisible;
                if(index > items.length - itemsVisible){ index = items.length - itemsVisible; }
                
                moveCarousel();
            }
        };
    }

    if(btnLeft){
        btnLeft.onclick = () => {
            if(index > 0){
                index -= itemsVisible;
                if(index < 0){ index = 0; }
                moveCarousel();
            }
        };
    }

    window.addEventListener('resize', updateItemsVisible);
    updateItemsVisible();
}

const carruselCarne = document.querySelector('.div_cortes_carne');
const carruselCarneArgentina = document.querySelector('.div_carne_argentina');
const carruselMarisco = document.querySelector('.div_mariscos');
const carruselQuesos = document.querySelector('.div_quesos')

if(carruselCarne) inicializarCarrusel(carruselCarne);
if(carruselCarneArgentina) inicializarCarrusel(carruselCarneArgentina);
if(carruselMarisco) inicializarCarrusel(carruselMarisco);
if(carruselQuesos) inicializarCarrusel(carruselQuesos);

const leftCarne = document.querySelector('.btn_left_carne')
const rightCarne = document.querySelector('.btn_right_carne')
let contadorCarne = 0

leftCarne.addEventListener('click', () => {
    contadorCarne -= 10
    if(contadorCarne == 0){ leftCarne.classList.add('inactivo') }
    else{ rightCarne.classList.remove('inactivo') }
})
rightCarne.addEventListener('click', () => {
    contadorCarne += 10
    if(contadorCarne > 100){ rightCarne.classList.add('inactivo') }
    else{ leftCarne.classList.remove('inactivo') }
})

const leftArgentina = document.querySelector('.btn_left_carne_argentina')
const rightArgentina = document.querySelector('.btn_right_carne_argentina')
const leftMariscos = document.querySelector('.btn_left_marisco')
const rightMariscos = document.querySelector('.btn_right_marisco')

leftArgentina.addEventListener('click', () => { irIzquierda(leftArgentina, rightArgentina) })
rightArgentina.addEventListener('click', () => { irDerecha(rightArgentina, leftArgentina) })
leftMariscos.addEventListener('click', () => { irIzquierda(leftMariscos, rightMariscos) })
rightMariscos.addEventListener('click', () => { irDerecha(rightMariscos, leftMariscos) })

function irIzquierda(left, right){ left.classList.add('inactivo'); right.classList.remove('inactivo') }
function irDerecha(right, left){ right.classList.add('inactivo'); left.classList.remove('inactivo') }