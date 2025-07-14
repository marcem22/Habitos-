import './style.css';

const habitList = document.getElementById('habit-list');

// Obtener hábitos del backend
fetch('http://localhost:5000/api/habitos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los hábitos');
    }
    return response.json();
  })
  .then(data => {
    renderHabits(data);
  })
  .catch(error => {
    console.error('Error:', error);
    habitList.innerHTML = '<p class="text-danger">No se pudieron cargar los hábitos.</p>';
  });

// Renderizar hábitos
function renderHabits(habits) {
  habitList.innerHTML = '';
  habits.forEach(h => {
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `
      <div class="habit-card h-100">
        <h5>${h.nombre}</h5>
        <p>${h.descripcion}</p>
        <a href="detalle.html?id=${h.id}" class="btn btn-outline-danger mt-2">Ver más</a>
      </div>
    `;
    habitList.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', fetchHabits);
