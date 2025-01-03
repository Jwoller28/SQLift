package com.example.proj2.Serializer;

import java.util.Map;

import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import com.example.proj2.entity.Post;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PostDeserializer implements Deserializer<Post> {
    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
    }

    @Override
    public Post deserialize(String topic, byte[] data) {
        try {
            if (data == null){
                return null;
            }
            return objectMapper.readValue(new String(data, "UTF-8"), Post.class);
        } catch (Exception e) {
            throw new SerializationException("Error when deserializing byte[] to Post");
        }
    }

    @Override
    public void close() {
    }
}