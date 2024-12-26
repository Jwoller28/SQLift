package com.example.proj2.entity.type;

public class Nutrition {

    private double Kal;
    private double fat;
    private double carb;
    private double weight;
    private double protein;

    public Nutrition() {
    }

    public Nutrition(double kal, double fat, double carb, double weight,double protein) {
        Kal = kal;
        this.fat = fat;
        this.carb = carb;
        this.weight = weight;
        this.protein=protein;
    }

    public double getKal() {
        return Kal;
    }

    @Override
    public String toString() {
        return "Nutrition{" +
                "Kal=" + Kal +
                ", fat=" + fat +
                ", carb=" + carb +
                ", weight=" + weight +
                ", protien=" + protein +
                '}';
    }

    public void setKal(double kal) {
        Kal = kal;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getCarb() {
        return carb;
    }

    public void setCarb(double carb) {
        this.carb = carb;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }
}
