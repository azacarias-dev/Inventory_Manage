namespace AuthService.Domain.Constants;

public class RoleConstants
{
    public const string ADMIN_ROLE = "Admin";
    public const string USER_ROLE = "User";

    public static readonly string[] AllRoles = { ADMIN_ROLE, USER_ROLE };
}