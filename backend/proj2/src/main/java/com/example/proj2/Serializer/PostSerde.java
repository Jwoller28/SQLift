package com.example.proj2.Serializer; 
import org.apache.kafka.common.serialization.Serdes.WrapperSerde;
import com.example.proj2.Entity.Post;

public class PostSerde extends WrapperSerde<Post> {

    public PostSerde() {
        super(new PostSerializer(), new PostDeserializer());
    }
}