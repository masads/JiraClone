import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import moment from "moment";
import {
  BookmarkFill,
  PlusSquareFill,
  Search,
  Alarm,
} from "react-bootstrap-icons";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function SingleProject() {
  const demoUsers = [1, 2, 3, 4];
  const demoTasks = [
    "Check Frontend Code",
    "Check Backend Code",
    "Check Database",
    "Check API",
    "Check UI",
    "Check UX",
  ];

  // Tasks
  const [tasks, setTasks] = useState([...demoTasks]);

  // Modals
  const [addPeopleModalShow, setAddPeopleModalShow] = useState(false);
  const [singleTaskModalShow, setSingleTaskModalShow] = useState(false);
  const [taskModalStatus, setTaskModalStatus] = useState("");

  // Add Member Form State
  const [members, setMembers] = useState([...demoUsers]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  //Member Handlers
  const handleNewMemberEmailChange = (e) => {
    setNewMemberEmail(e.target.value);
  };

  const handleAddMember = () => {
    alert("Invite sent to " + newMemberEmail);
    setNewMemberEmail("");
  };

  const handleRemoveMember = (memberId) => {
    alert("Member removed - ID: " + memberId);
  };

  // Task Handlers
  const handleOuterTaskStatusChange = (taskId, updatedStatus) => {
    alert("Task status changed - ID: " + taskId + " to " + updatedStatus);
  };

  function clearFields() {
    setTaskName("");
    setTaskDescription("");
    setTaskType("");
    setTaskAssignedTo("");
    setTaskStatus("");
    setTaskStartDate("");
    setTaskEndDate("");
  }

  // Triggered when [Add new task] button is clicked
  const addNewTaskButtonHandler = () => {
    clearFields();
    setTaskModalStatus("new");
    setSingleTaskModalShow(true);
  };

  //Triggered when a task is clicked
  const editTask = (taskId) => {
    //Send a query to the database to get the task details
    //Set the task details in the form

    setTaskModalStatus("edit");
    setSingleTaskModalShow(true);
  };

  // Triggered when [update] button is clicked inside the task modal
  const updateTask = (taskId) => {
    alert("Updated task - ID: " + taskId);
    //get all the task details from task state variable
    //Send a query to the server to update the task
  };

  // Triggered when [add] button is clicked inside the task modal
  const addTask = () => {
    alert("Added task");
    alert(taskStartDate + "-" + taskEndDate);
    //get all the task details from task state variable
    //Send a query to the server to add the task
    //Clear the form
    clearFields();
  };

  // Task Form States
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("0");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [taskEndDate, setTaskEndDate] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState("0");
  const [taskStatus, setTaskStatus] = useState("0");

  // Task Form Handlers
  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };
  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };
  const handleTaskTypeChange = (event) => {
    alert(event.target.value);
    setTaskType(event.target.value);
  };

  const handleTaskAssignedToChange = (event) => {
    setTaskAssignedTo(event.target.value);
  };
  const handleTaskStatusChange = (event) => {
    setTaskStatus(event.target.value);
  };

  return (
    <div>
      <Container>
        <Row className="mt-4 p-2">
          <Col md={4}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by Task"
                aria-label="Search by Task"
                aria-describedby="Search by Task"
              />
              <InputGroup.Text id="basic-addon2">{<Search />}</InputGroup.Text>
            </InputGroup>
          </Col>
          <Col md={6}>
            <div className="mt-2 mb-2">
              {members.map((user) => (
                <img
                  src="https://cad.gov.jm/wp-content/uploads/2017/10/img_avatar2.png"
                  alt="Avatar"
                  class="avatar"
                  style={{
                    verticalAlign: "middle",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginLeft: "10px",
                  }}
                  role="button"
                  onClick={() => {
                    alert("You clicked on " + user);
                  }}
                />
              ))}
              <img
                src=" https://cdn.iconscout.com/icon/free/png-256/add-plus-3114469-2598247.png"
                alt="Avatar"
                class="avatar"
                style={{
                  verticalAlign: "middle",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginLeft: "10px",
                  border: "1px solid black",
                }}
                role="button"
                onClick={() => {
                  setAddPeopleModalShow(true);
                }}
              />
            </div>
          </Col>
          <Col md={2}>
            <Button
              variant="success"
              className=""
              onClick={() => {
                addNewTaskButtonHandler();
              }}
            >
              <PlusSquareFill />
              <span className="ml-2"> Add New Task</span>
            </Button>
          </Col>
        </Row>
        <div className="mt-4 p-1">
          {tasks.map((task, i) => (
            <Row className="border border-dark mb-3 p-1 align-items-center">
              <Col md={8} sm={12}>
                <Row
                  className="p-4"
                  onClick={() => {
                    editTask(task);
                  }}
                  role="button"
                >
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
                    <Form.Select
                      onChange={(e) => {
                        handleOuterTaskStatusChange(task, e.target.value);
                      }}
                      aria-label="Default select example"
                      size="sm"
                    >
                      <option value="0">Todo</option>
                      <option value="1">In Progress</option>
                      <option value="2">Open</option>
                      <option value="3">Done</option>
                      <option value="4">Closed</option>
                    </Form.Select>
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
        {/* Add User Modal */}
        <Modal
          show={addPeopleModalShow}
          onHide={() => setAddPeopleModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add People
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <FormControl
                value={newMemberEmail}
                onChange={handleNewMemberEmailChange}
                placeholder="Enter Member Email"
                aria-label="Member's Email"
                aria-describedby="basic-addon2"
                autoFocus
              />
              <Button
                variant="outline-success"
                id="button-addon2"
                onClick={() => {
                  handleAddMember();
                }}
              >
                Send Invite
              </Button>
            </InputGroup>

            {members.map((user) => (
              <div className="border border-dark p-2 d-flex justify-content-between align-items-center mb-2">
                <div className="alignMiddle">User {user}</div>
                <div className="">
                  <Button
                    variant="danger"
                    className=""
                    onClick={() => {
                      handleRemoveMember(user);
                    }}
                  >
                    X
                  </Button>
                </div>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setAddPeopleModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Single Task Modal */}
        <Modal
          show={singleTaskModalShow}
          onHide={() => {
            setSingleTaskModalShow(false);
          }}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">TA-1</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={taskName}
                  onChange={handleTaskNameChange}
                  type="email"
                  placeholder="eg. Design a navigation bar"
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={taskDescription}
                  onChange={handleTaskDescriptionChange}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={taskType}
                  onChange={handleTaskTypeChange}
                >
                  <option value="0">Select Task Type</option>
                  <option value="1">Issue</option>
                  <option value="2">Bug</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Assigned to:</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={taskAssignedTo}
                  onChange={handleTaskAssignedToChange}
                >
                  <option value="0">Unassigned</option>
                  <option value="1">Asad</option>
                  <option value="2">Uzair</option>
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Status</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={taskStatus}
                  onChange={handleTaskStatusChange}
                >
                  <option value="0">Todo</option>
                  <option value="1">In-Progress</option>
                  <option value="2">Open</option>
                  <option value="3">Done</option>
                  <option value="4">Closed</option>
                </Form.Select>
              </Form.Group>
            </Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Pick Start and End Time</Form.Label>
              <RangePicker
                style={{ width: "100%" }}
                value={[taskStartDate, taskEndDate]}
                format="YYYY-MM-DD"
                popupStyle={{ zIndex: 9999 }}
                onChange={(data, data2) => {
                  setTaskStartDate(data[0]);
                  setTaskEndDate(data[1]);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {taskModalStatus === "edit" ? (
              <Button
                variant="warning"
                onClick={() => {
                  updateTask();
                }}
              >
                Update
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  addTask();
                }}
              >
                Add
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => {
                setSingleTaskModalShow(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default SingleProject;
