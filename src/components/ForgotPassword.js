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
    <section>
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {error && <h1>{error}</h1>}
        {message && <h1>{message}</h1>}
        <label htmlFor="email"><b>Email</b></label>
        <input type="text" ref={emailRef} placeholder="Enter Email" name="email" required></input>

        
        <button disabled={loading} type="submit">Reset Password</button>
      </form>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div className="already-signed-up">
        <h2>Already have an account? <Link to="/signup">Sign Up</Link></h2>
      </div>
    </section>
  )
}
