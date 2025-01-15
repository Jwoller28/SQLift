// package com.example.proj2.controllers;

// import com.example.proj2.Controllers.SearchController;
// import com.example.proj2.Dto.SearchTypeDTO;
// import com.example.proj2.Services.SearchService;
// import com.example.proj2.entity.Post;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.http.ResponseEntity;

// import java.util.Arrays;
// import java.util.List;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.*;

// public class SearchControllerTest {

//     @InjectMocks
//     private SearchController searchController;

//     @Mock
//     private SearchService searchService;

//     @Mock
//     private ObjectMapper objectMapper;

//     @BeforeEach
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testGetFilterType() {
//         SearchTypeDTO searchTypeDTO = new SearchTypeDTO();
//         searchTypeDTO.setType("username");
//         searchTypeDTO.setValue("testuser");

//         doNothing().when(searchService).customFilterStream(any(SearchTypeDTO.class));

//         ResponseEntity<String> response = searchController.getFilterType(searchTypeDTO);

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals("Success", response.getBody());
//         verify(searchService, times(1)).customFilterStream(any(SearchTypeDTO.class));
//     }

//     @Test
//     public void testPoll() {
//         Post post = new Post();
//         post.setMessageText("Test message");

//         when(searchService.getNextFilteredPost()).thenReturn(post);

//         ResponseEntity<Post> response = searchController.poll();

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(post, response.getBody());
//         verify(searchService, times(1)).getNextFilteredPost();
//     }

//     @Test
//     public void testGetFilteredAll() {
//         Post post1 = new Post();
//         post1.setMessageText("Test message 1");

//         Post post2 = new Post();
//         post2.setMessageText("Test message 2");

//         List<Post> posts = Arrays.asList(post1, post2);
//         when(searchService.getFilteredPosts()).thenReturn(posts);

//         ResponseEntity<List<Post>> response = searchController.getFilteredAll();

//         assertEquals(200, response.getStatusCodeValue());
//         assertEquals(posts, response.getBody());
//         verify(searchService, times(1)).getFilteredPosts();
//     }
// }