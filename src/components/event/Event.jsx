import "./event.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const Event = ({ event }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const isImage = (url) => {
    if (url === null) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };
  
  const isVideo = (url) => {
    if (url === null) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  }; 
  
  const queryClient = useQueryClient();
  const handleDelete = () => {
    deleteMutation.mutate(event.id);
  };
  const deleteMutation = useMutation({
    mutationFn: (eventId) => {
      return makeRequest.delete("/posts/events/" + eventId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["events"]);
    },
  });

  return (
    <div className="event">
      <div className="container">
        <div className="top">
            <h3>{event.name}</h3>
            <div className="user">
            <div className="userInfo">
                <img src={process.env.PUBLIC_URL + "/upload/" + event.profilePic} alt="" />
                <div className="details">
                <Link
                    to={`/profile/${event.userId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <span className="name">{event.username}</span>
                </Link>
                </div>
            </div>
            </div>
            <div className = "center">
              {event.userId === currentUser.id && 
                <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
              }
              {menuOpen && event.userId === currentUser.id && (
                <button className="delete" onClick={handleDelete}>delete event</button>
              )}
            </div>
        </div>
        
        <div className="content">
            <div className="row">
                <AccessTimeIcon/>
                <span className="date">{moment(event.date).format('MMMM D, YYYY h:mm A')}</span>
            </div>
            <div className="row">
                <LocationOnIcon/>
                <span>{event.location}</span>
            </div>
            {event.url && 
            <div className="row">
                <InsertLinkIcon/>
                <span className="link">{event.url}</span>
            </div>}
            {event.description && 
            <div className="row">
                <HelpOutlineIcon/>
                <span>{event.description}</span>
            </div>}
          {isImage(event.file) && <img src={process.env.PUBLIC_URL + `/upload/${event.file}`}/>}
          {isVideo(event.file) && (
            <video controls>
              <source src={process.env.PUBLIC_URL + `/upload/${event.file}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
