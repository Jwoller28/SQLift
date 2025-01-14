import { fireEvent, render, screen } from "@testing-library/react";
import UserLogin from "../../../src/Components/UserLogin/UserLogin";
import React from "react";
import { MemoryRouter } from "react-router-dom";
/**
 * @jest-environment jsdom
 */


test('Renders the user login page and tests if the username and password state gets updated after they are entered', () =>{

    // Creating mock versions of functions that are props (parameters) for UserLogin
    const mockSubmit = jest.fn();
    const mockRegister = jest.fn();
    const mockSetUsername = jest.fn();
    const mockSetPassword = jest.fn();

    // Rendering UserLogin page with the correct props needed to function
    render(<MemoryRouter>
            <UserLogin username="" setUsername={mockSetUsername} password="" setPassword={mockSetPassword} handleSubmit={mockSubmit} handleRegister={mockRegister}/>
        </MemoryRouter>);

    // Getting the input textbox for username and triggering a text event change
    const inputUser = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(inputUser, {target: {value: "user1"}});

    // Getting the input textbox for password and triggering a text event change
    const inputPass = screen.getByPlaceholderText(/enter password/i);
    fireEvent.change(inputPass, {target: {value: "pass"}});

    // Checking to see if the useState functions that were mocked are updating the username and password variables
    expect(mockSetUsername).toHaveBeenCalledWith("user1");
    expect(mockSetPassword).toHaveBeenCalledWith("pass")

})