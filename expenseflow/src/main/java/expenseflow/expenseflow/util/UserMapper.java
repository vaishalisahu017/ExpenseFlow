package expenseflow.expenseflow.util;

import expenseflow.expenseflow.dto.UserRequest;
import expenseflow.expenseflow.dto.UserResponse;
import expenseflow.expenseflow.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(UserRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        return user;
    }

    public static UserResponse toResponse(User user) {
        // Do not expose the password in API responses.
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
