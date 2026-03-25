// Sidebar y barra
const sidebar = document.querySelector('.sidebar')
const barra = document.querySelector('.barra')

function abrirSidebar(){ sidebar.style.display = 'flex' }
function cerrarSidebar(){ sidebar.style.display = 'none' }

const overlay = document.querySelector('.seccion_popups')
const servicio = document.querySelectorAll('.servicio_card')
const popups = document.querySelectorAll('.popup_servicios')

const cerrar = document.querySelectorAll('.cerrar_popup').forEach(cerrar => { 
    cerrar.addEventListener('click', cerrarServicio) 
});

function abrirServicio(popup){
    overlay.style.opacity = 1;
    overlay.style.visibility = 'visible';

    for(let i = 0; i < popups.length; i++){
        if(i != popup){ popups[i].style.display = 'none'; }
    }
}
function cerrarServicio(){
    overlay.style.opacity = 0;
    overlay.style.visibility = 'hidden';

    for(let i = 0; i < popups.length; i++){ popups[i].style.display = 'block'; }
}

for(let i = 0; i < servicio.length; i++){
    servicio[i].addEventListener('click', () => { abrirServicio(i) })
}