using AuthService.Application.Services;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
     public async Task<User?> GetByIdAsync(string id)
    {
        var user = await context.Users
        .Include(u => u.UserRole)
        .Include(u => u.UserEmail)
        .FirstOrDefaultAsync(u => u.Id == id);

        return user;
    }

    public async Task<User> CreateAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.Id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await context.Users
        .Include(u => u.UserRole)
        .ThenInclude(ur => ur.Role)
        .FirstOrDefaultAsync(u => EF.Functions.Like(u.Email, email));
    }

    public async Task<User?> GetByNameAsync(string name)
    {
        return await context.Users
        .Include(u => u.UserEmail)
        .Include(u => u.UserRole)
        .ThenInclude(ur => ur.Role)
        .FirstOrDefaultAsync(u => EF.Functions.Like(u.Username, name));
    }

    public async Task<User?> GetByEmailVerificationTokenAsync(string token)
    {
        return await context.Users
        .Include(u => u.UserEmail)
        .Include(u => u.UserRole)
        .ThenInclude(ur => ur.Role)
        .FirstOrDefaultAsync(u => u.UserEmail != null && u.UserEmail.EmailVerificationToken == token);
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await context.Users.AnyAsync(u => EF.Functions.Like(u.Email, email));
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await context.Users.AnyAsync(u => EF.Functions.Like(u.Username, name));
    }

    public async Task<User> UpdateAsync(User user)
    {
        await context.SaveChangesAsync();
        return await GetByIdAsync(user.Id);
    }
    
    public async Task<bool> DeleteAsync(string id)
    {
        var user = await GetByIdAsync(id);
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task UpdateUserRoleAsync(string userId, string roleId)
    {
        var existingRoles = await context.UserRole.Where(ur => ur.UserId == userId).ToListAsync();
        context.UserRole.RemoveRange(existingRoles);

        var newUserRole = new UserRole
        {
            Id = UuidGenerator.GenerateShortUUID(),
            UserId = userId,
            RoleId = roleId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        context.UserRole.Add(newUserRole);
        await context.SaveChangesAsync();
    }
}