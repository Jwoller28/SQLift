package com.example.proj2.entity;

import jakarta.persistence.*;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "sent_by", referencedColumnName = "id", nullable = false)
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "goal_id", referencedColumnName = "id", nullable = false)
    private Tracker tracker;

    @Column(name = "message_text", nullable = false, length = 500)
    private String messageText;

    private String imageUrl;

    public Post() {
    }

    public Post(Integer id, AppUser appUser, Tracker tracker, String messageText, String imageUrl) {
        this.id = id;
        this.appUser = appUser;
        this.tracker = tracker;
        this.messageText = messageText;
        this.imageUrl = imageUrl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AppUser getUser() {
        return this.appUser;
    }

    public void setUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public Tracker getTracker() {
        return tracker;
    }

    public void setTracker(Tracker tracker) {
        this.tracker = tracker;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", user=" + appUser +
                ", tracker=" + tracker +
                ", messageText='" + messageText + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
