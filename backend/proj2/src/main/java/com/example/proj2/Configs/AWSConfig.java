// package com.example.proj2.Configs;

// import com.amazonaws.auth.AWSCredentials;
// import com.amazonaws.auth.AWSStaticCredentialsProvider;
// import com.amazonaws.auth.BasicAWSCredentials;
// import com.amazonaws.regions.Regions;
// import com.amazonaws.services.s3.AmazonS3;
// import com.amazonaws.services.s3.AmazonS3ClientBuilder;

// import java.net.URI;
// import java.net.URISyntaxException;
// import com.example.proj2.Configs.MyConfig;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.autoconfigure.AutoConfigureOrder;
// import org.springframework.boot.context.properties.ConfigurationProperties;
// import org.springframework.cloud.vault.config.Secrets;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.vault.annotation.VaultPropertySource;
// import org.springframework.vault.authentication.TokenAuthentication;
// import org.springframework.vault.client.VaultEndpoint;
// import org.springframework.vault.core.VaultTemplate;
// import org.springframework.vault.support.VaultResponseSupport;


// @Configuration
// public class AWSConfig {

// 	@Bean
// 	public AmazonS3 s3Client() {

// 		AWSCredentials credentials = new BasicAWSCredentials(config.getAccessKey(), config.getAccessSecret());
// 		return AmazonS3ClientBuilder.standard()
// 			.withCredentials(new AWSStaticCredentialsProvider(credentials))
// 			.withRegion(config.getRegion())
// 			.build();

// 	}
// }

package com.example.proj2.Configs;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AWSConfig {

	@Value("${aws.access.keyId}")
	private String accessKey;

	@Value("${aws.access.secret}")
	private String accessSecret;

	private String region = "us-east-2";

	@Bean
	public AmazonS3 s3Client() {
		AWSCredentials credentials = new BasicAWSCredentials(accessKey, accessSecret);

		return AmazonS3ClientBuilder.standard()
			.withCredentials(new AWSStaticCredentialsProvider(credentials))
			.withRegion(region)
			.build();

	}
}

