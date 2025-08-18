// Configurar la fecha mínima en input date
document.getElementById('fecha').min = new Date().toISOString().split('T')[0];

const form = document.getElementById('reservaForm');
const mensajeExito = document.getElementById('mensajeExito');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  // Simular envío exitoso (en realidad aquí pondrías el backend)
  mensajeExito.style.display = 'block';
  form.reset();
  form.classList.remove('was-validated');

  setTimeout(() => {
    mensajeExito.style.display = 'none';
  }, 4000);
});
