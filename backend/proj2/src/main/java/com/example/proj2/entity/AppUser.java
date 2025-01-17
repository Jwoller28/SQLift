package com.example.proj2.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import com.fasterxml.jackson.annotation.JsonIgnore;


import java.util.Set;
import java.time.LocalDate;
import java.util.Date;

@Entity
public class AppUser  {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private int id;

    @Column(unique = true, length = 100,nullable = false)

    @OneToMany(mappedBy = "appUser")
    private Set<Post> posts;
    @OneToMany(mappedBy = "appUser")
    private Set<Tracker> trackers;
    @OneToMany(mappedBy = "appUser")
    private Set<Goal> goals;
    @OneToMany(mappedBy = "user")
    private Set<Comment> comments;

    private String username;
    private String email;
    private String first_name;
    private String last_name;
    private String photo_url;
   // private LocalDate waterStartDate;
   // private LocalDate sleepStartDate;
   // private LocalDate exerciseStartDate;
   // private LocalDate nutritionStartDate;

    @Column(nullable = false, length = 100)
    private String password;

    @CreationTimestamp
    @Column( name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PersonalEvent> personalEvents;


    @ManyToMany
    @JoinTable(
        name = "user_groups",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    @JsonIgnore
    private Set<Group> groups = new HashSet<>();


    public AppUser() {}

    public AppUser(Integer id, String username, String password) {
        this.id = id;
        this.username=username;
        this.password=password;
    }

    /*@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }*/



    public List<PersonalEvent> getPersonalEvents() {
        return personalEvents;
    }

    public void setPersonalEvents(List<PersonalEvent> personalEvents) {
        this.personalEvents = personalEvents;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public AppUser(String username, String email, String first_name, String last_name, String photo_url, String password) {
        this.username = username;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.photo_url = photo_url;
        this.password = password;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Set<Group> getGroups() {
        return groups;
    }
    
    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }

   /* public LocalDate getWaterStartDate() {
        return waterStartDate;
    }

    public void setWaterStartDate(LocalDate waterStartDate) {
        this.waterStartDate = waterStartDate;
    }

    public LocalDate getSleepStartDate() {
        return sleepStartDate;
    }

    public void setSleepStartDate(LocalDate sleepStartDate) {
        this.sleepStartDate = sleepStartDate;
    }

    public LocalDate getExerciseStartDate() {
        return exerciseStartDate;
    }

    public void setExerciseStartDate(LocalDate exerciseStartDate) {
        this.exerciseStartDate = exerciseStartDate;
    }

    public LocalDate getNutritionStartDate() {
        return nutritionStartDate;
    }

    public void setNutritionStartDate(LocalDate nutritionStartDate) {
        this.nutritionStartDate = nutritionStartDate;
    }
*/

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getPhoto_url() {
        return photo_url;
    }

    public void setPhoto_url(String photo_url) {
        this.photo_url = photo_url;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", first_name='" + first_name + '\'' +
                ", last_name='" + last_name + '\'' +
                ", photo_url='" + photo_url + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
