package com.example.proj2.Configuration;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.IntegerDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import com.example.proj2.Entity.Post;
import com.example.proj2.Serializer.PostDeserializer;

    @EnableKafka // Enables detection of @Kafka Listener
    @Configuration
    public class KafkaConsumerConfig {
        
        @Value(value = "${spring.kafka.bootstrap-servers}")
        private String bootstrapAddress;

        @Value(value = "${spring.kafka.consumer.group-id}")
        private String groupId;

        
        @Bean
        public ConsumerFactory<Integer, Post> consumerFactory() {
            Map<String, Object> props = new HashMap<>();
            props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
            props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
            props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, IntegerDeserializer.class);
            props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, PostDeserializer.class);
            return new DefaultKafkaConsumerFactory<>(props);
        }

        @Bean
        public ConcurrentKafkaListenerContainerFactory<Integer, Post> kafkaListenerContainerFactory() {
            ConcurrentKafkaListenerContainerFactory<Integer, Post> factory = new ConcurrentKafkaListenerContainerFactory<>();
            factory.setConsumerFactory(consumerFactory());
            factory.setConcurrency(5); // 5 Listeners
            factory.getContainerProperties();
            return factory;
        }
    }
