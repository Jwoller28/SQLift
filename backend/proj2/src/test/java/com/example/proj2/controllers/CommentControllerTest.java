package com.example.proj2.controllers;

import com.example.proj2.Controllers.CommentController;
import com.example.proj2.Services.CommentService;
import com.example.proj2.Services.PostService;
import com.example.proj2.Services.UserService;
import com.example.proj2.entity.Comment;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.AppUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class CommentControllerTest {

    @InjectMocks
    private CommentController commentController;

    @Mock
    private CommentService commentService;

    @Mock
    private PostService postService;

    @Mock
    private UserService userService;

    @Mock
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendComment() {
        Comment comment = new Comment();
        comment.setText("Test comment");

        doNothing().when(commentService).persistComment(any(Comment.class));

        ResponseEntity<String> response = commentController.sendComment(1, 1L, "Test comment");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Comment Persisted", response.getBody());
        verify(commentService, times(1)).persistComment(any(Comment.class));
    }

    @Test
    public void testGetSubComments() {
        Comment comment = new Comment();
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        when(commentService.getSubComments(comment)).thenReturn(comments);

        ResponseEntity<List<Comment>> response = commentController.getSubComments(comment);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(commentService, times(1)).getSubComments(comment);
    }

    @Test
    public void testGetUserComments() throws Exception {
        AppUser user = new AppUser();
        user.setUsername("testuser");
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        when(userService.getUserByUsername("testuser")).thenReturn(user);
        when(commentService.getUserComments(user)).thenReturn(comments);

        ResponseEntity<List<Comment>> response = commentController.getUserComments("testuser");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(userService, times(1)).getUserByUsername("testuser");
        verify(commentService, times(1)).getUserComments(user);
    }

    @Test
    public void testGetPostComments() {
        Post post = new Post();
        List<Comment> comments = Arrays.asList(new Comment(), new Comment());
        when(postService.getAPost(1L)).thenReturn(post);
        when(commentService.getPostComments(post)).thenReturn(comments);

        ResponseEntity<List<Comment>> response = commentController.getPostComments(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(postService, times(1)).getAPost(1L);
        verify(commentService, times(1)).getPostComments(post);
    }
}