package com.example.proj2.Configs;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.common.serialization.Serializer;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Printed;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.apache.kafka.streams.kstream.ValueMapper;
import org.apache.kafka.streams.processor.WallclockTimestampExtractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.annotation.KafkaStreamsDefaultConfiguration;
import org.springframework.kafka.config.KafkaStreamsConfiguration;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerde;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.example.proj2.Controller.PostController;
import com.example.proj2.Entity.Post;
import com.example.proj2.Repository.PostRepository;
import com.example.proj2.Serializer.PostDeserializer;
import com.example.proj2.Serializer.PostSerde;
import com.example.proj2.Serializer.PostSerializer;
import com.fasterxml.jackson.databind.JsonNode;

@EnableKafkaStreams
@Configuration
public class KafkaStreamsConfig {

    @Autowired
    final static Logger logger = LoggerFactory.getLogger(PostController.class);

    @Value(value = "${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;

    @Value(value = "${spring.application.name}")
    private String name;


    
    @Bean(name = KafkaStreamsDefaultConfiguration.DEFAULT_STREAMS_CONFIG_BEAN_NAME)
    public KafkaStreamsConfiguration kStreamsConfigs() {
         
        Map<String, Object> props = new HashMap<>();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, name);
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.Long().getClass().getName());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, 
              PostSerde.class.getName());
        props.put(StreamsConfig.DEFAULT_TIMESTAMP_EXTRACTOR_CLASS_CONFIG, WallclockTimestampExtractor.class.getName());
        props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, true);
        props.put(StreamsConfig.EXACTLY_ONCE_V2, true);
        return new KafkaStreamsConfiguration(props);
    }

    @Bean
    public KStream<Long, Post> kStream(StreamsBuilder kStreamBuilder) {
        logger.info("NOTE: STREAM BUILDING");
        KStream<Long, Post> stream = kStreamBuilder.stream("unprocessedPosts");
        System.out.println("Stream is Run");
        stream.to("processedPosts");
        stream.print(Printed.toSysOut());
        return stream;
    }

}
