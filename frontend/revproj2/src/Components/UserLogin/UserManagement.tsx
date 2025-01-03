<<<<<<< HEAD
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import UserLogin from './UserLogin';
import { useNavigate } from 'react-router-dom';
import { AuthContext, useAuth, UserContext } from '../UserContext/UserContext';
=======
import React, { FormEvent, useContext, useState } from 'react'
import UserLogin from './UserLogin';
import { AuthContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
>>>>>>> ebbd7023a (Reorganized files)


// Contains the logic for the UserLogin page and what to do with the input/submit button interaction
function UserManagement() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
<<<<<<< HEAD
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const {login} = useAuth();
    //const context = useContext(UserContext);
    // if(!context){
    //     throw new Error("Login must be used within an AuthProvider")
    // }
    //const {dispatch} = context;

    useEffect(() => {
        localStorage.setItem('token', JSON.stringify(token))    // This useEffect is used to store the users JWT token in the browsers local storage after they login, keeping their credentials accessible when needed on other pages.
    }, [token])
=======
    const[data, setData] = useState<any | null>(null); // Created to use Jest with api call

    const context = useContext(AuthContext);
    if(!context){
        throw new Error("Login must be used within an AuthProvider")
    }
    const {dispatch} = context;
>>>>>>> ebbd7023a (Reorganized files)

    // Function to handle submit event on login page
    function handleSubmit(event: FormEvent){
        event.preventDefault();
<<<<<<< HEAD
        // if(context){
        //     context.login(username, password);
        //     login();
        //     console.log(username, password);
        // }
        const fetchData = async () => {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            
            // If response is not ok, give user an alert.
            if(!response.ok){
                alert(`Invalid Credentials! Error Code: ${response.status}`);
            }
            else{ 
                // If response ok, update token state and go to calendar page
                const data = await response.text(); // Gets returned JWT token
                setToken(data);
                login();
                // dispatch({type: 'LOGIN', payload: {username, password}})
                navigate("/calendar");
            }
        }

        // const fetchToken = async () =>{
            // const responseT = await fetch('http://localhost:8080/me', {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTczNTMzMTUyMywiZXhwIjoxNzM1MzM1MTIzfQ.jgGCf7aekWFgo_0qKjmnvhLhs8iz8DaN0FmMfq-PBtc',
            //         'Access-Control-Allow-Origin': "*"
            //     },
            //     credentials : 'include'
            // }).then(response => {
            //     if(!response.ok){
            //         throw new Error(`HTTP error status: ${response.status}`);
            //     }
            //     console.log("Here is the promise: ", response.text().then(data =>
            //     {
            //         console.log('Here is data: ', data)
            //     }
            //     ));
            // }).catch(error => {
            //     console.error('The Fetch failed: ', error);
            // });

        //     const responseValidToken = await fetch("http://localhost:8080/me", {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTczNTM0OTAzMywiZXhwIjoxNzM1MzUyNjMzfQ.pnO3E0MHA58s1GIt4m4N38VhTOAl68uV-uN37tkunsY',
        //             'Access-Control-Allow-Origin': "*"
        //             },
        //             credentials : 'include'
        //     });

        //     const userToken = await responseValidToken.text();
        //     console.log(userToken);

        // }
        fetchData();
        // fetchToken();
    }

    // Function to handle register button on login page, redirect to register page.
=======
        // Test api for Jest
        const fetchData = async (): Promise<any> => {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            
            const d = response.json().then((result) => setData(result));
        }
        fetchData();
        dispatch({type: 'LOGIN', payload: {username, password}})
        // console.log(username, password);
    }

    // Function to handle register button on login page, redirect to register page.
    const navigate = useNavigate();
>>>>>>> ebbd7023a (Reorganized files)
    function handleRegister(event: FormEvent){
        event.preventDefault();
        navigate('/register');
    }

// This return statement uses UserLogin page as its display and populates the data it needs to display.
  return (
    <>
        <UserLogin username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleSubmit={handleSubmit} handleRegister={handleRegister}/>
    </>
  )
}

<<<<<<< HEAD
export default UserManagement
=======
export default UserManagement
>>>>>>> ebbd7023a (Reorganized files)
