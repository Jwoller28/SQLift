package com.example.proj2.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import org.hibernate.annotations.CreationTimestamp;
import java.util.List;
import com.example.proj2.entity.Post;
import com.example.proj2.entity.AppUser;

import java.util.Date;

@Entity
@Table(name="comments")
public class Comment
{



@Id
@GeneratedValue(strategy = GenerationType.AUTO)
@Column(nullable = false)
private int commentId;

@ManyToOne
@JoinColumn(name = "user_id_comments", referencedColumnName = "id")
private AppUser user;


@ManyToOne
@JoinColumn(name = "post_id_comments", referencedColumnName = "id")
private Post post;

public int getCommentId() {
	return commentId;
}


public Comment getSuperComment() {
	return superComment;
}


public List<Comment> getSubComments() {
	return subComments;
}
public void setUser(AppUser user) {
	this.user = user;
}


public void setPost(Post post) {
	this.post = post;
}


public void setText(String text) {
	this.text = text;
}


public void setSuperComment(Comment superComment) {
	this.superComment = superComment;
}

public void setId(int id) {
	this.commentId = id;
}

@CreationTimestamp
@Column(updatable = false, name = "created_at")
private Date timestamp;

@Column(name="message")
private String text;

@ManyToOne
@JoinColumn(name = "super_id")
private Comment superComment;

@OneToMany(mappedBy = "superComment")
private List<Comment> subComments;


public AppUser getUser() {
	return user;
}


public Post getPost() {
	return post;
}


public Date getTimestamp() {
	return timestamp;
}


public String getText() {
	return text;
}


public Comment getSuperComments() {
	return superComment;
}

	public Comment(AppUser user, Post post, String text)
	{
		this.user = user;
		this.post = post;
		this.text = text;
	}
	public Comment()
	{}
}
