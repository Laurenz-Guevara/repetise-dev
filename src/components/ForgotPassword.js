import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <div>
      <section className="login-container">
        <div className="form block">
          <form onSubmit={handleSubmit} >
            <h2 className="form-title">Reset Password</h2>
            {error && <h1>An error resetting password</h1>}
            <div className="form-wrapper">
              <div className="form-container">
                <label htmlFor="email"><b>Email:</b></label>
                <input className="input-form" type="text" ref={emailRef} placeholder="Enter Email" name="email" required></input>
              </div>
              <div className="form-secondary">
                <button className="button button-lg" disabled={loading} type="submit">Reset Password</button>
                <div className="already-signed-up">
                  <h2>Access your account and <Link to="/login" className="login-link-text">Login</Link></h2>
                </div>
              </div>
            </div>
          </form>
        </div> 
      </section>
    </div>

  )
}
