package com.example.proj2.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.LinkedBlockingQueue;
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
    private KafkaTemplate<Long, Post> kafkaPostTemplate;

    @Autowired
    private PostRepository postRepostiory;

    private final BlockingQueue<Post> messageQueue = new LinkedBlockingQueue<>(); // Allows for Thread Safety
    
    // private List<Post> postList = new ArrayList<>();
    
    public void sendPost(Post post)
    {   
        
        CompletableFuture<SendResult<Long,Post>> future = kafkaPostTemplate.send("unprocessedPosts", post.getPost_Id(), post);
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

    // @KafkaListener(topics="processedPosts", containerFactory = "kafkaListenerContainerFactory", groupId = "app-users")
    // public void getPost(List<Post> posts)
    // {   
    //     postList.addAll(posts);
    // }

    // public List<Post> getPostList() 
    // {
    //     List<Post> ret = postList;
    //     postList = new ArrayList<Post>();
    //     return ret;
    // }

        

    // Kafka listener
    @KafkaListener(topics="processedPosts", containerFactory = "kafkaListenerContainerFactory", groupId = "app-users")
    public void listen(Post post) {
        messageQueue.offer(post); // Add posts to the queue
        postRepostiory.save(post); //persists Post
    }

    public Post getNextPost(long timeoutMillis) throws InterruptedException {
        // Wait for a message or timeout
        return messageQueue.poll(timeoutMillis, java.util.concurrent.TimeUnit.MILLISECONDS);
    }
}
