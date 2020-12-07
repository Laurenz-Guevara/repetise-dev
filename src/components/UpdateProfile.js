import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function UpdateProfile() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        {error && <h1>{error}</h1>}
        <label htmlFor="email"><b>Email</b></label>
        <input type="text" ref={emailRef} placeholder="Enter Email" name="email" required defaultValue={currentUser.email}></input>

        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" ref={passwordRef} name="psw" placeholder="Leave blank to keep the same"></input>
        
        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" ref={passwordConfirmRef} placeholder="Enter Password again" name="psw"  placeholder="Leave blank to keep the same"></input>
        <button disabled={loading} type="submit">Sign Up</button>
      </form>
      <div className="already-signed-up">
        <h2>Already have an account? <Link to="/login">Login</Link></h2>
      </div>
    </section>
  )
}
