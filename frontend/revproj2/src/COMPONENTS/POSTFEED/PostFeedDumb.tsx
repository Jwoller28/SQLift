import React, { RefObject } from 'react'
import { FormEventHandler } from 'react'
import { MouseEventHandler } from 'react'

interface PostFeedProp {
    setGoalId : Function,
    setUser : Function,
    setMessage : Function,
    onSubmit: FormEventHandler<HTMLFormElement>,
    setFile : Function
}
function PostFeedDumb(prop : PostFeedProp) {
  return (
    <div>
        <form  encType="multipart/form-data" id = "inputForm" name = "inputForm" onSubmit={prop.onSubmit}>
            <label htmlFor="goal_id">Goal_Id</label> <br/>
            <input type="number" name="goal_id" onChange = {(e) => prop.setGoalId(e.target.value)} required></input> <br/>

            <label htmlFor="user_id">User ID</label> <br/>
            <input type="number" name="user_id" onChange = {(e) => prop.setUser(e.target.value)} required></input> <br/>

            <label htmlFor="message_text">Message</label> <br/>
            <input type="text" name="message_text" onChange = {(e) => prop.setMessage(e.target.value)} required></input> <br/>

            <label htmlFor="photo">IMG</label> <br/>
            <input type="file" required name="photo" accept='image/*' onChange = {(e) => prop.setFile(e.target.files ? e.target.files[0] : undefined)}></input> <br/>

            <button type="submit" id = "submitButton" name = "submitButton">Submit Post</button>
            </form>
    </div>
  )
}

export default PostFeedDumb