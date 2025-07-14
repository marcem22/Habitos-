import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-nuevo-habito');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capturar valores del formulario
    const nombre = document.getElementById('nombreHabito').value.trim();
    const descripcion = document.getElementById('descripcionHabito').value.trim();
    const frecuencia = document.getElementById('frecuencia').value;
    const meta = parseInt(document.getElementById('metaHabito').value);

    if (!nombre || !frecuencia || isNaN(meta) || meta <= 0) {
      alert('Por favor completá todos los campos obligatorios correctamente.');
      return;
    }

    // Crear el objeto completo esperado por el backend
    const nuevoHabito = {
      nombre,
      descripcion,
      frecuencia,
      categoria: "General",
      activo: true,
      meta,
      progreso: 0 // Siempre se inicia en 0
    };

    console.log("Objeto enviado:", JSON.stringify(nuevoHabito));

    // Enviar al backend
    fetch('http://localhost:5000/api/habitos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoHabito)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar el hábito');
        }
        return response.json();
      })
      .then(() => {
        window.location.href = 'listado.html';
      })
      .catch(async error => {
        const mensaje = await error.message;
        console.error('Error completo:', mensaje);
        alert('Hubo un error al guardar el hábito. Intentalo de nuevo.');
      });
  });
});

