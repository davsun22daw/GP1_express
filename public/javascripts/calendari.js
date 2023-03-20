let tareaList = document.querySelector('#tareas ul');

// Recorrer todas las claves almacenadas en sessionStorage
for (let i = 1; i <= sessionStorage.length; i++) {
  // Obtener los datos de la actividad almacenados en sessionStorage
  let datosActividad = JSON.parse(sessionStorage.getItem(`datosActividad${i}`));

  // Crear un nuevo <li> con los datos de la actividad
  let tarea = document.createElement('li');
  tarea.draggable = true;
  tarea.textContent = datosActividad.nombre;

  // Agregar el nuevo <li> a la lista de tareas
  tareaList.appendChild(tarea);
}










let MIDA = 90; // tamaño de cada celda en píxeles
let TOPMARGE = 30;
let DiasSemana = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"];
let canvas = document.getElementById('calendari');
let ctx = canvas.getContext('2d');
var actividades = [{nombre: 'Actividad 1'}, {nombre: 'Actividad 2'}];
canvas.style.width = '630px';
canvas.style.height = '480px';

let draggedItem = null;



function dibuixar() {
  if (canvas.getContext) {
    for (let i = 0; i < 31; i++) {
      let x = (i % 7) * MIDA; // x-coordenada de la celda
      let y = Math.floor(i / 7) * MIDA + TOPMARGE; // y-coordenada de la celda
      ctx.strokeRect(x, y, MIDA, MIDA);
    }

    // Escribe el número de cada día en cada celda
    for (let i = 0; i < 31; i++) {
      let x = (i % 7) * MIDA + MIDA / 2; // x-coordenada del centro de la celda
      let y = Math.floor(i / 7) * MIDA + MIDA + TOPMARGE / 2; // y-coordenada del centro de la celda
      ctx.fillText(i + 1, x, y - 60);
      console.log(x, y);
    }
    let j = 0;
    for (let i = 0; i < 7; i++) {
      ctx.fillText(DiasSemana[i], j, 20);
      j += MIDA
    }
  }
}


function handleDragStart(e) {
  draggedItem = this;
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (draggedItem !== this) {
    
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left)-30;
    let y = (e.clientY - rect.top);
    // Establecer un tamaño de fuente fijo antes de dibujar el texto
    ctx.font = '20px Arial';
    ctx.fillText(draggedItem.textContent, x, y);
  }
  return false;
}


function handleDragEnd(e) {
  this.classList.remove('over');
}

const tasks = document.querySelectorAll('#tareas li');
tasks.forEach((task) => {
  task.addEventListener('dragstart', handleDragStart, false);
  task.addEventListener('dragend', handleDragEnd, false);
});

const calendar = document.getElementById('calendari');
calendar.addEventListener('dragover', handleDragOver, false);
calendar.addEventListener('dragenter', handleDragEnter, false);
calendar.addEventListener('dragleave', handleDragLeave, false);
calendar.addEventListener('drop', handleDrop, false);


window.addEventListener('load', dibuixar, false);

function mostrarActividades() {
  let actividades = [];
  for (let i = 1; i <= contador; i++) {
    let datosActividad = sessionStorage.getItem(`datosActividad${i}`);
    if (datosActividad) {
      let actividad = JSON.parse(datosActividad);
      actividades.push(actividad);
    }
  }
  const listaTareas = document.querySelector('#tareas ul');
  actividades.forEach((actividad) => {
    const tarea = document.createElement('li');
    tarea.draggable = true;
    tarea.textContent = actividad.nombre;
    listaTareas.appendChild(tarea);
  });
}

mostrarActividades();