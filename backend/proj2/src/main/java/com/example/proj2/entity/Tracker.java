package com.example.proj2.entity;


import com.example.proj2.entity.type.Exercise;
import com.example.proj2.entity.type.Nutrition;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Set;
import java.time.LocalDate;
import java.util.Date;

@Entity
public class Tracker {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id_tracker", referencedColumnName = "id", nullable = false)
    private AppUser appUser;
    
    @ManyToOne
    @JoinColumn(name = "goal_id_tracker", referencedColumnName = "id", nullable = false)
    private Goal goal;

    public AppUser getAppUser() {
        return appUser;
    }

    public Tracker(Long id, AppUser appUser, Goal goal, Date createdAt, double sleep, double water, Exercise exercise, Nutrition nutrition) {
        this.id = id;
        this.appUser = appUser;
        this.goal = goal;
        this.createdAt = createdAt;
        this.sleep = sleep;
        this.water = water;
        this.exercise = exercise;
        this.nutrition = nutrition;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;
    
    private double sleep;
    private double water;
    @Embedded
    private Exercise exercise;
    @Embedded
    private Nutrition nutrition;
    private LocalDate waterDate;
    private LocalDate sleepDate;

    public Tracker() {
    }

    public Tracker(Long id, AppUser appUser, Date createdAt, double sleep, double water, Exercise exercise, Nutrition nutrition) {
        this.id = id;
        this.appUser = appUser;
        this.createdAt = createdAt;
        this.sleep = sleep;
        this.water = water;
        this.exercise = exercise;
        this.nutrition = nutrition;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AppUser getUser() {
        return appUser;
    }

    public LocalDate getWaterDate() {
        return waterDate;
    }

    public void setWaterDate(LocalDate waterDate) {
        this.waterDate = waterDate;
    }

    public LocalDate getSleepDate() {
        return sleepDate;
    }

    public void setSleepDate(LocalDate sleepDate) {
        this.sleepDate = sleepDate;
    }

    public void setUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public double getSleep() {
        return sleep;
    }

    public void setSleep(double sleep) {
        this.sleep = sleep;
    }

    public double getWater() {
        return water;
    }

    public void setWater(double water) {
        this.water = water;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Nutrition getNutrition() {
        return nutrition;
    }

    public void setNutrition(Nutrition nutrition) {
        this.nutrition = nutrition;
    }
    @Override
    public String toString() {
        return "Tracker{" +
                "id=" + id +
                ", user=" + appUser +
                ", createdAt=" + createdAt +
                ", sleep=" + sleep +
                ", water=" + water +
                ", exercise=" + exercise +
                ", nutrition=" + nutrition +
                ", goal=" + goal +
                '}';
    }
}
