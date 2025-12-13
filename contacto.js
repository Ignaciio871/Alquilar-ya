 // Cargar salón pre-seleccionado si viene de la página principal
window.addEventListener('DOMContentLoaded', function() {
  const salonSeleccionado = sessionStorage.getItem('salonSeleccionado');
  if (salonSeleccionado) {
    document.getElementById('salon').value = salonSeleccionado;
    sessionStorage.removeItem('salonSeleccionado');
  }

  // Establecer fecha mínima (hoy)
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('fecha').setAttribute('min', hoy);
});

// Validación y envío del formulario
document.getElementById('formularioReserva').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Validación de Bootstrap
  if (!this.checkValidity()) {
    e.stopPropagation();
    this.classList.add('was-validated');
    return;
  }

  // Recopilar datos del formulario
  const datos = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    salon: document.getElementById('salon').value,
    tipoEvento: document.getElementById('tipoEvento').value,
    fecha: document.getElementById('fecha').value,
    cantidadInvitados: document.getElementById('cantidadInvitados').value,
    servicios: {
      catering: document.getElementById('catering').checked,
      decoracion: document.getElementById('decoracion').checked,
      fotografia: document.getElementById('fotografia').checked,
      musica: document.getElementById('musica').checked
    },
    mensaje: document.getElementById('mensaje').value
  };

  // Simular envío (en producción aquí iría tu lógica de envío real)
  console.log('Datos del formulario:', datos);

  // Mostrar mensaje de éxito
  const alerta = document.getElementById('alertaExito');
  alerta.style.display = 'block';
  
  // Scroll al inicio para ver el mensaje
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Resetear formulario
  this.reset();
  this.classList.remove('was-validated');

  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    alerta.style.display = 'none';
  }, 5000);
});

// Función para volver al inicio
function volverInicio(event) {
  event.preventDefault();
  window.location.href = 'index.html';
}