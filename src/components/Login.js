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
      history.push("/home")
    } catch(e) {
      console.log(e.code)
      
        if (e.code == "auth/wrong-password") {
          setError('Incorrect password')
        } 
        
        else if (e.code == "auth/too-many-requests") {
          setError('Access has been temporaily restricted (Too many attemps)')
        } 
        else {
          setError('This account does not exist')
        }
    }
    setLoading(false)
  }

  return (
    <div>
      <section className="login-container">
        <div className="form block">
          <form onSubmit={handleSubmit} >
            <h2 className="form-title">Login</h2>
            {error && <h1>{error}</h1>}
            <div className="form-wrapper">
              <div className="form-container">
                <label htmlFor="email"><b>Email:</b></label>
                <input className="input-form" type="text" ref={emailRef} placeholder="Enter Email" name="email" required></input>
              </div>
              <div className="form-container">
                <label htmlFor="psw"><b>Password:</b></label>
                <input className="input-form" type="password" ref={passwordRef} placeholder="Enter Password" name="psw" required></input>
              </div>
            </div>
            <div className="form-secondary">
              <button className="button" disabled={loading} type="submit">Login</button>
              <div className="forgot-pass">
                <Link to="/forgot-password" className="login-link-text-password">Forgot Password?</Link>
              </div>
              <div className="already-signed-up">
                <h2>Don't have an account? <Link to="/signup" className="login-link-text">Sign Up</Link></h2>
              </div>
            </div>
          </form>
        </div> 
      </section>        
    </div>
    
  )
}
