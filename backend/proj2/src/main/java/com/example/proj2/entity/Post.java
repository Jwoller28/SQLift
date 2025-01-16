package com.example.proj2.entity;

import com.example.proj2.entity.Goal;

import jakarta.persistence.ManyToOne;

import com.example.proj2.entity.Comment;

import jakarta.persistence.OneToMany;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;

import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

import org.springframework.transaction.annotation.Transactional;

@Entity
@Table(name="post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private long id;

    @ManyToOne
    @JoinColumn(name = "goal_id_post", referencedColumnName = "id")
    private Goal goal; // Many Posts can belong to a Goal
    
    @ManyToOne
    @JoinColumn(name = "user_id_post", referencedColumnName = "id")    
    private AppUser appUser; //Many Posts can belong to a User

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date creation;

    @Column(name = "message_text")
    private String message_text;

    @Lob  // Indicates this is a large object (binary or text)
    @Column(name = "img_data")  // Use BYTEA for PostgreSQL
    @Basic(fetch = FetchType.LAZY)  // Lazy loading for large objects
    private byte[] photo;

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags;

    @OneToMany
    private List<Comment> comments;


    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getMessageText() {
        return message_text;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setMessageText(String message_text) {
        this.message_text = message_text;
    }



    public Post() {}



    public Post(Goal goal, AppUser appUser, String message_text, byte[] photo) {
        this.goal = goal;
        this.message_text = message_text;
        this.appUser = appUser;
        this.photo = photo;
    }

	
    public void setId(long id)
    {
	    this.id = id;
    }

    public Date getCreation() {
	return creation;
    }
    public long getPostId() {
        return id;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }

    public AppUser getUser() {
        return appUser;
    }

    public void setUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public byte[] getPhoto() {
        return photo;
    }

    @Transactional
    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

}
