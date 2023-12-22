import { useContext, useState } from "react";
import "./comment.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import moment from "moment";
import Rate from "../rate/Rate";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfied from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';

const Comment = ({ comment }) => {
  const [desc, setDesc] = useState("");
  const [rateOpen, setRatingOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [faceShown, setFaceShown] = useState(false);
  const [submitGreen, setSubmitGreen] = useState(false);
  const [submitShown, setSubmitShown] = useState(false);

  const [stars, setStars] = useState(0);

  const HandleStarPress = (id) => {
    setStars(id);
    setFaceShown(true);
  }
  const getStarIcon = (id) => {
    if (id < stars) return (<StarIcon fontSize="small"/>)
    else return (<StarBorderIcon fontSize="small"/>)
  }
  const getAvgStarIcon = (id) => {
    if (id < getAverageRating()) return (<StarIcon fontSize="xsmall"/>)
    else return (<StarBorderIcon fontSize="xsmall"/>)
  }
  const getEmotion = (id) => {
    if (id === 1) return (<SentimentVeryDissatisfiedIcon className="floating"/>)
    else if (id === 2) return (<SentimentDissatisfiedIcon className="floating"/>)
    else if (id === 3) return (<SentimentNeutralIcon className="floating"/>)
    else if (id === 4) return (<SentimentSatisfiedIcon className="floating"/>)
    else return (<SentimentVerySatisfied className="floating"/>)
  }
  const getCheckBox = () => {
    if (submitGreen) {
      return(      
      <button className="submit" onClick={handleRate} style={{color: "green"}}>
        <CheckBoxIcon fontSize="small"/>
      </button> 
      ) 
    }
    else {
      return(      
        <button className="submit" onClick={handleRate}>
          <CheckBoxIcon fontSize="small"/>
        </button> 
      )       
    }
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["ratings", comment.id],
    queryFn: () => makeRequest.get("/ratings?commentId=" + comment.id).then((res) => {return res.data})
  });

  const handleRate = () => {
    setSubmitGreen(true);
    const commentId = comment.id;
    console.log(data.includes(currentUser.id))
    mutation.mutate({ stars, commentId }, data.includes(currentUser.id));
    console.log("added rating")
    setTimeout(() => {
      setRatingOpen(false);
    }, 1000);
  };

  const mutation = useMutation({
    mutationFn: (rating, rated) => {
      if (rated) {
        console.log('delete')
        return(makeRequest.delete("/ratings?commentId=" + comment.id));
      }
      return makeRequest.post("/ratings", rating);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["ratings"]);
    },
  });

  const getAverageRating = () => {
    let sum = 0;
    data.map((rating) => sum += rating.value);
    if (data?.length === 0) return 0
    const avg = sum/data?.length;
    return avg
  }
  
  return (
    <div className="comment">
      <img src={process.env.PUBLIC_URL + '/upload/' + comment.profilePic} alt="" />
      <div className="comment-info">
        <span>{comment.name}</span>
        <p>{comment.desc}</p> 
        {rateOpen? 
          <div>
          <div className = "rating">
            <div className="stars">
              <button 
                onClick={() => { HandleStarPress(1) }}>
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
            {faceShown ? 
            <div className = "emotion">
              {getEmotion(stars)}
            </div>
            : ""
            }
            {getCheckBox()}
          </div>
          
          </div>
        :
        <button className="rate-button" onClick={() => setRatingOpen(true)}>rate</button> 
        }
      </div>
      <div>
        <span className="date">
          {moment(comment.createdAt).fromNow()}
        </span>
        {isLoading ? "loading" :
          <div className="stars">
            {getAvgStarIcon(0)}
            {getAvgStarIcon(1)}
            {getAvgStarIcon(2)}
            {getAvgStarIcon(3)}
            {getAvgStarIcon(4)}
          </div>
        }
        
      </div>
    </div>
  )
};

export default Comment;
