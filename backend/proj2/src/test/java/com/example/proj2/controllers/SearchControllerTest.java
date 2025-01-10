package test.java.com.example.proj2.controllers;

import com.example.proj2.Dto.SearchTypeDTO;
import com.example.proj2.entity.Post;
import com.example.proj2.Services.SearchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SearchControllerTest {

    private SearchController searchController;
    private SearchService searchService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        searchService = Mockito.mock(SearchService.class);
        objectMapper = Mockito.mock(ObjectMapper.class);
        searchController = new SearchController(searchService, objectMapper);
    }

    @Test
    void getFilterType_Success() {
        SearchTypeDTO searchTypeDTO = new SearchTypeDTO();
        searchTypeDTO.setType("type");
        searchTypeDTO.setValue("value");

        doNothing().when(searchService).customFilterStream(any(SearchTypeDTO.class));

        ResponseEntity<String> response = searchController.getFilterType(searchTypeDTO);

        assertEquals(ResponseEntity.ok().body("Success"), response);
        verify(searchService, times(1)).customFilterStream(any(SearchTypeDTO.class));
    }

    @Test
    void getFilterType_NoContent() {
        ResponseEntity<String> response = searchController.getFilterType(null);

        assertEquals(ResponseEntity.noContent().build(), response);
        verify(searchService, never()).customFilterStream(any(SearchTypeDTO.class));
    }

    @Test
    void poll_Success() {
        Post post = new Post();
        when(searchService.getNextFilteredPost()).thenReturn(post);

        ResponseEntity<Post> response = searchController.poll();

        assertEquals(ResponseEntity.ok().body(post), response);
        verify(searchService, times(1)).getNextFilteredPost();
    }

    @Test
    void poll_NoContent() {
        when(searchService.getNextFilteredPost()).thenReturn(null);

        ResponseEntity<Post> response = searchController.poll();

        assertEquals(ResponseEntity.noContent().build(), response);
        verify(searchService, times(1)).getNextFilteredPost();
    }

    @Test
    void getFilteredAll_Success() {
        List<Post> posts = Arrays.asList(new Post(), new Post());
        when(searchService.getFilteredPosts()).thenReturn(posts);

        ResponseEntity<List<Post>> response = searchController.getFilteredAll();

        assertEquals(ResponseEntity.ok().body(posts), response);
        verify(searchService, times(1)).getFilteredPosts();
    }

    @Test
    void getFilteredAll_NoContent() {
        when(searchService.getFilteredPosts()).thenReturn(null);

        ResponseEntity<List<Post>> response = searchController.getFilteredAll();

        assertEquals(ResponseEntity.noContent().build(), response);
        verify(searchService, times(1)).getFilteredPosts();
    }
}