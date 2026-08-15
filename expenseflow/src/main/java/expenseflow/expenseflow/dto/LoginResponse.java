package expenseflow.expenseflow.dto;

/**
 * Response returned after a successful login.
 */
public class LoginResponse {

    private final String token;
    private final Long userId;
    private final String fullName;
    private final String email;
    private final String role;

    public LoginResponse(String token, Long userId, String fullName, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
