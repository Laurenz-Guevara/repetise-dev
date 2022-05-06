import React from 'react'
import { Link, useHistory } from 'react-router-dom'

export default function NotFound() {
    const history = useHistory()
  return (
    <div>
    <section className="login-container">
      <form>
        <div className="form block">
            <h2 className="form-title">Sorry this page does not exist.</h2>
            <div className="form-wrapper">
              <div className="form-secondary">
                <Link onClick={history.push("/home")} className="button contact-button">Return</Link>
              </div>
            </div>
        </div>
      </form>
    </section>
  </div>
  )
}
