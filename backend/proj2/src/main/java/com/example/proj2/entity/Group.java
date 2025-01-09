package com.example.proj2.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups") 
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id; 

    private String name;

    // many-to-many mappedBy = "groups" in AppUser
    @ManyToMany(mappedBy = "groups")
    @JsonIgnore
    private Set<AppUser> members = new HashSet<>();

    // OneToMany for GroupEvent
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<GroupEvent> events = new HashSet<>();

    // Constructors, getters, setters
    public Group() {}

    public Group(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Set<AppUser> getMembers() {
        return members;
    }
    public void setMembers(Set<AppUser> members) {
        this.members = members;
    }

    public Set<GroupEvent> getEvents() {
        return events;
    }
    public void setEvents(Set<GroupEvent> events) {
        this.events = events;
    }
}
