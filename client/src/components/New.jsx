import React from 'react'
import {
    Link,
    useParams,
  } from 'react-router-dom';
function New() {
    const { userId } = useParams();
  return (
    <>
    <h2>User: {userId}</h2>

    <Link to="/projects">Back to projects</Link>
  </>
  )
}

export default New