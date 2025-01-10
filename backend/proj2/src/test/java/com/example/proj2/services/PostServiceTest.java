package test.java.com.example.proj2.services;

import com.example.proj2.entity.Post;
import com.example.proj2.repositories.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class PostServiceTest {

    @Mock
    private KafkaTemplate<Long, Post> kafkaPostTemplate;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendPost_Success() {
        Post post = new Post();
        CompletableFuture<SendResult<Long, Post>> future = CompletableFuture.completedFuture(null);
        when(kafkaPostTemplate.send("unprocessedPosts", post)).thenReturn(future);

        postService.sendPost(post);

        // No exception means success
    }

    @Test
    public void testPoll_Success() throws InterruptedException {
        Post post = new Post();
        postService.sendPost(post);

        Post result = postService.poll();

        assertEquals(post, result);
    }

    @Test
    public void testPoll_NoContent() throws InterruptedException {
        Post result = postService.poll();

        assertEquals(null, result);
    }

    @Test
    public void testGetAll_Success() {
        Post post = new Post();
        List<Post> posts = Collections.singletonList(post);
        when(postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(posts);

        List<Post> result = postService.getAll();

        assertEquals(posts, result);
    }

    @Test
    public void testGetAll_NoContent() {
        when(postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))).thenReturn(Collections.emptyList());

        List<Post> result = postService.getAll();

        assertEquals(Collections.emptyList(), result);
    }
}