import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect,useContext } from "react";
import { AuthContext } from "./context";
import axios from "axios";
import API_URL from "../components/API_URL";
import { useNavigate } from "react-router-dom";
import {
  BoxArrowInRight,
  BoxArrowUpRight,
  EyeFill,
  PlusSquare,
  Alarm,
} from "react-bootstrap-icons";
const client = axios.create({
  baseURL: API_URL,
});

function ProjectFeed() {
  const navigate = useNavigate();
  const { userToken,userData } = useContext(AuthContext);
  const [ reload,setReload]=useState(false)
  const [ projectData,setProjectData ]=useState([])

  let getProjects=async()=>{
    let response = await client.get(`/getprojects?userid=${userData.userid}`,).then(
      (response) => {
        console.log("get projects sucessfully");
        return response.data;
      },
      (response) => {
        console.log("get projects not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
        setProjectData(response.message)
        setReload(true)
    } else {
      console.log("error getting projects")
    }
  }

  //For Forms
  function joinProjectButtonHandler() {
    setJoinProjectKey("");
    setProjectJoinModalShow(true);
  }

  function createProjectButtonHandler() {
    setNewProjectName("");
    const key = ID(5);
    setNewProjectKey(key);
    setNewProjectHash(key);
    setProjectCreateModalShow(true);
  }

  async function joinFormButtonHandler() {
    console.log(joinProjectKey)
    const data=
    {
      "project_code":joinProjectKey,
      "user_id":userData.userid
    }
    console.log(data)
    let response = await client.post(`/joinproject`,data).then(
      (response) => {
        console.log("join projects sucessfully");
        return response.data;
      },
      (response) => {
        console.log("join projects not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      setProjectJoinModalShow(false);
      setReload(false)
    } else {
      console.log("error getting projects")
    }
  }

  async function createFormButtonHandler() {
    const data=
    {
      "project_code":newProjectHash,
      "project_name":newProjectName,
      "user_id":userData.userid
    }
    console.log(data)
    let response = await client.post(`/createproject`,data).then(
      (response) => {
        console.log("get projects sucessfully");
        return response.data;
      },
      (response) => {
        console.log("get projects not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      
        setProjectData([...projectData,data])
        setProjectCreateModalShow(false);
    } else {
      console.log("error getting projects")
    }
  }

  //For Modals
  const newProjectNameChangeHandler = (e) => {
    setNewProjectName(e.target.value);
    getNameHash();
  };



  let ID = (length = 6) => {
    // new Date() will return current time
    // getTime() method returns the number of milliseconds* since the Unix Epoch.
    // -length to get last items on string
    return new Date().getTime().toString().slice(-length);
  };

  let getNameHash = () => {
    let str = "";
    if (newProjectName.length > 0) {
      let arr = newProjectName.split(" ");
      for (let i of arr) {
        if(i.length!=0)
        {
        str = str + i[0].toUpperCase();
        }
      }
    } else {
      str = "";
    }
    setNewProjectHash(str + newProjectKey);
  };
  //Modal Visibility States
  const [projectCreateModalShow, setProjectCreateModalShow] = useState(false);
  const [projectJoinModalShow, setProjectJoinModalShow] = useState(false);

  //Create Project Modal States
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectHash, setNewProjectHash] = useState("");
  const [newProjectKey, setNewProjectKey] = useState("");

  //Join Project Modal States
  const [joinProjectKey, setJoinProjectKey] = useState("");

  useEffect(() => {
    getProjects()
  }, [reload]);

  return (
    <div>
      <Container>
        {/* <h1 className="text-center mt-3">Project Feed</h1>s */}
        <Row className="mt-4">
          <Col md={6}>
            <Stack direction="horizontal" gap={3}>
              <Button
                variant="outline-primary"
                onClick={() => {
                  createProjectButtonHandler();
                }}
              >
                <PlusSquare />
                <span className="ml-2"> New Project</span>
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => {
                  joinProjectButtonHandler();
                }}
              >
                <BoxArrowUpRight />
                <span className="ml-2"> Join Project</span>
              </Button>
            </Stack>
          </Col>
          {/* <Col md={6}>
            <Stack direction="horizontal" gap={3}>
              <Button
                variant="outline-primary"
                onClick={() => setModalShow(true)}
              >
                <PlusSquare />
                <span className="ml-2"> New Project</span>
              </Button>
              <Button variant="outline-primary">
                <BoxArrowUpRight />
                <span className="ml-2"> Join Project</span>
              </Button>
            </Stack>
          </Col> */}
        </Row>
        <Row className="mt-4">
          {projectData.map((project) => (
            <Col lg={3}>
              <Card className="mb-4 border border-dark ">
                <Card.Body className="text-center">
                  <Card.Title>{project.project_name.toUpperCase()}</Card.Title>
                  <h6><Badge variant="bg-secondary">{project.project_code}</Badge></h6>
                </Card.Body>
                <Button className="rounded-0" variant="primary" onClick={()=>{navigate(`/projects/${project.project_code}`)}} >
                  {<EyeFill />} View Project
                </Button>
              </Card>
            </Col>
          ))}

          {/* Card having a plus button in the center */}
        </Row>

        {/* New Project Model */}
        <Modal
          show={projectCreateModalShow}
          onHide={() => setProjectCreateModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Project Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="eg. Task Managment App"
                  autoFocus
                  value={newProjectName}
                  onChange={newProjectNameChangeHandler}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control disabled value={newProjectHash} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                createFormButtonHandler();
              }}
            >
              Create
            </Button>
            <Button onClick={() => setProjectCreateModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Join Project Model */}
        <Modal
          show={projectJoinModalShow}
          onHide={() => setProjectJoinModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Project Key
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Key</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Project Key"
                  autoFocus
                  value={joinProjectKey}
                  onChange={(e)=>{setJoinProjectKey(e.target.value)}}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                joinFormButtonHandler();
              }}
            >
              Join
            </Button>
            <Button onClick={() => setProjectJoinModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ProjectFeed;