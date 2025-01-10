import React, { LegacyRef, MutableRefObject, RefObject } from 'react'
import { FormEventHandler } from 'react'
import { MouseEventHandler } from 'react'

interface PostFeedProp {
    setMessage : Function,
    setTags: Function,
    onSubmit: FormEventHandler<HTMLFormElement>,
    setFile : Function,
    formRef : MutableRefObject<HTMLFormElement | null>
}
function PostFeedDumb(prop : PostFeedProp) {
  return (
    <div>
        <form  encType="multipart/form-data" id = "inputForm" name = "inputForm" onSubmit={prop.onSubmit} ref={prop.formRef}>

            <label htmlFor="message_text">Message</label> <br/>
            <input type="text" name="message_text" onChange = {(e) => prop.setMessage(e.target.value)} required></input> <br/>

            <label htmlFor="message_tags">Tags</label> <br/>
            <input type="text" name="message_tags" onChange = {(e) => prop.setTags(e.target.value)} required></input> <br/>

            <label htmlFor="photo">PNG Images Only</label> <br/>

            <input type="file" name="photo" accept='.png' onChange = {(e) => prop.setFile(e.target.files ? e.target.files[0] : undefined)}></input> <br/>

            <button type="submit" id = "submitButton" name = "submitButton">Post to Feed</button>
            </form>
    </div>
  )
}

export default PostFeedDumb
