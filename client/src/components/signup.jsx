import React, { useState } from 'react'
import {Form,Button} from 'react-bootstrap'
import axios from "axios";
import API_URL from "../components/API_URL";

const client = axios.create({
  baseURL: API_URL,
});

export default function SignUp(){
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [profileImage, setprofileImage] = useState('https://i.postimg.cc/MZhNyBCZ/vecteezy-picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg');
  const [profileImageData, setprofileImageData] = useState(null);
  const onChangePicture = (e) => {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setprofileImage(reader.result); 
          setprofileImageData(e.target.files[0])
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      
    };
    async function onSubmit(){


        const imageData = new FormData();
        imageData.append("image",profileImageData)
        let filename=await client
          .post("/images", imageData)
          .then(
            (response) => {
              console.log("image add sucessfully");
              return response.data.filename
            },
            (response) => {
              console.log("image add not sucessfully");
              return "notfound.png"
            }
          );
          console.log(filename)
          const uerData={
            "firstname":firstName,
            "lastname":lastName,
            "email":email,
            "password":password,
            "profile_picture_url":filename
          }
          client
          .post("/signup", uerData)
          .then(
            (response) => {
              console.log("image add sucessfully");
              console.log(response["request"]["_response"]);
            },
            (response) => {
              console.log("image add not sucessfully");
              console.log(response["request"]["_response"]);
            }
          );
    }
    return (
      <form>
        <h3>Sign Up</h3>
        <div className='d-flex flex-column align-items-center ' >
        
            <div className='d-flex flex-column align-items-center  w-75 h-auto'>
            <img
              className="rounded-circle img-fluid"
              src={profileImage}
              alt=""
            />
            </div>
            {(profileImage != 'https://i.postimg.cc/MZhNyBCZ/vecteezy-picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg') 
            ? 
            (<Button variant="outline-danger" className='mt-2 mb-2' onClick={() => setprofileImage('https://i.postimg.cc/MZhNyBCZ/vecteezy-picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg')}>Remove</Button>) 
            : 
            (<div className='d-flex flex-column align-items-center'>
              {/* <input id="file-upload" style={{color:"blue",}} name="file-upload" type="file" accept='.png,.jpg' className="sr-only" onChange={(e) => { onChangePicture(e, 1) }} /> */}
              <Form.Group controlId="file-uplpad" className="d-flex flex-column align-items-center mb-3">
                <Form.Label>Upload Picture</Form.Label>
                <Form.Control type="file"  name="image" onChange={(e) => { onChangePicture(e) }} />
              </Form.Group>
            </div>
            )}

  
        </div>
        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={(e)=>{setFirstName(e.target.value)}}
            value={firstName}
          />
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input type="text" className="form-control" 
          onChange={(e)=>{setLastName(e.target.value)}}
          value={lastName}
          placeholder="Last name" />
        </div>
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
        <div className="d-grid">
          <Button varient="primary" onClick={()=>{onSubmit()}} >
            Sign Up
          </Button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/log-in">sign in?</a>
        </p>
      </form>
    )
  
}