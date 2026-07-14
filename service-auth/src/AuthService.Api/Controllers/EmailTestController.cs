using Microsoft.AspNetCore.Mvc;
using AuthService.Application.Interfaces;

namespace AuthService.Api.Controllers;

/// <summary>
/// Controlador de pruebas para verificar la conectividad del servicio de correo.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EmailTestController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailTestController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    /// <summary>
    /// Envia un correo de bienvenida de prueba.
    /// </summary>
    /// <remarks>
    /// Utilice este endpoint para confirmar que las credenciales SMTP en appsettings son correctas.
    /// </remarks>
    /// <param name="email">Direccion de correo electronico del destinatario.</param>
    /// <param name="name">Nombre que aparecera en el cuerpo del mensaje.</param>
    /// <response code="200">El correo ha sido enviado exitosamente.</response>
    /// <response code="500">Error interno al intentar conectar con el servidor de correo.</response>
    [HttpPost("send-welcome")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> TestWelcome([FromQuery] string email, [FromQuery] string name)
    {
        await _emailService.SendWelcomeEmailAsync(email, name);
        return Ok(new { success = true, message = $"¡Exito! Correo enviado a {email}" });
    }
}