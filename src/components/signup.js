import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const host = "http://localhost:5000";

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    if (credentials.password !== credentials.cpassword) {
      props.showAlert("Passwords do not match", "danger");
    }
    else {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        // Save the auth token and redirect
        localStorage.setItem("token", json.authToken);
        navigate("/");
        props.showAlert(`Welcome ${name} Account Created Successfully !! `, "success");
      } else {
        props.showAlert("Account Already Exists ERROR!", "danger");
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    if (credentials.password !== credentials.cpassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div>
      <h2>Sign Up to Cloud Notebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            autoComplete="new-name"
            name="name"
            id="name"
            value={credentials.name}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            autoComplete="new-email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            onChange={onChange}
            value={credentials.password}
            autoComplete="new-password"
            className="form-control"
            name="password"
            id="password"
            required
            minLength={8}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            onChange={onChange}
            value={credentials.cpassword}
            onBlur={validatePassword} // add onBlur event handler here
            autoComplete="new-cpassword"
            className="form-control"
            name="cpassword"
            id="cpassword"
            required
            minLength={8}
          />
          {passwordError && (
            <div className="text-danger">{passwordError}</div>
          )}

        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="showPassword"
            id="showPassword"
            onChange={handleTogglePassword}
          />
          <label className="form-check-label" htmlFor="showPassword">
            Show Password
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
