import { fireEvent, render, screen } from "@testing-library/react"
import UserRegistration from "./UserRegistration"

test('Test to check if UserRegistration page is updating the state of all elements inputted', () =>{

    // Renders the UserRegistration page to be tested
    render(<UserRegistration/>);

    // Getting the input boxes for the page and inserting values into them.
    const inputUser = screen.getByLabelText(/username/i);
    fireEvent.change(inputUser, {target: {value: "user1"}});

    const inputPass = screen.getByLabelText(/password/i);
    fireEvent.change(inputPass, {target: {value: "pass"}});

    const inputEmail = screen.getByLabelText(/email/i);
    fireEvent.change(inputEmail, {target: {value: "asdf@revature.com"}});

    const inputFirstName = screen.getByLabelText(/first name/i);
    fireEvent.change(inputFirstName, {target: {value: "John"}});

    const inputLastName = screen.getByLabelText(/last name/i);
    fireEvent.change(inputLastName, {target: {value: "Doe"}});

    const inputPhotoUrl = screen.getByLabelText(/photo url/i);
    fireEvent.change(inputPhotoUrl, {target: {value: "test.img"}});

    // Checking to see if after the fired event change, that the text value has been updated for each field.
    expect(inputUser).toHaveValue("user1");
    expect(inputPass).toHaveValue("pass");
    expect(inputEmail).toHaveValue("asdf@revature.com");
    expect(inputFirstName).toHaveValue("John");
    expect(inputLastName).toHaveValue("Doe");
    expect(inputPhotoUrl).toHaveValue("test.img")


})