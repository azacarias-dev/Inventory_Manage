namespace AuthService.Application.Interfaces;

public interface IEmailService
{   
    Task SendWelcomeEmailAsync(string email, string username);
}