import React from 'react'
import { FormEventHandler } from 'react'
import { MouseEventHandler } from 'react'

interface PostFeedProp {
    setGoalId : Function,
    setUser : Function,
    setMessage : Function,
    onSubmit: FormEventHandler<HTMLFormElement>,
    formRef : any
}
function PostFeedDumb(prop : PostFeedProp) {
  return (
    <div>
        <form ref = {prop.formRef} encType="multipart/form-data" id = "inputForm" name = "inputForm" onSubmit={prop.onSubmit}>
            <label htmlFor="goal_id">Goal_Id</label> <br/>
            <input type="number" name="goal_id" onChange = {(e) => prop.setGoalId(e.target.value)} required></input> <br/>

            <label htmlFor="sent_by">User ID</label> <br/>
            <input type="number" name="sent_by" onChange = {(e) => prop.setUser(e.target.value)} required></input> <br/>

            <label htmlFor="message_text">Message</label> <br/>
            <input type="text" name="message_text" onChange = {(e) => prop.setMessage(e.target.value)} required></input> <br/>

            <label htmlFor="img_url">IMG</label> <br/>
            <input type="file" name="img_url" accept='image/*' required></input> <br/>

            <button type="submit" id = "submitButton" name = "submitButton">Submit Post</button>
            </form>
    </div>
  )
}

export default PostFeedDumb