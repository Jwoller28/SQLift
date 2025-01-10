package com.example.proj2.Configs;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.LongSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import com.example.proj2.entity.Post;
import com.example.proj2.Serializer.PostSerializer;

@EnableKafka
@Configuration
public class KafkaProducerConfig {

    //Set the Server address for kafka server
    @Value(value = "${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;

    @Bean
    public ProducerFactory<Long, Post> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);

        // Serialization is the process of converting objects into bytes

        // Images need to be serialized into bytes, so we'll have to implement a byte serializer rather than string when we start the image database.
        configProps.put(
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongSerializer.class); // Keys have a long value
        configProps.put(
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, PostSerializer.class); // will convert posts objects into byte arrays then sent to Broker
										 //
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<Long, Post> kafkaProducerTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
