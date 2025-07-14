namespace Integrador.Models;

public class Habito
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Frecuencia { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;

    // Campos nuevos
    public string? Descripcion { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public int? Meta { get; set; }          // Por ejemplo, cantidad total de veces a cumplir
    public int? Progreso { get; set; }      // Porcentaje del hábito alcanzado
}
