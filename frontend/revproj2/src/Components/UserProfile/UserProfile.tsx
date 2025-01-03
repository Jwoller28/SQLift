import React, { useEffect, useState } from 'react'

function UserProfile() {

    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        const sessionTok = localStorage.getItem("token")
        if(sessionTok)
            setToken(JSON.parse(sessionTok))
    }, []);

    useEffect(() => {
        const checkToken = async () =>{
            const tokenResponse = await fetch("http://localhost:8080/me", {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if(tokenResponse.ok)
            {
                const tokenData = await tokenResponse.text();
                setUsername(tokenData);
            }
            else
                alert("TOKEN INVALID!!!");
        }
        checkToken();
    }, [token]);


    useEffect(() => {
        if (!username || !token) return;
    
        const getUserInfo = async () => {
          try {
            const userInfoResponse = await fetch(
              `http://localhost:8080/username/${username}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!userInfoResponse.ok) {
              alert(
                `Something went wrong getting user id ERROR CODE: ${userInfoResponse.status}`
              );
            } else {
              const userInfoData = await userInfoResponse.json();
              setFirstName(userInfoData.first_name);
              setLastName(userInfoData.last_name);
              setEmail(userInfoData.email);
            }
          } catch (err) {
            console.error('Error getting userInfo:', err);
          }
        };
        getUserInfo();
      }, [username, token]);

      function updateProfile(){
        setToggle(!toggle);
      }



  return (
    <>
        {
            !toggle && (<div>
                <label>Username: {username}</label><br/>
                <label>First Name: {firstName}</label><br/>
                <label>Last Name: {lastName}</label><br/>
                <label>Email: {email}</label><br/>
                <button onClick={updateProfile}>Update Profile</button>
            </div>)
        }
        {
            toggle && (<div>
                <label>Edit Username: {username}</label><br/>

                <label>Edit First Name: {firstName}</label><br/>

                <label>Edit Last Name: {lastName}</label><br/>

                <label>Edit Email: {email}</label><br/>
                
                <button onClick={updateProfile}>Finish Profile</button>
            </div>)
        }
        
    </>
  )
}

export default UserProfile