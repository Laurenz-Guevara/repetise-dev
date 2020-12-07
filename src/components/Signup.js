import React, {useRef, useState} from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      console.log('Something')
    } catch {
      setError('Failed to create an account')
    }

    setLoading(false)
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <h1>An error creating account</h1>}
        <label htmlFor="email"><b>Email</b></label>
        <input type="text" ref={emailRef} placeholder="Enter Email" name="email" required></input>

        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" ref={passwordRef} placeholder="Enter Password" name="psw" required></input>
        
        <label htmlFor="psw"><b>Password</b></label>
        <input type="password" ref={passwordConfirmRef} placeholder="Enter Password again" name="psw" required></input>
        <button disabled={loading} type="submit">Sign Up</button>
      </form>
      <div className="already-signed-up">
        <h2>Already have an account? Login</h2>
      </div>
    </section>
  )
}
