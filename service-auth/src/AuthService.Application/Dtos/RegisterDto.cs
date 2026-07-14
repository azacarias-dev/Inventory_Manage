using System.ComponentModel.DataAnnotations;
using AuthService.Application.Interfaces;

namespace AuthService.Application.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "El nombre de usuario es requerido")]
    [MaxLength(100, ErrorMessage = "El nombre de usuario no puede exceder los 100 caracteres")]
    public string UserName { get; set; } = string.Empty;
    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress (ErrorMessage = "El email no es válido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
    public string Password { get; set; } = string.Empty;
}