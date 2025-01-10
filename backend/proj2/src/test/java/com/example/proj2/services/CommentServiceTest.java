package test.java.com.example.proj2.services;

import com.example.proj2.entity.AppUser;
import com.example.proj2.entity.Comment;
import com.example.proj2.repositories.CommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testPersistComment_Success() {
        Comment comment = new Comment();
        when(commentRepository.saveAndFlush(comment)).thenReturn(comment);

        Comment result = commentService.persistComment(comment);

        assertEquals(comment, result);
    }

    @Test
    public void testGetUserComments_Success() {
        AppUser user = new AppUser();
        Comment comment = new Comment();
        List<Comment> comments = Collections.singletonList(comment);
        when(commentRepository.findAllByUser(user)).thenReturn(Optional.of(comments));

        List<Comment> result = commentService.getUserComments(user);

        assertEquals(comments, result);
    }

    @Test
    public void testGetUserComments_NoComments() {
        AppUser user = new AppUser();
        when(commentRepository.findAllByUser(user)).thenReturn(Optional.empty());

        List<Comment> result = commentService.getUserComments(user);

        assertEquals(null, result);
    }

    @Test
    public void testGetSubComments_Success() {
        Comment superComment = new Comment();
        Comment comment = new Comment();
        List<Comment> comments = Collections.singletonList(comment);
        when(commentRepository.findAllBySuperComment(superComment)).thenReturn(Optional.of(comments));

        List<Comment> result = commentService.getSubComments(superComment);

        assertEquals(comments, result);
    }

    @Test
    public void testGetSubComments_NoComments() {
        Comment superComment = new Comment();
        when(commentRepository.findAllBySuperComment(superComment)).thenReturn(Optional.empty());

        List<Comment> result = commentService.getSubComments(superComment);

        assertEquals(null, result);
    }
}