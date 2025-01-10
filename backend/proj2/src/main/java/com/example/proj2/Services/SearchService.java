package com.example.proj2.Services;

import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.kstream.Produced;
import org.apache.kafka.streams.kstream.Predicate;
import org.apache.kafka.common.serialization.Serdes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import com.example.proj2.Serializer.PostSerde;
import com.example.proj2.Services.PostService;
import com.example.proj2.entity.Post;
import com.example.proj2.repositories.PostRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.annotation.KafkaStreamsDefaultConfiguration;
import org.springframework.kafka.config.KafkaStreamsConfiguration;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.proj2.Dto.SearchTypeDTO;

@Service
public class SearchService {

    @Autowired
    private PostService postService;

    @Autowired
    private KafkaStreamsConfiguration kafkaStreamsConfiguration;

    @Autowired
    private PostRepository postRepository;

    public static final Logger log = LoggerFactory.getLogger(SearchService.class);

    private final BlockingQueue<Post> postQueue = new LinkedBlockingQueue<>(100); // Thread-safe queue

    private KafkaStreams kafkaStreams;

    @Autowired
    private SearchTypeDTO sTypeDTO;

    // Listens for new filtered posts from Kafka topic "filteredPosts"
    @KafkaListener(topics = "filteredPosts", containerFactory = "FilteredKafkaListenerContainerFactory", groupId = "filtered-app-users")
    public void listenFilter(Post post) {
        if (post != null) {
            log.info("Received post: {}", post);
            postQueue.offer(post); // Add posts to the queue
            log.info("Queue size: {}", postQueue.size());
        }
    }

    // Polls the next filtered post from the queue
    public Post getNextFilteredPost() {
        return postQueue.poll();
    }

    public List<Post> getFilteredPosts() {
        String searchValue = sTypeDTO.getValue();

        switch (sTypeDTO.getType().toLowerCase()) {
            case "username":
                if (searchValue != null) {
                    return postRepository.findPostsByUsernameContains(searchValue);
                }
                break;
            case "text":
                if (searchValue != null) {
                    return postRepository.findPostsByTextContains(searchValue);
                }
                break;
            case "tags":
                if (searchValue != null) {
                    return postRepository.findPostsByTagsContains(searchValue);
                }
                break;
            default:
                log.error("Invalid search type: {}", sTypeDTO.getType());
                break;
        }

        return null; // Invalid search type or missing value, return null
    }

    // Create a custom filter stream
    public void customFilterStream(SearchTypeDTO searchTypeDTO) {
        sTypeDTO.setType(searchTypeDTO.getType());
        sTypeDTO.setValue(searchTypeDTO.getValue());

        StreamsConfig streamsConfig = new StreamsConfig(kafkaStreamsConfiguration.asProperties());
        StreamsBuilder builder = new StreamsBuilder();

        KStream<Long, Post> inputStream = builder.stream("processedPosts");

        // Determine the filter type and apply the filter
        Predicate<Long, Post> filterPredicate = null;

        switch (searchTypeDTO.getType().toLowerCase()) {
            case "usernames":
                filterPredicate = (key, value) -> value.getAppUser().getUsername().contains(searchTypeDTO.getValue());
                break;
            case "text":
                filterPredicate = (key, value) -> value.getMessageText().contains(searchTypeDTO.getValue());
                break;
            case "tags":
                filterPredicate = (key, value) -> value.getTags() != null && value.getTags().stream().anyMatch(tag -> tag.contains(searchTypeDTO.getValue()));
                break;
            default:
                log.error("Invalid search type: {}", searchTypeDTO.getType());
                return; // Invalid search type, exit the method early
        }

        // Apply the filter and send to the output topic
        if (filterPredicate != null) {
            KStream<Long, Post> filteredStream = inputStream.filter(filterPredicate);
            filteredStream.to("filteredPosts", Produced.with(Serdes.Long(), new PostSerde()));
        }

        if (kafkaStreams == null) {
            KafkaStreams kafkaStreams = new KafkaStreams(builder.build(), streamsConfig);
            kafkaStreams.start();
        }
    }
}
