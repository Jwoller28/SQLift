package com.example.proj2.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.KafkaListeners;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import com.example.proj2.Entity.Post;
import com.example.proj2.Repository.PostRepository;

@Service
public class PostService {
    
    @Autowired
    private KafkaTemplate<String, Post> kafkaPostTemplate;

    @Autowired
    private PostRepository postRepostiory;

    private List<Post> postList = new ArrayList<>();
    
    public void sendPost(Post post)
    {   
        CompletableFuture<SendResult<String,Post>> future = kafkaPostTemplate.send("unprocessedPosts", post);
        postRepostiory.save(post);
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

    @KafkaListener(topics="processedPosts", containerFactory = "kafkaListenerContainerFactory", groupId = "app-users")
    public void getPost(ConsumerRecord<Integer, Post> record)
    {   
        System.out.println("Received Message in group users: " + record.toString());
        postList.add(record.value());
    }

    public List<Post> getPostList() 
    {
        List<Post> ret = postList;
        postList = new ArrayList<Post>();
        return ret;
    }
}
