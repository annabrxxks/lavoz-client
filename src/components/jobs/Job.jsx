import "./job.scss";
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
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Job = ({ job }) => {
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
    deleteMutation.mutate(job.id);
  };
  const deleteMutation = useMutation({
    mutationFn: (jobId) => {
      return makeRequest.delete("/posts/jobs/" + jobId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["jobs"]);
    },
  });

  return (
    <div className="job">
      <div className="container">
        <div className="top">
            <h3>{job.name}</h3>
            <div className="user">
            <div className="userInfo">
                <img src={process.env.PUBLIC_URL + "/upload/" + job.profilePic} alt="" />
                <div className="details">
                <Link
                    to={`/profile/${job.userId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <span className="name">{job.username}</span>
                </Link>
                </div>
            </div>
            </div>
            <div className = "center">
              {job.userId === currentUser.id && 
                <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
              }
              {menuOpen && job.userId === currentUser.id && (
                <button className="delete" onClick={handleDelete}>delete job</button>
              )}
            </div>
        </div>
        
        <div className="content">
            <div className="row">
                <PaidIcon/>
                <span>{job.pay}</span>
            </div>
            <div className="row">
                <CalendarMonthIcon/>
                <span>{job.schedule}</span>
            </div>
            <div className="row">
                <LocationOnIcon/>
                <span>{job.location}</span>
            </div>
            {/* <div className="row">
                <AccessTimeIcon/>
                <span className="date">start by {moment(job.date).format('MMMM D, YYYY')}</span>
            </div>
            {job.employer_name && 
            <div className="row">
                <PersonIcon/>
                <span>{job.employer_name}</span>
            </div>} */}
            <div className="row">
                <EmailIcon/>
                <span>To apply, contact</span>
                <span className="link">{job.contact}</span>
            </div>
            {job.description && 
            <div className="row">
                <span>{job.description}</span>
            </div>}
          {isImage(job.img) && <img src={process.env.PUBLIC_URL + `/upload/${job.img}`}/>}
          {isVideo(job.img) && (
            <video controls>
              <source src={process.env.PUBLIC_URL + `/upload/${job.img}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;
