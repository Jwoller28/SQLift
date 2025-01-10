package test.java.com.example.proj2.controllers;
import com.example.proj2.Services.CommentService;
import com.example.proj2.Services.PostService;
import com.example.proj2.Services.UserService;
import com.example.proj2.entity.Comment;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.AppUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CommentControllerTest {

    private CommentController commentController;
    private CommentService commentService;
    private PostService postService;
    private UserService userService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        commentService = Mockito.mock(CommentService.class);
        postService = Mockito.mock(PostService.class);
        userService = Mockito.mock(UserService.class);
        objectMapper = Mockito.mock(ObjectMapper.class);
        commentController = new CommentController(commentService, postService, userService, objectMapper);
    }

    @Test
    void sendComment_Success() {
        Comment comment = new Comment();
        when(commentService.persistComment(any(Comment.class))).thenReturn(comment);

        ResponseEntity<String> response = commentController.sendComment(1, 1L, "Test message");

        assertEquals(ResponseEntity.ok().body("Comment Persisted"), response);
        verify(commentService, times(1)).persistComment(any(Comment.class));
    }

    @Test
    void sendComment_BadRequest() {
        ResponseEntity<String> response = commentController.sendComment(1, 1L, null);

        assertEquals(ResponseEntity.badRequest().build(), response);
        verify(commentService, never()).persistComment(any(Comment.class));
    }

    @Test
    void getSubComments_Success() {
        List<Comment> comments = new ArrayList<>();
        when(commentService.getSubComments(any(Comment.class))).thenReturn(comments);

        ResponseEntity<List<Comment>> response = commentController.getSubComments(new Comment());

        assertEquals(ResponseEntity.ok().body(comments), response);
        verify(commentService, times(1)).getSubComments(any(Comment.class));
    }

    @Test
    void getSubComments_BadRequest() {
        when(commentService.getSubComments(any(Comment.class))).thenReturn(null);

        ResponseEntity<List<Comment>> response = commentController.getSubComments(new Comment());

        assertEquals(ResponseEntity.badRequest().build(), response);
        verify(commentService, times(1)).getSubComments(any(Comment.class));
    }

    @Test
    void getUserComments_Success() {
        AppUser user = new AppUser();
        List<Comment> comments = new ArrayList<>();
        when(userService.getUserByUsername(anyString())).thenReturn(user);
        when(commentService.getUserComments(any(AppUser.class))).thenReturn(comments);

        ResponseEntity<List<Comment>> response = commentController.getUserComments("testUser");

        assertEquals(ResponseEntity.ok().body(comments), response);
        verify(userService, times(1)).getUserByUsername(anyString());
        verify(commentService, times(1)).getUserComments(any(AppUser.class));
    }

    @Test
    void getUserComments_Exception() {
        when(userService.getUserByUsername(anyString())).thenThrow(new RuntimeException());

        ResponseEntity<List<Comment>> response = commentController.getUserComments("testUser");

        assertEquals(ResponseEntity.badRequest().build(), response);
        verify(userService, times(1)).getUserByUsername(anyString());
        verify(commentService, never()).getUserComments(any(AppUser.class));
    }

    @Test
    void getPostComments_Success() {
        Post post = new Post();
        List<Comment> comments = new ArrayList<>();
        when(postService.getAPost(anyLong())).thenReturn(post);
        when(commentService.getPostComments(any(Post.class))).thenReturn(comments);

        ResponseEntity<List<Comment>> response = commentController.getPostComments(1L);

        assertEquals(ResponseEntity.ok().body(comments), response);
        verify(postService, times(1)).getAPost(anyLong());
        verify(commentService, times(1)).getPostComments(any(Post.class));
    }

    @Test
    void getPostComments_BadRequest() {
        when(postService.getAPost(anyLong())).thenReturn(null);

        ResponseEntity<List<Comment>> response = commentController.getPostComments(1L);

        assertEquals(ResponseEntity.badRequest().build(), response);
        verify(postService, times(1)).getAPost(anyLong());
        verify(commentService, never()).getPostComments(any(Post.class));
    }
}