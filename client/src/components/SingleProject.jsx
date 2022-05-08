import Container from "react-bootstrap/Container";
import {Row,Col,Alert} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import API_URL from "../components/API_URL";
import { useState, useContext } from "react";
import { AuthContext } from "./context";
import { useNavigate,useParams } from "react-router-dom";
import {
  BookmarkFill,
  PlusSquareFill,
  BugFill,
  Search,
  Alarm,
} from "react-bootstrap-icons";
import { DatePicker, Space } from "antd";
import { useEffect } from "react";
import "antd/dist/antd.css";
import moment from "moment";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const client = axios.create({
  baseURL: API_URL,
});

function SingleProject() {
  const { projectid } = useParams();
  const [reload,setReload]=useState(false)
  const { userToken,userData } = useContext(AuthContext);
  console.log(projectid)
  console.log("use data",userData)
  // Add Member Form State
  const [members, setMembers] = useState([]);
  const [newStatus,setNewStatus]=useState({})
  const [newMemberEmail, setNewMemberEmail] = useState("");
  // const demoTasks = [
  //   "Check Frontend Code",
  //   "Check Backend Code",
  //   "Check Database",
  //   "Check API",
  //   "Check UI",
  //   "Check UX",
  // ];
    // Tasks
  const [tasks, setTasks] = useState([]);
  let getTasks=async()=>{
    let response = await client.get(`/gettasks?code=${projectid}`,).then(
      (response) => {
        console.log("get tasks sucessfully");
        return response.data;
      },
      (response) => {
        console.log("get tasks not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {

        setTasks(response.message)
        setReload(true)
        // setProjectData(response.message)
        // setReload(true)
    } else {
      console.log("error getting tasks")
    }
  }
  let getMembers=async()=>{
    let response = await client.get(`/getmembers?code=${projectid}`,).then(
      (response) => {
        console.log("get tasks sucessfully");
        return response.data;
      },
      (response) => {
        console.log("get tasks not sucessfully");
        return response.response.data;
      }
    );
    console.log("a",response)
    if (response.status == true) {
        setMembers([...response.message])
    } else {
      console.log("error getting tasks")
    }
  }
  let sendMail=async()=>{
    let response = await client.post("/addmember",{
      "admin_id":userData.userid,
      "project_code":projectid,
      "user_email":newMemberEmail
    }).then(
      (response) => {
        console.log("get tasks sucessfully");
        return response.data;
      },
      (response) => {
        console.log("get tasks not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      return true
    } else {
      return false
    }
  }
  let removeMember=async(user_id)=>{
    console.log(user_id,projectid)
    let response = await client.post("/removemember",{
      "admin_id":userData.userid,
      "project_code":projectid,
      "user_id":user_id
    }).then(
      (response) => {
        console.log("member removeed sucessfully");
        return response.data;
      },
      (response) => {
        console.log("member removeed not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      return true
    } else {
      return false
    }
  }

  let addTaskData=async(nature,name,description,start_date,end_date)=>{
    console.log(projectid)
    let response = await client.post("/createtask",{
      "user_id":userData.userid,
      "project_code":projectid,
      "nature":nature,
      "name":name,
      "description":description,
      "start_date":start_date,
      "end_date":end_date
    }).then(
      (response) => {
        console.log("add task sucessfully");
        return response.data;
      },
      (response) => {
        console.log("add task not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      return true
    } else {
      return false
    }
  }
  let updateTasks=async(assigned_id,nature,name,newName,description,start_date,end_date)=>{
    let response = await client.post("/updatetask",{
      "admin_id":userData.userid,
      "user_id":assigned_id,
      "project_code":projectid,
      "nature":(nature==1)?("task"):("bug"),
      "newName":newName,
      "name":name,
      "description":description,
      "start_date":start_date,
      "end_date":end_date
    }).then(
      (response) => {
        console.log("add task sucessfully");
        return response.data;
      },
      (response) => {
        console.log("add task not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      return true
    } else {
      return false
    }
  }
  let updateStatus=async(status,newStatus,task_id)=>{
    console.log(isWhichStatus(status),newStatus,taskId)
    let response = await client.post("/updatetask",{
      "user_id":userData.userid,
      "status":isWhichStatus(status),
      "newstatus":newStatus,
      "task_id":task_id,
      "project_code":projectid
    }).then(
      (response) => {
        console.log("add task sucessfully");
        return response.data;
      },
      (response) => {
        console.log("add task not sucessfully");
        return response.response.data;
      }
    );
    console.log(response)
    if (response.status == true) {
      return true
    } else {
      return false
    }
  }
  // Modals
  const [addPeopleModalShow, setAddPeopleModalShow] = useState(false);
  const [singleTaskModalShow, setSingleTaskModalShow] = useState(false);
  const [taskModalStatus, setTaskModalStatus] = useState("");

  

  //Member Handlers
  const handleNewMemberEmailChange = (e) => {
    setNewMemberEmail(e.target.value);
  };
  const [error, setError] = useState("");
  const handleAddMember = async () => {
    let status=await sendMail()
    if(status)
    {
      setAddPeopleModalShow(false)
      setNewMemberEmail("");
    }else
    {
      setError(
        <Alert key="danger" variant="danger">
          User with this email not exisit
        </Alert>
      );
      setNewMemberEmail("");
    }
  };
  
  const handleRemoveMember =async (member) => {
    let status=await removeMember(member.user_id)
    if(status)
    {
      let user=[]
      for(let key of members)
      {
        if(key.user_id!=member.user_id)
        {
          user.push(key)
        }
        console.log(user)
        setMembers(user)
      }
    }else
    {
      setError(
        <Alert key="danger" variant="danger">
          Error
        </Alert>
      );
    }
  };
  
  // Task Handlers
  const handleOuterTaskStatusChange =async (taskId, value) => {
    setNewStatus({})
    alert(value)
    let status=false
    // let status=await updateStatus(newStatus,isWhichStatus(value),taskId)
    if(status)
    {
      setNewStatus(value)
    }else
    {
      console.log("error in updating status")
      setNewStatus(value)
    }
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
  
  function whichStatus(status)
  {
    console.log(status)
    if(status=='Todo')
    {
      return "0"
    }else if(status=='InProgress')
    {
      return "1"
    }else if(status=='Open')
    {
      return "2"
    }else if(status=='Done')
    {
      return "3"
    }else if(status=='Closed')
    {
      return "4"
    }
  }
  function isWhichStatus(status)
  {
    console.log(status)
    if(status=='0')
    {
      return "Todo"
    }else if(status=='1')
    {
      return "InProgress"
    }else if(status=='2')
    {
      return "Open"
    }else if(status=='3')
    {
      return "Done"
    }else if(status=='4')
    {
      return "Closed"
    }
  }
  // Triggered when [Add new task] button is clicked
  const addNewTaskButtonHandler = () => {
    clearFields();
    setTaskModalStatus("new");
    setSingleTaskModalShow(true);
  };

  //Triggered when a task is clicked
  const editTask = (task) => {
    //Send a query to the database to get the task details
    setTaskId(task.task_id)
    setTaskType((task.nature=='bug')?(2):(1))
    setTaskStatus(whichStatus(task.status.status))
    setTaskName(task.name)
    setTaskPrevName(task.name)
    setTaskDescription(task.description)
    setTaskStartDate( moment(task.start_date, dateFormat))
    setTaskEndDate(moment(task.end_date,dateFormat))
    setTaskAssignedTo((task.assigned_user_id==null)?(0):(task.assigned_user_id.user_id))
    console.log(task)
    setTaskModalStatus("edit");
    setSingleTaskModalShow(true);
  };

  // Triggered when [update] button is clicked inside the task modal
  const updateTask =async () => {
    let status=await updateTasks(taskAssignedTo,taskType,taskPrevName,taskName,taskDescription,taskStartDate,taskEndDate)

    if(status)
    {
      setReload(false)
      setSingleTaskModalShow(false);
      clearFields();
      setError("")
    }else
    {
      setError(
        <Alert key="danger" variant="danger">
          Enter Detials Correctly
        </Alert>
      );
    }

  };

  // Triggered when [add] button is clicked inside the task modal
  const addTask =async () => {
    let status=await addTaskData(taskType,taskName,taskDescription,taskStartDate,taskEndDate)

    if(status)
    {
      setReload(false)
      setSingleTaskModalShow(false);
      clearFields();
      setError("")
    }else
    {
      setError(
        <Alert key="danger" variant="danger">
          Enter Detials Correctly
        </Alert>
      );
    }
  };

  // Task Form States
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskPrevName, setTaskPrevName] = useState("");
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
  
    setTaskType(event.target.value);
  };

  const handleTaskAssignedToChange = (event) => {
    setTaskAssignedTo(event.target.value);
  };
  const handleTaskStatusChange =async (event) => {
    let status=await updateStatus(taskStatus,isWhichStatus(event.target.value),taskId)
    if(status)
    {
      setTaskStatus(event.target.value);
    }else
    {
      console.log("error in updating status")

    }
  };
  useEffect(()=>{
    getTasks()
    getMembers()
    setReload(true)
  },[reload])
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
                src={`http://192.168.1.6:8080/images?path=${user.profile_picture_url}`}
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
                    {(task.nature=='task')?(<BookmarkFill color="green" />):(<BugFill color="red" />)} TA-{i + 1}
                  </Col>
                  <Col md={10} className="">
                    {task.name}
                  </Col>
                </Row>
              </Col>
              <Col md={4} sm={12}>
                <Row className="align-items-center">
                  {/* <Col className="" md={4}>
                    <Form.Select
                      value={whichStatus(task.status.status)}
                      onChange={(e) => {
                        handleOuterTaskStatusChange(task.task_id, e.target.value);
                      }}
                      aria-label="Default select example"
                      // value={newStatus}
                      size="sm"
                    >
                      <option value="0">Todo</option>
                      <option value="1">InProgress</option>
                      <option value="2">Open</option>
                      <option value="3">Done</option>
                      <option value="4">Closed</option>
                    </Form.Select>
                  </Col> */}
                  <Col className="p-2" md={4}>
                    <img
                      src={(task.assigned_user_id!=null)?(`http://192.168.1.6:8080/images?path=${task.assigned_user_id.profile_picture_url}`):("https://cad.gov.jm/wp-content/uploads/2017/10/img_avatar2.png")}
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
          {error}
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
                <div className="alignMiddle">{user.firstname+' '+user.lastname}</div>
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
            <Modal.Title id="contained-modal-title-vcenter">{(taskModalStatus === "edit")?("Edit Task"):("Add Task")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {error}
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
                  <option value="1">Task</option>
                  <option value="2">Bug</option>
                </Form.Select>
              </Form.Group>
              {(taskModalStatus === "edit")?(
                <>
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
                  {
                  members.map((data)=>{
                    return (<option value={data.user_id}>{data.firstname} {data.lastname}</option>)
                    
                  })
                  }
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
              </>):(<></>)
              }

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
