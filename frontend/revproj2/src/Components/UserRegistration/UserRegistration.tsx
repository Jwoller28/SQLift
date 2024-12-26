import React, { FormEvent, useState } from 'react'

function UserRegistration() {

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[email, setEmail] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[photoUrl, setPhotoUrl] = useState("");

    function registerSubmit(event: FormEvent){
        event.preventDefault();
        console.log("Username:", username, "Password:", password, "Email:", email, "First Name:", firstName, "Last Name:", lastName, "Photo URL:", photoUrl);
    }
  return (
    <>
        <form onSubmit={registerSubmit}>
        <label>Username:
            <input type='text' value={username} onChange={(e:any) => setUsername(e.target.value)}/>
        </label><br/>

        <label>Password:
            <input type='password' value={password} onChange={(e:any) => setPassword(e.target.value)}/>
        </label><br/>

        <label>Email:
            <input type='text' value={email} onChange={(e:any) => setEmail(e.target.value)}/>
        </label><br/>

        <label>First Name:
            <input type='text' value={firstName} onChange={(e:any) => setFirstName(e.target.value)}/>
        </label><br/>

        <label>Last Name:
            <input type='text' value={lastName} onChange={(e:any) => setLastName(e.target.value)}/>
        </label><br/>

        <label>Photo URL:
            <input type='text' value={photoUrl} onChange={(e:any) => setPhotoUrl(e.target.value)}/>
        </label><br/>

        <button type='submit'>Submit</button>
        </form>
    </>
  )
}

export default UserRegistration