import React, { useEffect, useState } from 'react'

function UserProfile() {

  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const sessionTok = localStorage.getItem("token")
    if (sessionTok)
      setToken(JSON.parse(sessionTok))
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const tokenResponse = await fetch("http://localhost:8080/me", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.text();
        setUsername(tokenData);
      }
      else
        console.log("TOKEN INVALID!!!");
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
          setUserId(userInfoData.id);
        }
      } catch (err) {
        console.error('Error getting userInfo:', err);
      }
    };
    getUserInfo();
  }, [username, token, showModal]);

  function updateProfile() {
    const editUserProfile = async () => {
      const editProfileResponse = await fetch(`http://localhost:8080/user/${userId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ first_name, last_name, email })
      });

      const editProfileResponseData = await editProfileResponse.status;
      console.log("here is the editProfileResponseData: ", editProfileResponseData);
  }
  editUserProfile();
  }

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }



  return (
    <>
      {
        <div>
          <label>Username: {username}</label><br />
          <label>First Name: {first_name}</label><br />
          <label>Last Name: {last_name}</label><br />
          <label>Email: {email}</label><br />
          <button type="button" className="btn btn-primary" onClick={handleOpenModal}>
            Edit Profile
          </button>
        </div>
      }
      {/* Modal Component */}
      {showModal && (
        <div className="modal fade show" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="false" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Content in Modal */}
                <form>
                    <label>First Name:
                        <input type='text' value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
                    </label><br/>

                    <label>Last Name:
                        <input type='text' value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
                    </label><br/>

                    <label>Email:
                        <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </label><br/>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={updateProfile}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default UserProfile