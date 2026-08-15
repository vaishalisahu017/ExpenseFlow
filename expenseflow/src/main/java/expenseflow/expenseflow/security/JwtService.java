package expenseflow.expenseflow.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import expenseflow.expenseflow.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final String secret;
    private final long expirationSeconds;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-seconds}") long expirationSeconds
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be configured before starting ExpenseFlow");
        }

        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(User user) {
        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.getEmail());
        payload.put("userId", user.getId());
        payload.put("role", user.getRole());
        payload.put("iat", Instant.now().getEpochSecond());
        payload.put("exp", Instant.now().plusSeconds(expirationSeconds).getEpochSecond());

        String encodedHeader = encodeJson(header);
        String encodedPayload = encodeJson(payload);
        String signature = sign(encodedHeader + "." + encodedPayload);

        return encodedHeader + "." + encodedPayload + "." + signature;
    }

    public String extractEmail(String token) {
        return readPayload(token).get("sub").toString();
    }

    public boolean isTokenValid(String token, String email) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return false;
            }

            String expectedSignature = sign(parts[0] + "." + parts[1]);
            if (!expectedSignature.equals(parts[2])) {
                return false;
            }

            Map<String, Object> payload = readPayload(token);
            long expiresAt = Long.parseLong(payload.get("exp").toString());

            return email.equals(payload.get("sub")) && Instant.now().getEpochSecond() < expiresAt;
        } catch (RuntimeException exception) {
            return false;
        }
    }

    private Map<String, Object> readPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            byte[] decodedPayload = Base64.getUrlDecoder().decode(parts[1]);
            return OBJECT_MAPPER.readValue(decodedPayload, new TypeReference<>() {
            });
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid JWT token", exception);
        }
    }

    private String encodeJson(Map<String, Object> values) {
        try {
            byte[] jsonBytes = OBJECT_MAPPER.writeValueAsBytes(values);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(jsonBytes);
        } catch (Exception exception) {
            throw new IllegalStateException("Could not create JWT token", exception);
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(key);
            byte[] signature = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception exception) {
            throw new IllegalStateException("Could not sign JWT token", exception);
        }
    }
}
