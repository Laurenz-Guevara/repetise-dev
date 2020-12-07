import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
      console.log('Something')
    } catch {
      setError('Failed to login')
    }

    setLoading(false)
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <h1>An error logging in</h1>}
        <label htmlFor="email"><b>Email</b></label>
        <input type="text" ref={emailRef} placeholder="Enter Email" name="email" required></input>

        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" ref={passwordRef} placeholder="Enter Password" name="psw" required></input>
        <button disabled={loading} type="submit">Login</button>
      </form>
      <div>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <div className="already-signed-up">
        <h2>Already have an account? <Link to="/signup">Sign Up</Link></h2>
      </div>
    </section>
  )
}
