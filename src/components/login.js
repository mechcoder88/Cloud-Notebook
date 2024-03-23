import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Login = (props) => {
  const host = "http://localhost:5000"

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })

    });
    const json = await response.json();
    
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem('token', json.authToken);
      props.showAlert("Logged In Successfully WELCOME !!", "success")
      navigate("/")

    }
    else {
      props.showAlert("Invalid Credentials !!", "danger")

    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }


  return (
    <div>
      <h2>Login to continue to Cloud Notebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" autoComplete='new-email' name='email' id="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type={showPassword ? "text" : "password"} onChange={onChange} value={credentials.password} autoComplete='new-password' className="form-control" name='password' id="password" />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" name='showPassword' id="showPassword" onChange={handleTogglePassword} />
          <label className="form-check-label" htmlFor="showPassword">Show Password</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login
