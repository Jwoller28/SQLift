// package com.example.proj2.services;

// import com.example.proj2.entity.Comment;
// import com.example.proj2.entity.Post;
// import com.example.proj2.entity.AppUser;
// import com.example.proj2.Services.CommentService;
// import com.example.proj2.repositories.CommentRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;

// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.*;

// public class CommentServiceTest {

//     @InjectMocks
//     private CommentService commentService;

//     @Mock
//     private CommentRepository commentRepository;

//     @BeforeEach
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testPersistComment() {
//         Comment comment = new Comment();
//         comment.setText("Test comment");

//         when(commentRepository.saveAndFlush(any(Comment.class))).thenReturn(comment);

//         commentService.persistComment(comment);

//         verify(commentRepository, times(1)).saveAndFlush(any(Comment.class));
//     }

//     @Test
//     public void testGetUserComments() {
//         AppUser user = new AppUser();
//         user.setId(1);

//         Comment comment1 = new Comment();
//         comment1.setId(1);

//         Comment comment2 = new Comment();
//         comment2.setId(2);

//         List<Comment> comments = Arrays.asList(comment1, comment2);
//         when(commentRepository.findAllByUser(user)).thenReturn(Optional.of(comments));

//         List<Comment> result = commentService.getUserComments(user);

//         assertEquals(2, result.size());
//         verify(commentRepository, times(1)).findAllByUser(user);
//     }

//     @Test
//     public void testGetSubComments() {
//         Comment parentComment = new Comment();
//         parentComment.setId(1);

//         Comment subComment1 = new Comment();
//         subComment1.setId(2);

//         Comment subComment2 = new Comment();
//         subComment2.setId(3);

//         List<Comment> subComments = Arrays.asList(subComment1, subComment2);
//         when(commentRepository.findAllBySuperComment(parentComment)).thenReturn(Optional.of(subComments));

//         List<Comment> result = commentService.getSubComments(parentComment);

//         assertEquals(2, result.size());
//         verify(commentRepository, times(1)).findAllBySuperComment(parentComment);
//     }

//     @Test
//     public void testGetPostComments() {
//         Post post = new Post();
//         post.setId(1);

//         Comment comment1 = new Comment();
//         comment1.setId(1);

//         Comment comment2 = new Comment();
//         comment2.setId(2);

//         List<Comment> comments = Arrays.asList(comment1, comment2);
//         when(commentRepository.findAllByPost(post)).thenReturn(Optional.of(comments));

//         List<Comment> result = commentService.getPostComments(post);

//         assertEquals(2, result.size());
//         verify(commentRepository, times(1)).findAllByPost(post);
//     }
// }