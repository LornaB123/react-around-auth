import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

function Login(props) {
  const {
    loggedIn,
    email,
    setEmail,
    password,
    setPassword,
    handleLoginSubmit,
    userEmail,
    setUserEmail,
    onClose,
  } = props;
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      history.push("/main");
      setUserEmail(email || userEmail);
    }
  });

  return (
    <div className="login">
        <form 
            action="#" 
            onSubmit={handleLoginSubmit}
            className="login__form"
            onClose={onClose}
        />
        <h2 className="login__title">Log in</h2>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          className="login__input"
          minLength="2"
          maxLength="40"
          required
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="on"
        />
        <input
          className="login__input"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          minLength="2"
          maxLength="200"
          required
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="on"
        />
        <button className="login__submit" to="/main">
          Log in
        </button>
        <Link className="login__text" to="/signup">
          Not a member yet? Sign up here!
        </Link>
        
    <Link className="login__call-out" to="/signup">
        Sign up
    </Link>
    </div>
  );
}

export default Login;
