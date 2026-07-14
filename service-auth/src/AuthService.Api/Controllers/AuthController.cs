using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

/// <summary>
/// Controlador de autenticacion y gestion de usuarios para el sistema bancario Ban-K.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>
    /// Obtiene el perfil del usuario autenticado actualmente.
    /// </summary>
    /// <response code="200">Retorna los datos del perfil del usuario.</response>
    /// <response code="401">Si el token no es valido o ha expirado.</response>
    /// <response code="404">Si el usuario no existe en el sistema.</response>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> GetProfile()
    {
        var userId = User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { success = false, message = "Token invalido" });

        var user = await authService.GetUserByIdAsync(userId);

        if (user == null)
            return NotFound(new { success = false, message = "Usuario no encontrado" });

        return Ok(new
        {
            success = true,
            message = "Perfil obtenido exitosamente",
            data = user
        });
    }

    /// <summary>
    /// Obtiene el perfil de un usuario especifico por su ID.
    /// </summary>
    /// <remarks>
    /// Solo accesible por el propio usuario o por un administrador.
    /// </remarks>
    /// <param name="id">ID unico del usuario a consultar.</param>
    /// <response code="200">Retorna los datos del perfil solicitado.</response>
    /// <response code="403">Si el usuario intenta acceder a un perfil ajeno sin ser Admin.</response>
    /// <response code="404">Si el usuario no fue encontrado.</response>
    [HttpGet("profile/{id}")]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> GetProfileById(string id)
    {
        var currentUserId = User.FindFirst("sub")?.Value;
        var role = User.FindFirst("role")?.Value;

        if (string.IsNullOrEmpty(currentUserId))
            return Unauthorized();

        if (currentUserId != id && role != "Admin")
        {
            return Forbid();
        }

        var user = await authService.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Usuario no encontrado"
            });
        }

        return Ok(new
        {
            success = true,
            message = "Perfil obtenido exitosamente",
            data = user
        });
    }

    /// <summary>
    /// Registra un nuevo usuario en la plataforma Ban-K.
    /// </summary>
    /// <remarks>
    /// Campos requeridos:
    /// - **Name**: Nombre completo (max 25)
    /// - **Email**: Correo electronico institucional
    /// - **Password**: Minimo 8 caracteres
    /// - **Dpi**: 13-20 digitos
    /// - **MonthlyIncome**: Ingresos mensuales (decimal)
    /// </remarks>
    /// <param name="registerDto">Informacion necesaria para el registro.</param>
    /// <response code="201">Usuario creado correctamente.</response>
    [HttpPost("register")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<RegisterResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        var result = await authService.RegisterAsync(registerDto);
        return StatusCode(201, result);
    }

    /// <summary>
    /// Inicia sesion y genera un token de acceso bancario.
    /// </summary>
    /// <remarks>
    /// Requiere Email/Username y Password validos.
    /// </remarks>
    /// <param name="loginDto">Credenciales de acceso.</param>
    /// <response code="200">Autenticacion exitosa.</response>
    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        var result = await authService.LoginAsync(loginDto);
        return Ok(result);
    }

    /// <summary>
    /// Verifica la direccion de correo electronico mediante un token.
    /// </summary>
    /// <remarks>
    /// El token es el codigo de 6-8 caracteres enviado por correo.
    /// </remarks>
    [HttpPost("verify-email")]
    [EnableRateLimiting("ApiPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var result = await authService.VerifyEmailAsync(verifyEmailDto);
        return Ok(result);
    }
}