import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import API_URL from "../components/API_URL";
import { AuthContext } from "./context";
import { useNavigate } from "react-router-dom";
const client = axios.create({
  baseURL: API_URL,
});

export default function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = React.useContext(AuthContext);
  const navigate = useNavigate();
  async function onSubmit() {
    const loginData = {
      email: email,
      password: password,
    };
    let response = await client.post("/login", loginData).then(
      (response) => {
        console.log("login sucessfully");
        return response.data;
      },
      (response) => {
        console.log("login not sucessfully");
        return response.response.data;
      }
    );

    if (response.status == true) {
      const token = response.token;
      const userData = response.message;
      await signIn(token, userData);
      navigate("/home");
    } else {
      setError(
        <Alert key="danger" variant="danger">
          Email or passowrd is incorrect
        </Alert>
      );
    }
  }

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
        <div className="d-flex justify-content-center ">
        <img className="h-auto w-25" src="logo.png" alt="Workflow" />
        </div>
          <form>
            <h3>Log In</h3>
            {error}
            <div className="mb-3">
              <label>Email address</label>
              <input
                 type="email"
                 className="form-control"
                 placeholder="Enter email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
            </div>
            <div className="d-grid mt-4">
              <Button
                varient="primary"
                onClick={() => {
                  onSubmit();
                }}
              >
                Login
              </Button>
            </div>
            <p className="forgot-password text-center">
              <a href="/sign-up">Create New Account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
