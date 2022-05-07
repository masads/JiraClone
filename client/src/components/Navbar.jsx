import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { AuthContext } from "./context";
import { useNavigate } from "react-router-dom";
import {
  BoxArrowInRight,
  FileBarGraphFill,
  FileEarmarkSpreadsheetFill,
  Person,
} from "react-bootstrap-icons";
import React from "react";

function TopNav() {
  const { userToken,signOut } = React.useContext(AuthContext);
  const history=useNavigate()
  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand href="#home">ManageO</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            
            {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
            {
              
              (userToken==null)
              ?
              (   <>      
                <Nav.Link  onClick={()=>{history("/sign-up")}}>
                {<Person color="white" />} Signup
                </Nav.Link>
                <Nav.Link onClick={()=>{history("/log-in")}}>
                  
                  {<BoxArrowInRight color="white" />} Login
                </Nav.Link>
                </>
              )
              :
              (<>
                <Nav.Link onClick={()=>{history("/projects")}}>
                  {<FileBarGraphFill color="white" />} Projects
                </Nav.Link>
                <Nav.Link onClick={()=>{history("/reports")}}>
                  {<FileEarmarkSpreadsheetFill color="white" />} Report
                </Nav.Link>
                <Nav.Link  onClick={()=>{signOut()}}>
                {<BoxArrowInRight color="white" />} Log out
                </Nav.Link>
              </>)
              
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default TopNav;
