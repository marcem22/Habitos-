using Microsoft.AspNetCore.Mvc;
using Integrador.Data;
using Integrador.Models;

namespace Integrador.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitosController : ControllerBase
    {
        private static RepositorioHabitos _repositorio = new RepositorioHabitos();

        [HttpGet]
        public ActionResult<List<Habito>> Get()
        {
            return Ok(_repositorio.ObtenerTodos());
        }

        [HttpGet("{id}")]
        public ActionResult<Habito> Get(int id)
        {
            var habito = _repositorio.ObtenerPorId(id);
            if (habito == null) return NotFound();
            return Ok(habito);
        }

        [HttpPost]
        public ActionResult<Habito> Post([FromBody] Habito nuevo)
        {
            var creado = _repositorio.Crear(nuevo);
            return CreatedAtAction(nameof(Get), new { id = creado.Id }, creado);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Habito actualizado)
        {
            var resultado = _repositorio.Actualizar(id, actualizado);
            if (!resultado) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var eliminado = _repositorio.Eliminar(id);
            if (!eliminado) return NotFound();
            return NoContent();
        }
    }
}

