import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import noteContext from '../context/notes/noteContext'

const Signup = () => {
  const context = useContext(noteContext)
  const {alertFunction} = context

  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = cred.name
    const email = cred.email
    const password = cred.password
    // API Call
    // const host = "http://localhost:5000"
    const host = "https://inotebook-rho.vercel.app/"
    const response = await fetch(`${host}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json()
    if (json.success) {
      alertFunction("success","You have successfully signed up!")
      //redirect
      localStorage.setItem("token", json.authToken)
      navigate('/')
    } else {
      alertFunction("danger","Some problem occured")
    }

  }

  const [cred, setCred] = useState({ name:"", email: "", password: "" })
  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group my-2">
        <input
          type="text" name="name"
          className="form-control"
          id="name"
          aria-describedby="emailHelp"
          placeholder="Enter Name" value={cred.name} onChange={onChange}
        />
      </div>
      <div className="form-group my-2">
        <input
          type="email" name="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Enter email" value={cred.email} onChange={onChange}
        />
      </div>
      <div className="form-group my-2">
        <input
          type="password" name="password"
          className="form-control"
          id="password"
          placeholder="Password" value={cred.password} onChange={onChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  )
}

export default Signup
