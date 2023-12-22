import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./users.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import TextField from "@mui/material/TextField";
import User from "../../components/user/User";

const Users = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;
  const [inputText, setInputText] = useState("");
  const [followerInputText, setFollowerInputText] = useState("");
  const [followingInputText, setFollowingInputText] = useState("");
  const [selectedUser, setSelectedUser] = useState(0);
  const queryClient = useQueryClient();

  let inputHandler = (e) => {
    // convert input text to lowercase
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  let followerInputHandler = (e) => {
    // convert input text to lowercase
    var lowerCase = e.target.value.toLowerCase();
    setFollowerInputText(lowerCase);
  };

  let followingInputHandler = (e) => {
    // convert input text to lowercase
    var lowerCase = e.target.value.toLowerCase();
    setFollowingInputText(lowerCase);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: () => makeRequest.get("/users/").then((res) => res.data),
  });

  const { isLoading: isFollowersLoading, error: followerError, data: followerData} = useQuery({
    queryKey: ["followers"],
    queryFn: () => makeRequest.get("/users/followers").then((res) => res.data),
  });

  const { isLoading: isFollowingLoading, error: followingError, data: followingData} = useQuery({
    queryKey: ["following"],
    queryFn: () => makeRequest.get("/users/following").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return makeRequest.delete("/relationships/unfollow", {selectedUser});
      return makeRequest.post("/relationships/follow", { selectedUser });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["relationship"]);
    },
  });

  const handleFollow = (id) => {
    setSelectedUser(id);
    mutation.mutate(followingData.includes(currentUser.id));
  }

  const getUserList = () => {
    if (error) {
      // Handle the error case
      console.error("Error fetching user data:", error);
      return null;
    }
  
    if (!isLoading && data && Array.isArray(data)) {
      const filteredUsers = data.filter((user) => user.username.includes(inputText));
      
      return (
        <div className="user-list">
            {filteredUsers.map((user) => 
              // <User user={user} key={user.id}/>
            <Link to={"/profile/" + user.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="user" key={user.id} onClick={() => setSelectedUser(user.id)}>
                <img className="profilePic" src= {process.env.PUBLIC_URL + "/upload/" + user.profilePic}/>
                <span>{user.username}</span>
                {/* <button onClick={handleFollow}>{user.following === 1 ? "Following" : "Follow"}</button> */}
            </div>
            </Link>
            )}
        </div>
      );
    }
  
    // Handle the case when isLoading is true or data is not available
    return null;
  };

  const getFollowerList = () => {
    if (followerError) {
      console.error("Error fetching user data:", followerError);
      return null;
    }

    if (!isFollowersLoading && followerData && Array.isArray(followerData)) {
      const filteredUsers = followerData.filter((user) => user.username.includes(followerInputText));
        return (
            <div className="user-list">
                {filteredUsers.slice(0, 16).map((user) => 
                <Link to={"/profile/" + user.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="user" key={user.id} onClick={() => setSelectedUser(user.id)}>
                      <img className="profilePic" src= {process.env.PUBLIC_URL + "/upload/" + user.profilePic}/>
                      <span>{user.username}</span>
                      {/* <button>{user.following === 1 ? "Following" : "Follow"}</button> */}
                  </div>
                </Link>
                )}
            </div>
        )
    }

    return null;
  }

  const getFollowingList = () => {
    if (followingError) {
      console.error("Error fetching user data:", followingError);
      return null;
    }

    if (!isFollowingLoading && followingData && Array.isArray(followingData)) {
      const filteredUsers = followingData.filter((user) => user.username.includes(followingInputText));
        return (
            <div className="user-list">
                {filteredUsers.slice(0, 16).map((user)  => 
                <Link to={"/profile/" + user.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="user" key={user.id}>
                      <img className="profilePic" src= {process.env.PUBLIC_URL + "/upload/" + user.profilePic}/>
                      <span>{user.username}</span>
                      {/* <button>Following</button> */}
                  </div>
                </Link>
                )}
            </div>
        )
    }

    return null;
  }

  return (
    <div className="users">
      <h1>Build Your Community</h1>
      <div className="user-category">
        <div className = "row">
          <h3>Following</h3>
          {followingData && !isFollowingLoading && <span>({followingData.length})</span>}
        </div>
        <div className="search">
                  <TextField
                      id="outlined-basic"
                      onChange={followingInputHandler}
                      variant="outlined"
                      fullWidth
                      label="Search"
                  />
        </div>
        { isFollowingLoading || !followingData ? "loading" : getFollowingList() } 
      </div>
      <div className="user-category">
          <div className = "row">
              <h3>Followers</h3>
              {followerData && !isFollowersLoading && <span>({followerData.length})</span>}
          </div>
          <div className="search">
                  <TextField
                      id="outlined-basic"
                      onChange={followerInputHandler}
                      variant="outlined"
                      fullWidth
                      label="Search"
                  />
          </div>
        { isFollowersLoading || !followerData ? "loading" : getFollowerList() }
      </div>
      <div className="user-category">
        <h3>All Users</h3>
        <div className = "search-list">
            <div className="search">
                <TextField
                    id="outlined-basic"
                    onChange={inputHandler}
                    variant="outlined"
                    fullWidth
                    label="Search"
                />
            </div>
            { isLoading || !data ? "loading" : getUserList()}
        </div>
      </div>
    </div>
  )
}

export default Users