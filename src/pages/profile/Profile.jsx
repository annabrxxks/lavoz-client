import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Update from "../../components/update/Update"
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => {return res.data})
  });
  
  const { isLoading: rIsLoading, data: relationshipData} = useQuery({
    queryKey: ["relationship"],
    queryFn: () => makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {return res.data})
  });

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  }
  
  return (
    <div className="profile">
      {isLoading ? "loading" :
        <div>
          <div className="images">
            <img
              src={process.env.PUBLIC_URL + "/upload/" + data.coverPic}
              alt=""
              className="cover"
            />
            <img
              src={process.env.PUBLIC_URL + "/upload/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">             
              <div className="center">
                <div className="name">
                  <span>{data.name}</span>
                </div>
                {data.account_type == 'business' && data.business_type != null &&
                  <div className="business-type"> 
                    {data.business_type}
                  </div>
                }
                <div className="bio"> 
                  {data.bio}
                </div>
                <div className="left">
                  <a href={data.facebook != null ? data.facebook : null}>
                    <FacebookTwoToneIcon fontSize="medium" />
                  </a>
                  <a href={data.instagram != null ? data.instagram : null}>
                    <InstagramIcon fontSize="medium" />
                  </a>
                  <a href={data.twitter != null ? data.twitter : null}>
                    <TwitterIcon fontSize="medium" />
                  </a>
                </div>
                <div className="info">
                  {data.city &&
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  }
                  {data.website &&
                  <div className="item">
                    <a href={data.website} color={"grey"}>
                      <InsertLinkIcon fontSize="medium" />
                      <span>{data.website}</span>
                    </a>
                  </div>}
                  {data.language &&
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.language}</span>
                  </div>
                  }
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={()=>setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>
            <Posts userId={userId}/>
          </div>
        </div>
      }
      {openUpdate && <Update setOpenUpdate = {setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
