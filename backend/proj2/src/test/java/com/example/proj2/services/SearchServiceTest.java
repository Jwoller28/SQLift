package test.java.com.example.proj2.services;

import com.example.proj2.Dto.SearchTypeDTO;
import com.example.proj2.entity.Post;
import com.example.proj2.repositories.PostRepository;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Predicate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.config.KafkaStreamsConfiguration;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class SearchServiceTest {

    @Mock
    private PostService postService;

    @Mock
    private KafkaStreamsConfiguration kafkaStreamsConfiguration;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private SearchService searchService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetFilterType_Success() {
        SearchTypeDTO searchTypeDTO = new SearchTypeDTO();
        searchTypeDTO.setType("type");
        searchTypeDTO.setValue("value");

        String result = searchService.getFilterType(searchTypeDTO);

        assertEquals("Filter applied: type=value", result);
    }

    @Test
    public void testPoll_Success() throws InterruptedException {
        Post post = new Post();
        searchService.sendPost(post);

        Post result = searchService.poll();

        assertEquals(post, result);
    }

    @Test
    public void testPoll_NoContent() throws InterruptedException {
        Post result = searchService.poll();

        assertEquals(null, result);
    }

    @Test
    public void testGetFilteredAll_Success() {
        Post post = new Post();
        List<Post> posts = Collections.singletonList(post);
        when(postRepository.findAll()).thenReturn(posts);

        List<Post> result = searchService.getFilteredAll();

        assertEquals(posts, result);
    }

    @Test
    public void testGetFilteredAll_NoContent() {
        when(postRepository.findAll()).thenReturn(Collections.emptyList());

        List<Post> result = searchService.getFilteredAll();

        assertEquals(Collections.emptyList(), result);
    }
}