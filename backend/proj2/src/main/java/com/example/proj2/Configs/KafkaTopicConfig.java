package com.example.proj2.Configs;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.KafkaAdmin;

@EnableKafka
@Configuration
public class KafkaTopicConfig {
    
    //Set the Server address for kafka server
    @Value(value = "${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;

    @Bean
    public KafkaAdmin kafkaAdmin() // Allows programs to modify Kafka clusters
    {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress); // Configuration for Admin Client
        return new KafkaAdmin(configs);
    }

    // Topic 1: UnProcessed Posts
    @Bean
    public NewTopic unprocessedPosts() {
        return new NewTopic("unprocessedPosts", 5, (short) 1); // String: Topic name, Int: Partitions to split Topic into, Short: Replication Factor for redundancy.
    }

        // Topic 1: Processed Posts
        @Bean
        public NewTopic processedPosts() {
            return new NewTopic("processedPosts", 5, (short) 1);
        }


}
