package com.example.proj2.services;

import com.example.proj2.Dto.SearchTypeDTO;
import com.example.proj2.Serializer.PostSerde;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.AppUser;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.KStream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.proj2.Services.SearchService;
import org.apache.kafka.streams.TopologyTestDriver;
import org.apache.kafka.streams.TestOutputTopic;
import org.apache.kafka.streams.TestInputTopic;
import java.util.Arrays;
import java.util.Properties;

import org.apache.kafka.streams.KeyValue;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SearchServiceTest {

    private TopologyTestDriver testDriver;
    private TestInputTopic<Long, Post> inputTopic;
    private TestOutputTopic<Long, Post> outputTopic;
    private Serde<Post> postSerde = new PostSerde();

    private SearchTypeDTO searchTypeDTO = new SearchTypeDTO();

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        // Create topology
        StreamsBuilder builder = new StreamsBuilder();
        KStream<Long, Post> source = builder.stream("processedPosts");

        // Apply filters based on SearchTypeDTO
        source.filter((key, value) -> {
            if (searchTypeDTO == null) return false;

            switch (searchTypeDTO.getType().toLowerCase()) {
                case "username":
                    return value.getAppUser().getUsername().contains(searchTypeDTO.getValue());
                case "text":
                    return value.getMessageText().contains(searchTypeDTO.getValue());
                case "tags":
                    return value.getTags() != null && value.getTags().stream().anyMatch(tag -> tag.contains(searchTypeDTO.getValue()));
                default:
                    return false;
            }
        }).to("filteredPosts"); // Make sure 'filteredPosts' is an output topic

        // Configure properties
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "test");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "dummy:1234");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.Long().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, PostSerde.class);

        // Create StreamsConfig and TopologyTestDriver
        Topology topology = builder.build();
        testDriver = new TopologyTestDriver(topology, props);

        // Create input and output topics
        inputTopic = testDriver.createInputTopic("processedPosts",
                Serdes.Long().serializer(),
                postSerde.serializer());

        outputTopic = testDriver.createOutputTopic("filteredPosts",
                Serdes.Long().deserializer(),
                postSerde.deserializer());
    }


    @AfterEach
    void tearDown() {
        testDriver.close();
    }

    @Test
    void testTextFilter() {
        // Set search type to text
        searchTypeDTO.setType("text");
        searchTypeDTO.setValue("Test");

        // Create test post
        Post post = new Post();
        post.setMessageText("Test message");

        // Push test data
        inputTopic.pipeInput(1L, post);

        // Verify output
        KeyValue<Long, Post> output = outputTopic.readKeyValue();
        assertEquals("Test message", output.value.getMessageText());
    }

    @Test
    void testUsernameFilter() {
        // Set search type to username
        searchTypeDTO.setType("username");
        searchTypeDTO.setValue("testuser");

        // Create test post with user
        Post post = new Post();
        AppUser user = new AppUser();
        user.setUsername("testuser");
        post.setAppUser(user);

        // Push test data
        inputTopic.pipeInput(1L, post);

        // Verify output
        KeyValue<Long, Post> output = outputTopic.readKeyValue();
        assertEquals("testuser", output.value.getAppUser().getUsername());
    }

    @Test
    void testTagFilter() {
        // Set search type to tags
        searchTypeDTO.setType("tags");
        searchTypeDTO.setValue("test");

        // Create test post with tags
        Post post = new Post();
        post.setTags(Arrays.asList("test", "filter"));

        // Push test data
        inputTopic.pipeInput(1L, post);

        // Verify output
        KeyValue<Long, Post> output = outputTopic.readKeyValue();
        assertEquals(2, output.value.getTags().size());
        assertEquals("test", output.value.getTags().get(0));
    }
}