import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { Alarm, ListTask, BookmarkFill } from "react-bootstrap-icons";
import { Radio } from "antd";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../components/API_URL";

const client = axios.create({
  baseURL: API_URL,
});



function Report() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const demoTasks = [
    "Check Frontend Code",
    "Check Backend Code",
    "Check Database",
    "Check API",
    "Check UI",
    "Check UX",
  ];

  const [tasksModalShow, setTaskModalShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [totalTasks, setTotalTasks] = useState(0);

  const singleProjectButtonHandler = (projectId) => {
    // load all tasks using project ID
    
    // console.log(getTasks(projectId));
    let [projectCopy, tasksCopy] = getTasks(projectId)
    setTasks(...tasksCopy);
    setProjectName(projectCopy.project_name);
    setProjectId(projectCopy.project_code);
    setTotalTasks(projectCopy.taskgenerated);
    console.log("Tasks: ", tasksCopy)
    setTaskModalShow(true);
  };

  let getProjects=async()=>{
    let response = await client.get("http://192.168.0.105:1234/getprojectreport?admin_id=1").then(
      (response) => {
        console.log("get tasks sucessfully");
        return response.data;
      },
      (response) => {
        console.log("get tasks not sucessfully");
        return response.response.data;
      }
    );
    if (response.status == true) {
  
        setProjects(response.message)
        
    } else {
      console.log("error getting tasks")
    }
  }

  let findNumberOfTasks=(projectId)=>{
  let numberOfTasks=0
  for(let i=0;i<projects.length;i++){
    if(projects[i].project_code==projectId){
      numberOfTasks=projects[i].taskgenerated
      break
    }
  }
  return numberOfTasks
  }


  let getTasks=(projectCode)=>{
    
    let newTasks=[]
    let project=null
    for(let i=0;i<projects.length;i++){
      if(projects[i].project_code==projectCode){
        project=projects[i]
        for(let j=0;j<projects[i].tasks.length;j++){
          newTasks.push(projects[i].tasks[j])
        }
        break
      }
    }
    return [project, newTasks]
  }

  function getHours(time) {
    if (time == 0) {
      return 0;
    } else {
      let hours = time.split(":")[0];
      return Number(hours);
    }
  }


  let getTotalHours=(projectId)=>{
    
    let totalHours=0
    // for(let i=0;i<projects.length;i++){
    //   if(projects[i].project_code==projectId){
    //     for(let j=0;j<projects[i].tasks.length;j++){
    //       totalHours+=getHours(projects[i].tasks[j].time)
    //     }
    //     break
    //   }
    // }
    return totalHours
  }


  useEffect( () => {
     getProjects();
    
  }, []);

  return (
    <div>
      <Container>
        <Row className="mt-4">
          {projects.map((project) => (
            <Col lg={3}>
              <Card
                className="mb-4 rounded-0 shadow"
                role="button"
                onClick={() => {
                  singleProjectButtonHandler(project.project_code);
                }}
              >
                <Card.Body>
                  <Card.Title><Badge bg="secondary">{project.project_code}</Badge></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{project.project_name}</Card.Subtitle>
                  <p>
                    <span>
                      <Alarm />
                    </span>{" "}
                    Total Hours Spent
                  </p>
                  <ProgressBar animated now={100} label={`${getTotalHours(project.project_code)} Hrs`} />

                  <p className="mt-4">
                    <span>
                      <ListTask />
                    </span>{" "}
                    Total Tasks Created
                  </p>
                  <ProgressBar
                    variant="success"
                    animated
                    now={100}
                    label={`${findNumberOfTasks(project.project_code)} Tasks`}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal
          show={tasksModalShow}
          onHide={() => setTaskModalShow(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Project Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h3 className="text-center">
                {projectName} <Badge bg="secondary">{projectId}</Badge>{" "}
                <Badge bg="success">{totalTasks} Tasks</Badge>
              </h3>
            </div>
            <div className="mt-4 p-1">
              {(tasks.length == 0)?<h3 className="text-center"><Badge bg="secondary">No Tasks Created Yet</Badge></h3>:
              (tasks.map((task, i) => (
                <Row className="border border-dark mb-3 p-1 align-items-center">
                  <Col md={8} sm={12}>
                    <Row className="p-4" onClick={() => {}}>
                      <Col className="" md={2}>
                        {<BookmarkFill color="green" />} {task.project_code}-{i + 1}
                      </Col>
                      <Col md={10} className="">
                        {task.name}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4} sm={12}>
                    <Row className="align-items-center">
                      <Col className="" md={4}>
                        <Badge pill bg="success">
                          {task.nature}
                        </Badge>
                      </Col>
                      <Col className="p-2" md={4}>
                        <img
                          src="https://cad.gov.jm/wp-content/uploads/2017/10/img_avatar2.png"
                          alt="Avatar"
                          data-toggle="tooltip"
                          data-placement="top"
                          data-bs-html="true"
                          title="Hello, this is a tooltip"
                          role="button"
                          style={{
                            verticalAlign: "middle",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            marginLeft: "10px",
                          }}
                        />
                      </Col>
                      <Col className="p-2" md={4}>
                        <p>
                          <span>
                            <Alarm />
                          </span>{" "}
                          Time Logged
                        </p>
                        <ProgressBar animated now={100} label={`${getHours(task.time)} Hrs`} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setTaskModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Report;