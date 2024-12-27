package com.example.proj2.Serializer;

import java.util.Map;

import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Serializer;

import com.example.proj2.Entity.Post;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PostSerializer implements Serializer<Post> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
    }

    @Override
    public byte[] serialize(String topic, Post data) {
        try {
            if (data == null){
                return null;
            }
            return objectMapper.writeValueAsBytes(data);
        } catch (Exception e) {
            throw new SerializationException("Error when serializing Post to byte[]");
        }
    }

    @Override
    public void close() {
    }
}