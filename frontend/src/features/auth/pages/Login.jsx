import React, { useState } from "react";
import "../Styles/form.scss";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/use.auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin(username, password).then((res) => {
      console.log(res);
      navigate("/");
    });
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
          />

          <div className="password-wrapper">
            <input
              onInput={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
