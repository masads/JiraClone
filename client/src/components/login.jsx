import React, { useState } from 'react'
import {Form,Button} from 'react-bootstrap'
import axios from "axios";
import API_URL from "../components/API_URL";

const client = axios.create({
  baseURL: API_URL,
});

export default function Login(){
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    async function onSubmit(){

        const loginData={
          "email":email,
          "password":password,
        }
        let userData=await client
        .post("/login", loginData)
        .then(
          (response) => {
            console.log("login sucessfully");
            return response.data
          },
          (response) => {
            console.log("login not sucessfully");
            return response.data
          }
        );
        console.log(userData)
  }

    return (
      <Form>
        <h3>Log In</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e)=>{setEmail(e.target.value)}}
            value={email}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e)=>{setPassword(e.target.value)}}
            value={password}
          />
        </div>
        <div className="d-grid mt-4">
          <Button varient="primary" onClick={()=>{onSubmit()}} >
            Sign Up
          </Button>
        </div>
        <p className="forgot-password text-center">
          <a href="/sign-up">Create New Account</a>
        </p>
      </Form>
    )
}