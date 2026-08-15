package expenseflow.expenseflow.service;

import expenseflow.expenseflow.dto.UserRequest;
import expenseflow.expenseflow.dto.UserResponse;
import expenseflow.expenseflow.dto.PageResponse;
import expenseflow.expenseflow.entity.User;
import expenseflow.expenseflow.exception.DuplicateResourceException;
import expenseflow.expenseflow.exception.ResourceNotFoundException;
import expenseflow.expenseflow.repository.UserRepository;
import expenseflow.expenseflow.util.PageMapper;
import expenseflow.expenseflow.util.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles user registration-style CRUD operations and hides password fields from responses.
 */
@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(UserRequest request) {
        logger.info("Creating user with email {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = UserMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return UserMapper.toResponse(savedUser);
    }

    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        logger.info("Fetching users page {} with size {}", pageable.getPageNumber(), pageable.getPageSize());
        return PageMapper.toResponse(userRepository.findAll(pageable), UserMapper::toResponse);
    }

    public UserResponse getUserById(Long id) {
        logger.info("Fetching user with id {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return UserMapper.toResponse(user);
    }

    public void deleteUser(Long id) {
        logger.info("Deleting user with id {}", id);

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        userRepository.deleteById(id);
    }
}
