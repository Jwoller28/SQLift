import React, { FormEvent, useEffect, useState } from 'react'
import './EditProfile.css'

interface EditProfileProps{
    onClose: () => void;
    userId: number
}

function EditProfile({onClose, userId}: EditProfileProps){
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    //console.log("Here is the userId: ", userId);

    useEffect(() => {
            const sessionTok = localStorage.getItem("token")
            if(sessionTok)
                setToken(JSON.parse(sessionTok))
        }, []);

    function handleUpdate(event: FormEvent){
        event.preventDefault();
        const editUserProfile = async () =>{
            const editProfileResponse = await fetch(`http://localhost:8080/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({first_name, last_name, email})
            });

            const editProfileResponseData = await editProfileResponse.status;
            console.log("here is the editProfileResponseData: ", editProfileResponseData);
        }
        editUserProfile();
        onClose();
    }
  return (
    <div className="modal">
        <div className='modal-content'>
            
            <form onSubmit={handleUpdate}>
                <label>First Name:
                    <input type='text' value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
                </label><br/>

                <label>Last Name:
                    <input type='text' value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
                </label><br/>

                <label>Email:
                    <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </label><br/>

                <button type='submit'>Close</button>
            </form>
            

        </div>
    </div>
  )
}

export default EditProfile