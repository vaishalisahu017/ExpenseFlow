package expenseflow.expenseflow.util;

import expenseflow.expenseflow.dto.PageResponse;
import org.springframework.data.domain.Page;

import java.util.function.Function;

/**
 * Converts Spring Data Page objects into API-friendly page responses.
 */
public final class PageMapper {

    private PageMapper() {
    }

    public static <T, R> PageResponse<R> toResponse(Page<T> page, Function<T, R> mapper) {
        return new PageResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
