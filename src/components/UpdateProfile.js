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
    <div>
      <section className="login-container">
        <div className="form block">
          <form onSubmit={handleSubmit}>
            <h2 className="form-title">Set New Password</h2>
            {error && <h1>{error}</h1>}
            <div className="form-wrapper">
              <div className="form-container">
                <label htmlFor="email"><b>Email</b></label>
                <input className="input-form" type="text" ref={emailRef} placeholder="Enter Email" name="email" required defaultValue={currentUser.email}></input>
              </div>
              <div className="form-container">
                <label htmlFor="psw"><b>Password</b></label>
                <input className="input-form" type="password" ref={passwordRef} name="psw" placeholder="Leave blank to keep the same"></input>
              </div>
              <div className="form-container">
                <label htmlFor="psw"><b>Password</b></label>
                <input className="input-form" type="password" ref={passwordConfirmRef} name="psw"  placeholder="Leave blank to keep the same"></input>
              </div>
              <div className="form-secondary">
                <button className="button" disabled={loading} type="submit">Update</button>
                <div className="already-signed-up">
                  <h2>Don't want to update? <Link to="/" className="login-link-text">Return</Link></h2>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
