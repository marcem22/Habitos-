using Integrador.Models;

namespace Integrador.Data
{
    public class RepositorioHabitos
    {
        private static List<Habito> _habitos = new List<Habito>
        {
            new Habito
            {
                Id = 1,
                Nombre = "Beber 2 litros de agua",
                Categoria = "Salud",
                Frecuencia = "Diaria",
                Activo = true,
                Descripcion = "Ayuda a mantenerte hidratado y saludable.",
                FechaCreacion = DateTime.Now.AddDays(-5),
                Meta = 30,
                Progreso = 40
            },
            new Habito
            {
                Id = 2,
                Nombre = "Caminar 30 minutos",
                Categoria = "Ejercicio",
                Frecuencia = "Semanal",
                Activo = true,
                Descripcion = "Mejora la circulación y despeja tu mente.",
                FechaCreacion = DateTime.Now.AddDays(-10),
                Meta = 20,
                Progreso = 70
            },
            new Habito
            {
                Id = 3,
                Nombre = "Leer 10 páginas",
                Categoria = "Bienestar",
                Frecuencia = "Semanal",
                Activo = true,
                Descripcion = "Fomenta el aprendizaje y reduce el estrés.",
                FechaCreacion = DateTime.Now.AddDays(-2),
                Meta = 15,
                Progreso = 25
            }
        };

        public List<Habito> ObtenerTodos() => _habitos;

        public Habito? ObtenerPorId(int id) => _habitos.FirstOrDefault(h => h.Id == id);

        public Habito Crear(Habito nuevo)
        {
            nuevo.Id = _habitos.Any() ? _habitos.Max(h => h.Id) + 1 : 1;
            nuevo.FechaCreacion = DateTime.Now;
            _habitos.Add(nuevo);
            return nuevo;
        }

        public bool Actualizar(int id, Habito actualizado)
        {
            var existente = ObtenerPorId(id);
            if (existente == null) return false;

            existente.Nombre = actualizado.Nombre;
            existente.Categoria = actualizado.Categoria;
            existente.Frecuencia = actualizado.Frecuencia;
            existente.Activo = actualizado.Activo;
            existente.Descripcion = actualizado.Descripcion;
            existente.Meta = actualizado.Meta;
            existente.Progreso = actualizado.Progreso;
           
            return true;
        }
            
            

        public bool Eliminar(int id)
        {
            Console.WriteLine("Intentando eliminar el hábito con ID: " + id);
            Console.WriteLine("IDs actuales: " + string.Join(", ", _habitos.Select(h => h.Id)));

            var existente = ObtenerPorId(id);
            if (existente == null) return false;
            _habitos.Remove(existente);
            return true;
        }

    }
}
