import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./register.scss";
import { useContext, useState } from "react";
import axios from "axios";
import Terms from "../../components/terms/Terms";
import Privacy from "../../components/terms/Privacy";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    password:"",
    name:"",
  });
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });

  const [err, setErr] = useState(null);

  const handleChange = e => {
    setInputs(prev=>({...prev, [e.target.name]:e.target.value }))
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (inputs.username == "" || inputs.password == "" || inputs.email == "" || inputs.name == "") return;

    try {
      // Register the user
      await axios.post("https://lavoz-sql-6ee4ddacedb3.herokuapp.com/api/register", inputs);

      // Log in the user with the same credentials
      await login({
        username: inputs.username,
        password: inputs.password,
      });

      // Navigate to "/firstLogin" or any desired route after successful login
      setTimeout(() => {
        // Navigate to "/firstLogin" or any desired route after successful login
        navigate("/firstLogin");
      }, 500);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>La Voz Aggieland</h1>
          <p>
            We are the premier social media and news application for the Bryan/College Station Latino community. Create an account to promote your business, upload photos, and see what others have to say.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            {err && err}
            <div className="notice">
              <span>Note: By clicking "Register" below, you agree to the </span> 
              <span style={{textDecoration: "underline", color: "blue"}} onClick={() => setOpenTerms(true)}>Privacy Policy</span>
              <span> and </span>
              <span style={{textDecoration: "underline", color: "blue"}} onClick={() => setOpenPrivacy(true)}>Terms of Use.</span>
            </div>
            <button onClick={handleClick}>Register</button>
          </form>
          
          
        </div>
      </div>
      {openTerms && <Terms setOpenTerms={setOpenTerms}/>}
      {openPrivacy && <Privacy setOpenPrivacy={setOpenPrivacy}/>}
    </div>
  );
};

export default Register;
