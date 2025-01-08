import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function UserRegistration() {

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[email, setEmail] = useState("");
    const[first_name, setFirstName] = useState("");
    const[last_name, setLastName] = useState("");
    const[photo_url, setPhotoUrl] = useState(""); 
    const[token, setToken] = useState("");
    const[id, setId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {   // Stores registered user's token in browser
        localStorage.setItem('token', JSON.stringify(token))
    }, [token])

    useEffect(() => {
        localStorage.setItem('id', JSON.stringify(id));
    }, [id])

    // Function that runs when submit button is clicked
    function registerSubmit(event: FormEvent){

        event.preventDefault();
        const regUser = async () =>{    // Connects to backend to register user
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password, email, first_name, last_name, photo_url})
            });

            if(!response.ok){
                alert(`Error Registering User! Error Code: ${response.status}`)
            }
            else{   // If registering user is successful, go to login function
                const data = await response.json();
                console.log('Here is the data variable which holds what is returned from backend: ', data);
                setId(data.id);
                loginUserAfterRegister();
            }
        }
       regUser();

    }

    // Function to log user in and get their JWT token
    function loginUserAfterRegister(){
        const loginUser = async () => {
            const loginRegUser = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            if(!loginRegUser.ok){
                alert(`Failed to Log user in after registering with error code: ${loginRegUser.status}`);
            }
            else{   // On successful login, update token state and go to goals page
                const tokReturned = await loginRegUser.text();
                console.log("Here is registered users login token: ", tokReturned);
                setToken(tokReturned);
                navigate('/goals');
            }
        }
        loginUser();
    }
  return (
    <>
        <form onSubmit={registerSubmit}>
        <label>Username:
            <input type='text' value={username} onChange={(e:any) => setUsername(e.target.value)} required/>
        </label><br/>

        <label>Password:
            <input type='password' value={password} onChange={(e:any) => setPassword(e.target.value)} required/>
        </label><br/>

        <label>Email:
            <input type='text' value={email} onChange={(e:any) => setEmail(e.target.value)}/>
        </label><br/>

        <label>First Name:
            <input type='text' value={first_name} onChange={(e:any) => setFirstName(e.target.value)}/>
        </label><br/>

        <label>Last Name:
            <input type='text' value={last_name} onChange={(e:any) => setLastName(e.target.value)}/>
        </label><br/>

        <label>Photo URL:
            <input type='text' value={photo_url} onChange={(e:any) => setPhotoUrl(e.target.value)}/>
        </label><br/>

        <button type='submit'>Submit</button>
        </form>
    </>
  )
}

export default UserRegistration