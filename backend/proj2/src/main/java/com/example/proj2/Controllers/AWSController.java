// package com.example.proj2.Controllers;

// import com.example.proj2.Services.AWSService;
// import com.example.proj2.Enum.FileType;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.ResponseEntity;
// import org.springframework.util.StringUtils;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.io.InputStream;
// import java.io.ByteArrayOutputStream;


// @RestController
// @RequestMapping("/s3bucket")

// public class AWSController
// {
// 	@Autowired
// 	private AWSService service;

// 	@PostMapping("/{bucketName}/upload")
// 	public ResponseEntity<?> uploadFile(
// 		@PathVariable("bucketName") String bucketName,
// 		@RequestPart("file") MultipartFile file)
// 	{	try
// 		{
// 		if (file.isEmpty()) {
// 			return ResponseEntity.badRequest().body("File is empty");
// 		}
// 		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
// 		String contentType = file.getContentType();
// 		long fileSize = file.getSize();
// 		InputStream inputStream = file.getInputStream();
// 		service.uploadFile(bucketName, fileName, fileSize, contentType, inputStream);

// 		return ResponseEntity.ok().body("File uploaded succcessfully");
// 		}
// 		catch(Exception ex)
// 		{
// 			return ResponseEntity.badRequest().body(ex.getMessage());
			
// 		}
// 	}

// 	@GetMapping("/{bucketName}/download/{fileName}")
// 	public ResponseEntity<?> downloadFile(
// 		@PathVariable("bucketName") String bucketName,
// 		@PathVariable("fileName") String fileName)
// 		{
// 			ByteArrayOutputStream body = service.downloadFile(bucketName, fileName);
// 			System.out.println(body);
// 			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"").contentType(FileType.fromFilename(fileName)).body(body.toByteArray());
// 		}
// 	@DeleteMapping("/{bucketName}/{fileName}")
// 	public ResponseEntity<?> deleteFile(
// 		@PathVariable("bucketName") String bucketName,
// 		@PathVariable("fileName") String fileName)
// 		{
// 			service.deleteFile(bucketName, fileName);
// 			return ResponseEntity.ok().build();
// 		}
// }

