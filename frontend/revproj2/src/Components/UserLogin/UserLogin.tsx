

// Creating the typing for the props that are being brought into UserLogin from UserManagement
type UserLoginProps ={
    username: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    handleSubmit:any,
    handleRegister: any
}

// Form that gets displayed on the webpage
function UserLogin({username, setUsername, password, setPassword, handleSubmit, handleRegister}: UserLoginProps) {
  return (
    <form onSubmit={handleSubmit}>
        <label>Username:
            <input type='text' value={username} onChange={(e:any) => setUsername(e.target.value)}/>
        </label><br/>

        <label>Password:
            <input type='password' value={password} onChange={(e:any) => setPassword(e.target.value)}/>
        </label><br/>

        <button type='submit'>Submit</button>
        <button onClick={handleRegister}>Create Account</button>
    </form>
  )
}

export default UserLogin