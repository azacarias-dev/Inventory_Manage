using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Application.Exceptions;
using AuthService.Application.Extensions;
using AuthService.Application.Validators;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using AuthService.Application.DTOs.Email;

namespace AuthService.Application.Services;

public class AuthService(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IPasswordHashService passwordHashService,
    IJwtTokenService jwtTokenService,
    IEmailService emailService,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{

    public async Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Verificar si el email ya existe
        if (await userRepository.ExistsByEmailAsync(registerDto.Email))
        {
            logger.LogRegistrationWithExistingEmail();
            throw new BusinessException(ErrorCodes.EMAIL_ALREADY_EXISTS, "Email already exists");
        }


        // Crear nuevo usuario y entidades relacionadas
        var emailVerificationToken = TokenGenerator.GenerateEmailVerificationToken();

        var userId = UuidGenerator.GenerateUserId();
        var userEmailId = UuidGenerator.GenerateUserId();
        var userRoleId = UuidGenerator.GenerateUserId();

        // Obtener el rol por defecto (USER_ROLE) ya seedado en DB
        var defaultRole = await roleRepository.GetByNameAsync(RoleConstants.USER_ROLE);
        if (defaultRole == null)
        {
            throw new InvalidOperationException($"Default role '{RoleConstants.USER_ROLE}' not found. Ensure seeding runs before registration.");
        }

        var user = new User
        {
            Id = userId,
            Username = registerDto.UserName,
            Email = registerDto.Email.ToLowerInvariant(),
            Password = passwordHashService.HashPassword(registerDto.Password),
            IsActive = false,
            UserEmail = new UserEmail
            {
                Id = userEmailId,
                UserId = userId,
                EmailVerified = false,
                EmailVerificationToken = emailVerificationToken,
                EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
            },
            UserRole =
            [
                new Domain.Entities.UserRole
                {
                    Id = userRoleId,
                    UserId = userId,
                    RoleId = defaultRole.Id
                }
            ]
        };

        // Guardar usuario y entidades relacionadas
        var createdUser = await userRepository.CreateAsync(user);

        logger.LogUserRegistered(createdUser.Username);

        // Enviar email de verificación en background
        _ = Task.Run(async () =>
        {
            try
            {
                await emailService.SendEmailVerificationAsync(createdUser.Email, createdUser.Username, emailVerificationToken);
                logger.LogInformation("Verification email sent");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send verification email");
            }
        });

        // Crear respuesta sin JWT - solo confirmación de registro
        return new RegisterResponseDto
        {
            Success = true,
            User = MapToUserResponseDto(createdUser),
            Message = "Usuario registrado exitosamente. Por favor, verifica tu email para activar la cuenta.",
            EmailVerificationRequired = true
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        // Buscar usuario por email o username
        User? user = null;

        if (loginDto.EmailOrUsername.Contains('@'))
        {
            // Es un email
            user = await userRepository.GetByEmailAsync(loginDto.EmailOrUsername.ToLowerInvariant());
        }
        else
        {
            // Es un username
            user = await userRepository.GetByNameAsync(loginDto.EmailOrUsername);
        }

        // Verificar si el usuario existe
        if (user == null)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        // Verificar si el usuario está activo
        if (!user.IsActive)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("User account is disabled");
        }

        // Verificar contraseña
        if (!passwordHashService.VerifyPassword(loginDto.Password, user.Password))
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        logger.LogUserLoggedIn();

        // Generar token JWT
        var token = jwtTokenService.GenerateToken(user);
        var expiryMinutes = int.Parse(configuration["JwtSettings:ExpiryInMinutes"] ?? "30");

        // Crear respuesta compacta
        return new AuthResponseDto
        {
            Success = true,
            Message = "Login exitoso",
            Token = token,
            UserDetails = MapToUserDetailsDto(user),
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    private UserResponseDto MapToUserResponseDto(User user)
    {
        var userRole = user.UserRole.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE;
        return new UserResponseDto
        {
            Id = user.Id,
            UserName = user.Username,
            Email = user.Email,
            Role = userRole,
            IsActive = user.IsActive,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private UserDetailsDto MapToUserDetailsDto(User user)
    {
        return new UserDetailsDto
        {
            Id = user.Id,
            Name = user.Username,
            Role = user.UserRole.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE
        };
    }

    public async Task<EmailResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto)
    {
        var user = await userRepository.GetByEmailVerificationTokenAsync(verifyEmailDto.Token);
        if (user == null || user.UserEmail == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Invalid or expired verification token"
            };
        }

        user.UserEmail.EmailVerified = true;
        user.IsActive = true;
        user.UserEmail.EmailVerificationToken = null;
        user.UserEmail.EmailVerificationTokenExpiry = null;

        await userRepository.UpdateAsync(user);

        // Enviar email de bienvenida
        try
        {
            await emailService.SendWelcomeEmailAsync(user.Email, user.Username);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send welcome email to {Email}", user.Email);
        }

        logger.LogInformation("Email verified successfully for user {Username}", user.Username);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Email verificado exitosamente",
            Data = new
            {
                email = user.Email,
                verified = true
            }
        };
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        return MapToUserResponseDto(user);
    }
}