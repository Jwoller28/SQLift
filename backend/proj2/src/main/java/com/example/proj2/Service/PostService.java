package com.example.proj2.Service;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import com.example.proj2.Entity.Post;

@Service
public class PostService {
    
    @Autowired
    private KafkaTemplate<String, Post> kafkaPostTemplate;

    public void sendPost(Post post)
    {   
        CompletableFuture<SendResult<String,Post>> future = kafkaPostTemplate.send("unprocessedPosts", post);

        future.whenComplete((result, ex) -> {
            if(ex == null)
            {
                System.out.println("Sent Post: " + post.toString() + " with offset " + result.getRecordMetadata().offset());
            }
            else {
                System.out.println("Fail: " + ex.getMessage());
            }
        });
    }
}
