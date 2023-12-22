import { useState } from "react";
import { makeRequest } from "../../axios";
import "./rate.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Rate = ({ setRatingOpen, comment }) => {
    const [stars, setStars] = useState(0);

    const HandleStarPress = (id) => {
      let currentStars = stars;
      setStars(id);
    }
    const getStarIcon = (id) => {
      if (id < stars) return (<StarIcon fontSize="large" style={{ color: "#F6BE00" }}/>)
      else return (<StarBorderIcon fontSize="large" style={{ color: "#F6BE00" }}/>)
    }

    return (
      <div className="rate">
        <div className="wrapper">
          <h1>Rate This Comment</h1>
          <div className="stars">
            <button onClick={() => { HandleStarPress(1) }}>
              {getStarIcon(0)}
            </button>
            <button onClick={() => { HandleStarPress(2) }}>
              {getStarIcon(1)}
            </button>
            <button onClick={() => { HandleStarPress(3) }}>
              {getStarIcon(2)}
            </button>
            <button onClick={() => { HandleStarPress(4) }}>
              {getStarIcon(3)}
            </button>
            <button onClick={() => { HandleStarPress(5) }}>
              {getStarIcon(4)}
            </button>
          </div>
          <button className="submit" onClick={() => setRatingOpen(false)}>
            submit
          </button> 
        <button className="close" onClick={() => setRatingOpen(false)}>
          x
        </button> 
        </div>
      </div>
    );
  };
  
  export default Rate;