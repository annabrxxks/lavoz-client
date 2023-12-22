import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import News from "../../assets/12.png";
import Tamu from "../../assets/tamu.jpg";
import Tutorials from "../../assets/11.png";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";

const LeftBar = () => {
  const navigate = useNavigate();
  const [categoryToggle, setCategoryToggle] = useState(false);
  const [newsToggle, setNewsToggle] = useState(false);
  const [marketToggle, setMarketToggle] = useState(false);
  const [tamuToggle, setTamuToggle] = useState(false);
  const [err, setErr] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    const res = await axios.post("http://localhost:8800/api/auth/logout", {
    });
  };

  const handleLogout = async (e) => {
    e.preventDefault()
    try{
      navigate("/login");
      await logout();
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
            <div className="row">
            <Link to={"/profile/"+currentUser.id} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="user">
                <img
                  src={process.env.PUBLIC_URL + "/upload/" + currentUser.profilePic}
                  alt=""
                />
                <span>{currentUser.name}</span>
              </div>
            </Link>
            <div className="logout">
              <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)}/>
              {menuOpen && <button onClick={handleLogout}>Logout</button>}
            </div>
            
            </div>

          <div className="item" onClick={() => setCategoryToggle(!categoryToggle)}>
            <img src={Groups} alt="" />
            <span>Categorias</span>
            <KeyboardArrowDownIcon fontSize="small"/>
          </div>
          {categoryToggle && 
          <div className="submenu">
            <div className="row" onClick = {() => setNewsToggle(!newsToggle)}>
              <Link to={"/news"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="categoryLabel">Noticias</div>
              </Link>
              {/* <KeyboardArrowDownIcon fontSize="small"/> */}
            </div>
            {/* {newsToggle && 
              <div class="submenu">
                <Link to={"/local"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="subcategoryLabel">Locales</div>
                </Link>
                <Link to={"/usa"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="subcategoryLabel">Estados Unidos</div>
                </Link>
                <Link to={"/latam"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="subcategoryLabel">Latinoamerica</div>
                </Link>
                <Link to={"/global"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="subcategoryLabel">Global</div>
                </Link>
                <Link to={"/hora"} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="subcategoryLabel">Noticias de última hora</div>
                </Link>
              </div>
            } */}
            <div className="row">
              <Link to={"/market"} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="categoryLabel">Marketstation</div>
              </Link>
              {/* <KeyboardArrowDownIcon fontSize="small" onClick = {() => setMarketToggle(!marketToggle)}/> */}
            </div>
            {/* {marketToggle && 
            <div className="submenu"> 
              <Link to={"/jobs"} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="subcategoryLabel">Empleos</div>
              </Link>
              <Link to={"/events"} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="subcategoryLabel">Events</div>
              </Link>
            </div>
            } */}
            <div className="row">
              <Link to={"/tamu"} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="categoryLabel">Universidad Texas A&M</div>
              </Link>
              {/* <KeyboardArrowDownIcon fontSize="small" onClick = {() => setTamuToggle(!tamuToggle)}/> */}
            </div>
            {/* {tamuToggle &&
              <Link to={"/games"} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="subcategoryLabel">Juegos de los Aggies</div>
              </Link>
            } */}
            <Link to={"/greatThings"} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="categoryLabel">Great Things</div>
            </Link>
            <Link to={"/more"} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="categoryLabel">Descubre Mas</div>
            </Link>
            <Link to={"/general"} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="categoryLabel">General</div>
            </Link>
          </div>
          }
          <Link to={"/market"} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="item">
                <img src={Market} alt="" />
                <span>MarketStation</span>
            </div>
          </Link>
          <Link to={"/news"} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="item">
                <img src={News} alt="" />
                <span>Noticias</span>
            </div>
          </Link>
          <Link to={"/tamu"} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="item">
                <img src={Tamu} alt="" />
                <span>Texas A&M</span>
            </div>
          </Link>
          <Link to={"/users"} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="item">
                <img src={Friends} alt="" />
                <span>Amigos</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
