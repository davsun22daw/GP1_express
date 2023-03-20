const form = document.querySelector('form');
const nombre = form.querySelector('#nombre');
const id = form.querySelector('#id');
const descripcion = form.querySelector('#descripcion');
const concepto = form.querySelector('#concepto');
const duracion = form.querySelector('#duracion');
let contador = 0;

function guardarDatos() {
  const datos = {
    nombre: nombre.value,
    id: id.value,
    descripcion: descripcion.value,
    concepto: concepto.value,
    duracion: duracion.value
  };
  
  // Incrementamos el contador para generar una clave única en sessionStorage
  contador++;
  
  // Convertimos el objeto a formato JSON y lo guardamos en sessionStorage con una clave única
  sessionStorage.setItem(`datosActividad${contador}`, JSON.stringify(datos));
  


  const tarea = document.createElement('li');
  tarea.draggable = true;
  tarea.textContent = datos.nombre;
  document.querySelector('#tareas ul').appendChild(tarea);
  
  // Limpiamos los campos del formulario
  form.reset();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  guardarDatos();
});

mostrarActividades();