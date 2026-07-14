using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities;

public class Role
{
    [Key]
    [MaxLength(16)]
    public string Id { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nombre del Rol es requerido por el sistema")]
    [MaxLength(100, ErrorMessage = "El nombre del rol no puede exceder los 100 caracteres")]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserRole> UserRole { get; set; }
}