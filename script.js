// Sidebar y barra
const sidebar = document.querySelector('.sidebar')
const barra = document.querySelector('.barra')

function abrirSidebar(){ sidebar.style.display = 'flex' }
function cerrarSidebar(){ sidebar.style.display = 'none' }

div_intro = document.querySelector('.div_div_intro')
div_intro.style.backgroundImage = 'url(/img/establecimiento\ 2.webp)'

// Opiniones
const track = document.querySelector('.opiniones-track');
let paused = false; x = 0;
const speed = 1;

const cards = [...track.children];
cards.forEach(card => track.appendChild(card.cloneNode(true)));

function animar(){
    if(!paused){
        x += speed;
        track.style.transform = `translateX(-${x}px)`;
        if(x >= track.scrollWidth / 2) x = 0;
    }
    requestAnimationFrame(animar);
}

track.querySelectorAll('.opinion-card').forEach(card => {
    card.addEventListener('mouseenter', () => paused = true);
    card.addEventListener('mouseleave', () => paused = false);
});

animar();

// Horarios popup
const overlay = document.querySelector('.overlay')
const cerrar = document.querySelectorAll('.cerrar_popup').forEach(cerrar => { cerrar.addEventListener('click', cerrarPopup) });

const btn1 = document.querySelector('.hora_establecimiento1').addEventListener('click', abrirPopup1)
const popup1 = document.querySelector('.popup1')

const btn2 = document.querySelector('.hora_establecimiento2').addEventListener('click', abrirPopup2)
const popup2 = document.querySelector('.popup2')

function abrirPopup1(){
    overlay.style.visibility = 'visible'
    overlay.style.opacity = 1
    popup1.style.display = 'block'
    popup2.style.display = 'none'
}
function abrirPopup2(){
    overlay.style.visibility = 'visible'
    overlay.style.opacity = 1
    popup1.style.display = 'none'
    popup2.style.display = 'block'
}
function cerrarPopup(){
    overlay.style.opacity = 0
    setTimeout(() =>{ overlay.style.visibility = 'hidden', 300 }, 300)
}