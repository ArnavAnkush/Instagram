import React from "react";
import { Link } from "react-router";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleFormSubmit(e) {
    e.preventDefault();
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
          />
          <input
            onInput={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <input
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?{" "}
          <Link className="toggleAuthForm" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
