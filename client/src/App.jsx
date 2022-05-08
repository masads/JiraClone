import React,{useMemo,useState} from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './components/login'
import SignUp from './components/signup'
import Project from './components/ProjectFeed'
import { AuthContext } from "./components/context";
import Navbar from './components/Navbar'
import SingleProject from './components/SingleProject'
import Report from './components/Report'
function App() {  
  const [userToken, setUserToken] = useState("asdasd");
  const [userData, setUserData] = useState({});
  const authContext = useMemo(() => {
    return {
      signIn:async (token, data) => {
        setUserToken(token);
        setUserData(data);
      },
      signOut: () => {
        setUserToken(null);
        setUserData({});
      },
      userToken,
      userData,
    };
  });
  
  // const AuthRoutes=()=>{
  //   return (
  //     <Router>
  //           <Routes>
  //             <Route path="*" element={<Navigate to='/log-in' />} />
  //             <Route path="/log-in" element={<Login />} />
  //             <Route path="/sign-up" element={<SignUp />} />
  //           </Routes>
  //   </Router>
  //   )
  // }


  
  return (
    <AuthContext.Provider value={authContext}>
      {/* {userToken ? <HomeRoutes /> : <AuthRoutes />} */}
      {/* <AuthRoutes /> */}
     
      <Router>
      <Navbar />
          <Routes>
            <Route path="*" element={(userToken)?(<Navigate to='/home' />):(<Navigate to='/log-in' />)} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/projects"  >
              <Route index={true} element={(userToken)?(<Project />):(<Navigate to='/log-in' />)} />
              <Route index={false} path=":projectid" element={<SingleProject />} />
            </Route>
            <Route path="/reports" element={(userToken)?(<Report />):(<Navigate to='/log-in' />)} />
            
          </Routes>
      </Router>
    </AuthContext.Provider>
  )
}
export default App