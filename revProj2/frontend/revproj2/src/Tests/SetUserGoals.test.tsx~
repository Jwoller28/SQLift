import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import SetUserGoals from "../Components/SetUserGoals/SetUserGoals";

test('This test will check if the nutrition forms behavior is acting accordingly when data is submitted', () => {

    render(<SetUserGoals/>)

    // These four pairs of statements get the input fields of nutrition form and fill them with values
    const inputCals = screen.getByLabelText(/calories/i);
    fireEvent.change(inputCals, {target: {value: 500}});

    const inputCarbs = screen.getByLabelText(/carbs/i);
    fireEvent.change(inputCarbs, {target: {value: 50}});

    const inputFat = screen.getByLabelText(/fat/i);
    fireEvent.change(inputFat, {target: {value: 5}});

    const inputProtein = screen.getByLabelText(/protein/i);
    fireEvent.change(inputProtein, {target: {value: 50}});

    // These statements test to see if the value changes were actually persisted
    expect(inputCals).toHaveValue(500);
    expect(inputCarbs).toHaveValue(50);
    expect(inputFat).toHaveValue(5);
    expect(inputProtein).toHaveValue(50);
})

test('This test will check if the exercise forms behavior is acting accordingly when data is submitted', () => {

    render(<SetUserGoals/>)

    // These four pairs of statements get the input fields of exercise form and fill them with values
    const inputWeight = screen.getByLabelText(/max weight/i);
    fireEvent.change(inputWeight, {target: {value: 50}});

    const inputReps = screen.getByLabelText(/reps/i);
    fireEvent.change(inputReps, {target: {value: 10}});

    const inputSets = screen.getByLabelText(/sets/i);
    fireEvent.change(inputSets, {target: {value: 3}});

    const inputBmi = screen.getByLabelText(/bmi/i);
    fireEvent.change(inputBmi, {target: {value: 50}});

    const inputCardio = screen.getByLabelText(/time spent/i);
    fireEvent.change(inputCardio, {target:{value: 30}})

    // These statements test to see if the value changes were actually persisted
    expect(inputWeight).toHaveValue(50);
    expect(inputReps).toHaveValue(10);
    expect(inputSets).toHaveValue(3);
    expect(inputBmi).toHaveValue(50);
    expect(inputCardio).toHaveValue(30)
})

test('This test will check if the Water forms behavior is acting accordingly when data is submitted', () => {

    render(<SetUserGoals/>)

    // These four pairs of statements get the input fields of water form and fill them with values
    const inputWater = screen.getByLabelText(/Daily Water Intake/i);
    fireEvent.change(inputWater, {target: {value: 50}});

    // These statements test to see if the value changes were actually persisted
    expect(inputWater).toHaveValue(50)
})

test('This test will check if the Sleep forms behavior is acting accordingly when data is submitted', () => {

    render(<SetUserGoals/>)

    // These four pairs of statements get the input fields of sleep form and fill them with values
    const inputSleep = screen.getByLabelText(/hours of sleep/i);
    fireEvent.change(inputSleep, {target: {value: 8}});

    // These statements test to see if the value changes were actually persisted
    expect(inputSleep).toHaveValue(8);
})
