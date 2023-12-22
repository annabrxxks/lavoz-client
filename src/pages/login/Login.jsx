import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      await login(inputs);
      navigate("/")
    } catch (err) {
      // setErr(err.response.data);
      console.log("Can't login!")
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>La Voz Aggieland</h1>
          <p>
          We are a posts and content creation media that brings you the latest local news through our network, we invite users to share positive content, we encourage fans and the community to show support for the Texas A&M University Aggies!
          </p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="password" placeholder="Password" name = "password" onChange = {handleChange}/>
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
