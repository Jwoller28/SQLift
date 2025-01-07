package com.example.proj2.Serializer;

import java.util.Map;
import com.fasterxml.jackson.databind.DeserializationFeature;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import com.example.proj2.entity.Post;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PostDeserializer implements Deserializer<Post> {
    private ObjectMapper objectMapper;

    public PostDeserializer()
    {
	    this.objectMapper = new ObjectMapper();
	    this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }
    @Override
    public Post deserialize(String topic, byte[] data) {
        if (data == null) {
            return null;
        }

        try {
            // Deserialize directly from byte[] without converting to String
            return objectMapper.readValue(data, Post.class);
        } catch (Exception e) {
            // Log the original exception message to help debug
            throw new SerializationException("Error when deserializing byte[] to Post", e);
        }
    }

    @Override
    public void close() {
        // Cleanup if needed (e.g., closing connections)
    }
}
