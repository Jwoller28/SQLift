package com.example.proj2.Controllers;

import com.example.proj2.Dto.SearchTypeDTO;
import com.example.proj2.entity.Post;
import com.example.proj2.Services.SearchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchController {

    @Autowired
    final static Logger logger = LoggerFactory.getLogger(SearchController.class);

    @Autowired
    private SearchService searchService;

    @Autowired
    private ObjectMapper objectMapper;


    public SearchController(SearchService searchService, ObjectMapper objectMapper)
    {
	this.searchService = searchService;
	this.objectMapper = objectMapper;
    }

    @PostMapping(value="/filter")
    public ResponseEntity<String> getFilterType(@RequestBody SearchTypeDTO searchTypeDTO)
    {
	logger.info(searchTypeDTO.getType());
	logger.info(searchTypeDTO.getValue());
        if(searchTypeDTO != null)
        {
            searchService.customFilterStream(searchTypeDTO);
            return ResponseEntity.ok().body("Success");
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value="filter/live/post")
    public ResponseEntity<Post> poll() {

        Post post = searchService.getNextFilteredPost();
        if(post != null)
        {
            return ResponseEntity.ok().body(post);
        }
        return ResponseEntity.noContent().build();
    }


    @GetMapping(value="/filter/posts")
    public ResponseEntity<List<Post>> getFilteredAll(){

        List<Post> posts = searchService.getFilteredPosts();
        
        if(posts != null)
        {
            return ResponseEntity.ok().body(posts);
        }
        return ResponseEntity.noContent().build();
    }

}
