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
  const [projects, setProjects] = useState([...numbers]);
  const [tasks, setTasks] = useState([...demoTasks]);

  const [projectName, setProjectName] = useState("Demo Project");
  const [projectId, setProjectId] = useState("PA-12345");
  const [totalTasks, setTotalTasks] = useState(10);

  const singleProjectButtonHandler = (projectId) => {
    // load all tasks using project ID
    setTaskModalShow(true);
  };
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
                  singleProjectButtonHandler(project);
                }}
              >
                <Card.Body>
                  <Card.Title>PA-{project}</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </Card.Text>
                  <p>
                    <span>
                      <Alarm />
                    </span>{" "}
                    Total Hours Spent
                  </p>
                  <ProgressBar animated now={100} label="2 Hrs" />

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
                    label="40 Tasks"
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
              {tasks.map((task, i) => (
                <Row className="border border-dark mb-3 p-1 align-items-center">
                  <Col md={8} sm={12}>
                    <Row className="p-4" onClick={() => {}}>
                      <Col className="" md={2}>
                        {<BookmarkFill color="green" />} TA-{i + 1}
                      </Col>
                      <Col md={10} className="">
                        {task}
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4} sm={12}>
                    <Row className="align-items-center">
                      <Col className="" md={4}>
                        <Badge pill bg="success">
                          In Progress
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
                        <ProgressBar animated now={100} label="2 Hrs" />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
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
