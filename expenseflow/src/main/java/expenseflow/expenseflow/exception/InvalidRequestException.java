package expenseflow.expenseflow.exception;

/**
 * Thrown when request parameters are valid Java values but do not make business sense.
 */
public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }
}
