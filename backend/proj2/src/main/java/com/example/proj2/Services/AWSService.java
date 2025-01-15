package com.example.proj2.Services;

import com.amazonaws.AmazonClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.example.proj2.repositories.AWSRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


@Service
public class AWSService implements AWSRepository{


	@Autowired
	private AmazonS3 s3Client;
	
	private static Logger log = LoggerFactory.getLogger(AWSService.class);

	@Override
	public void uploadFile(
		final String bucketName,
		final String keyName,
		final Long contentLength,
		final String contentType,
		final InputStream value) throws AmazonClientException
	{
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentLength(contentLength);
		metadata.setContentType(contentType);

		s3Client.putObject(bucketName, keyName, value, metadata);
		log.info("File uploaded to bucket({}): {}", bucketName, keyName);
	}

	@Override
	public ByteArrayOutputStream downloadFile(
		final String bucketName,
		final String keyName) throws AmazonClientException
	{	try
		{
		S3Object s3Object = s3Client.getObject(bucketName, keyName);
		InputStream inputStream = s3Object.getObjectContent();
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

		int len;
		byte[] buffer = new byte[4096];
		while((len = inputStream.read(buffer, 0, buffer.length)) != - 1) {
			outputStream.write(buffer, 0, len);
	}
		log.info("File downloaded from bucket({}): {}", bucketName, keyName);
		return outputStream;
		}
		catch(Exception ex)
		{
			return null;
		}
	}

	@Override
	public void deleteFile(
		final String bucketName,
		final String keyName) throws AmazonClientException {
			s3Client.deleteObject(bucketName, keyName);
			log.info("File deleted from bucket({}): {}" , bucketName, keyName);
		}

	
}

