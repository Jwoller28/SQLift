package test.java.com.example.proj2.controllers;
import com.example.proj2.entity.Goal;
import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Post;
import com.example.proj2.Services.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;


class PostControllerTest {

    private PostController postController;
    private PostService postService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        postService = Mockito.mock(PostService.class);
        objectMapper = Mockito.mock(ObjectMapper.class);
        postController = new PostController(postService, objectMapper, null);
    }

    @Test
    void sendPost_Success() {
        doNothing().when(postService).sendPost(any(Post.class));

        ResponseEntity<String> response = postController.sendPost(1L, 1, "Test message", "tag1,tag2", "testUser");

        assertEquals(ResponseEntity.ok().body("File uploaded successfully"), response);
        verify(postService, times(1)).sendPost(any(Post.class));
    }

    @Test
    void sendPost_Exception() {
        doThrow(new RuntimeException("Error")).when(postService).sendPost(any(Post.class));

        ResponseEntity<String> response = postController.sendPost(1L, 1, "Test message", "tag1,tag2", "testUser");

        assertEquals(ResponseEntity.badRequest().body("Error"), response);
        verify(postService, times(1)).sendPost(any(Post.class));
    }

    @Test
    void poll_Success() {
        Post post = new Post();
        when(postService.getNextPost()).thenReturn(post);

        ResponseEntity<Post> response = postController.poll();

        assertEquals(ResponseEntity.ok().body(post), response);
        verify(postService, times(1)).getNextPost();
    }

    @Test
    void poll_NoContent() {
        when(postService.getNextPost()).thenReturn(null);

        ResponseEntity<Post> response = postController.poll();

        assertEquals(ResponseEntity.noContent().build(), response);
        verify(postService, times(1)).getNextPost();
    }

    @Test
    void getAll_Success() {
        List<Post> posts = Arrays.asList(new Post(), new Post());
        when(postService.getAllPosts()).thenReturn(posts);

        ResponseEntity<List<Post>> response = postController.getAll();

        assertEquals(ResponseEntity.ok().body(posts), response);
        verify(postService, times(1)).getAllPosts();
    }

    @Test
    void getAll_NoContent() {
        when(postService.getAllPosts()).thenReturn(null);

        ResponseEntity<List<Post>> response = postController.getAll();

        assertEquals(ResponseEntity.noContent().build(), response);
        verify(postService, times(1)).getAllPosts();
    }
}
