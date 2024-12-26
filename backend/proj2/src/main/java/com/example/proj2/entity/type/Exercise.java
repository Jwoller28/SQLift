package com.example.proj2.entity.type;

public class Exercise {
    private double duration;
    private double volume;
    private double caloriesBurned;





    public Exercise() {
    }

    public Exercise(double duration, double caloriesBurned,double volume) {
        this.duration = duration;
        this.caloriesBurned=caloriesBurned;
        this.volume=volume;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    public double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    @Override
    public String toString() {
        return "Exercise{" +
                "duration=" + duration +
                ", volume=" + volume +
                ", caloriesBurned=" + caloriesBurned +
                '}';
    }
}
