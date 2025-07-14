import './style.css'

let habitoActual = null; // Declaración global

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    mostrarDatosEjemplo();
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/habitos/${id}`);
    if (!response.ok) throw new Error("Hábito no encontrado");

    const habito = await response.json();
    habitoActual = habito; // guardamos para edición posterior

    // Mostrar datos reales
    document.getElementById("habit-title").textContent = habito.nombre;
    document.getElementById("habit-date").textContent = `Creado el: ${new Date(habito.fechaCreacion).toLocaleDateString()}`;
    document.getElementById("habit-description").textContent = habito.descripcion || "Sin descripción.";
    document.getElementById("habit-frequency").textContent = habito.frecuencia || "No especificada";
    document.getElementById("habit-progress").textContent = `${habito.progreso} / ${habito.meta}`;
    document.getElementById("habit-goal").textContent = habito.meta || "No especificada";

  } catch (error) {
    console.error(error);
    document.querySelector(".card").innerHTML = `
      <div class="alert alert-danger">Error al cargar el hábito. Volvé a intentarlo más tarde.</div>
    `;
  }

  // Evento para avanzar progreso
  document.getElementById("btn-avanzar").addEventListener("click", async () => {
    if (!habitoActual || habitoActual.progreso >= habitoActual.meta) {
      alert("Ya alcanzaste la meta para este hábito.");
      return;
    }

    const nuevoProgreso = habitoActual.progreso + 1;

    try {
      const response = await fetch(`http://localhost:5000/api/habitos/${habitoActual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...habitoActual,
          progreso: nuevoProgreso
        })
      });

      if (!response.ok) throw new Error("Error al actualizar progreso");

      habitoActual.progreso = nuevoProgreso;

      const progressElem = document.getElementById("habit-progress");
      progressElem.textContent = `${nuevoProgreso} / ${habitoActual.meta}`;

      // Animación visual
      progressElem.classList.add("animated-pop");
      setTimeout(() => progressElem.classList.remove("animated-pop"), 300);

      if (nuevoProgreso === habitoActual.meta) {
        alert("¡Felicitaciones! Alcanzaste la meta 🎉");
      }

    } catch (err) {
      console.error(err);
      alert("No se pudo avanzar el progreso.");
    }
  });

  // Evento para eliminar
  document.getElementById("btn-eliminar").addEventListener("click", async () => {
    const confirmacion = confirm("¿Estás seguro de que querés eliminar este hábito? Esta acción no se puede deshacer.");
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:5000/api/habitos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el hábito");

      alert("Hábito eliminado correctamente.");
      window.location.href = "listado.html";

    } catch (error) {
      console.error(error);
      alert("Hubo un error al intentar eliminar el hábito. Intentalo de nuevo.");
    }
  });
    // Evento para cancelar edición
  document.getElementById("btn-cancelar-edicion").addEventListener("click", () => {
    document.getElementById("form-edicion").classList.add("d-none");

    // Mostramos de nuevo los datos principales
    document.getElementById("habit-title").classList.remove("d-none");
    document.getElementById("habit-description").classList.remove("d-none");
    document.getElementById("habit-frequency").parentElement.parentElement.classList.remove("d-none");
    document.getElementById("habit-progress").parentElement.parentElement.classList.remove("d-none");
    document.getElementById("habit-goal").parentElement.parentElement.classList.remove("d-none");

    // Mostramos los botones si los ocultaste al editar
    document.getElementById("btn-editar")?.classList.remove("d-none");
    document.getElementById("btn-eliminar")?.classList.remove("d-none");
  });


  document.getElementById("icono-notificacion").addEventListener("click", solicitarPermisoNotificaciones);
});

// Botón editar
document.getElementById("btn-editar").addEventListener("click", () => {
  const form = document.getElementById("form-edicion");
  form.classList.toggle("d-none");

  if (!form.classList.contains("d-none") && habitoActual) {
    document.getElementById("edit-nombre").value = habitoActual.nombre;
    document.getElementById("edit-descripcion").value = habitoActual.descripcion || "";
    document.getElementById("edit-frecuencia").value = habitoActual.frecuencia || "";
    document.getElementById("edit-meta").value = habitoActual.meta || "";
    document.getElementById("edit-progreso").value = habitoActual.progreso || 0;
  }
});

// Guardar cambios de edición
document.getElementById("form-edicion").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!habitoActual) {
    alert("No se puede actualizar: no se pudo cargar el hábito.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const datosActualizados = {
    nombre: document.getElementById("edit-nombre").value.trim(),
    descripcion: document.getElementById("edit-descripcion").value.trim(),
    frecuencia: document.getElementById("edit-frecuencia").value.trim(),
    meta: Number(document.getElementById("edit-meta").value) || 0,
    progreso: Number(document.getElementById("edit-progreso").value) || 0,
    categoria: habitoActual.categoria || "General",
    activo: habitoActual.activo !== undefined ? habitoActual.activo : true
  };

  try {
    const response = await fetch(`http://localhost:5000/api/habitos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosActualizados),
    });

    const body = await response.text();

    if (!response.ok) {
      console.error("Error recibido:", body);
      throw new Error("Error al actualizar el hábito");
    }

    alert("Hábito actualizado correctamente.");
    window.location.reload();

  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar el hábito. Revisá la consola para más detalles.");
  }
});

function mostrarDatosEjemplo() {
  document.getElementById("habit-title").textContent = "Ejemplo de Hábito";
  document.getElementById("habit-date").textContent = "Creado el: 01/01/2025";
  document.getElementById("habit-description").textContent = "Imaginá tu próximo hábito... así se verá acá.";
  document.getElementById("habit-frequency").textContent = "Semanal";
  document.getElementById("habit-progress").textContent = "0 / 5";
  document.getElementById("habit-goal").textContent = "5";
}

function solicitarPermisoNotificaciones() {
  if (!("Notification" in window)) {
    alert("Este navegador no soporta notificaciones.");
    return;
  }

  Notification.requestPermission().then((permiso) => {
    if (permiso === "granted") {
      new Notification("Recordatorio activado", {
        body: "Te vamos a enviar alertas sobre este hábito.",
        icon: "/assets/habitos_logo.png",
      });

      const icono = document.getElementById("icono-notificacion");
      icono.classList.remove("bi-bell-fill");
      icono.classList.add("bi-bell-check-fill");
      icono.title = "Recordatorio activado";
    } else {
      alert("No se activaron las notificaciones.");
    }
  });
}
