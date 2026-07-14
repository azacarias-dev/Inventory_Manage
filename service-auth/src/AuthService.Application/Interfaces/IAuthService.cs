using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;

namespace AuthService.Application.Interfaces;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<EmailResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto);
    Task<UserResponseDto?> GetUserByIdAsync(string userId);
}