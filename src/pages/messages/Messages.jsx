import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import moment from 'moment';
import "./messages.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import SendIcon from '@mui/icons-material/Send';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InputEmoji from 'react-input-emoji';
import TextField from "@mui/material/TextField";
import List from '../../components/list/List';
import MessageThread from '../../components/messages/MessageThread';

const Messages = () => {
    const { currentUser } = useContext(AuthContext);
    const [inputText, setInputText] = useState("");
    const [searchVisible, setSearchVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(0);
    const [selectedUsername, setSelectedUsername] = useState("");
    const [readyToRender, setReadyToRender] = useState(false);
    const [selectedUserTimeout, setSelectedUserTimeout] = useState(null);
    
    const { isLoading, error, data } = useQuery({
      queryKey: ["user"],
      queryFn: () => makeRequest.get("/users/").then((res) => res.data),
    });

    const getUserList = () => {
      if (error) {
        // Handle the error case
        console.error("Error fetching user data:", error);
        return null;
      }
    
      if (!isLoading && data) {
        const filteredUsers = data.filter((user) => user.username.includes(inputText));
        
        return (
          filteredUsers.slice(0, 5).map((user) => 
            <div key={user.id} className="conversation" onClick={() => setSelectedUser(user.id)}>
              <img className="small-img" src={process.env.PUBLIC_URL + "/upload/" + user.profilePic} alt={`${user.username}'s profile`} />
              <div className="info">
                <span className="username">{user.username}</span>
              </div>
            </div>
          )
        );
      }
    
      // Handle the case when isLoading is true or data is not available
      return null;
    };
  
    const { isLoading: isMLoading, error: mError, data: mData } = useQuery({
      queryKey: ["allMessages"],
      queryFn: () => makeRequest.get("/messages/all").then((res) => res.data),
    });

    if (isLoading) {
      return "Loading...";
    }
  
    let inputHandler = (e) => {
      // convert input text to lowercase
      var lowerCase = e.target.value.toLowerCase();
      setInputText(lowerCase);
    };
    
    const handleChange = (id, name) => {
      setSelectedUsername(name);
      setSelectedUser(id);
    };

    return (
      <div className="messages">
        <div className="message-list">
          <div className="top">
            <h3>Messages</h3>
            <button onClick={() => setSearchVisible(!searchVisible)}>
              <EditNoteIcon style={{ color: "white" }} />
            </button>
          </div>
          {searchVisible && (
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
          )}
          
          {!mData &&
            <div className="user-msg">
              You have no messages. Click the maroon icon above to start a new conversation!
            </div>
          }
          {!isMLoading && mData &&
            mData.map((thread) => (
              thread.user_id != currentUser.id &&
              <div key={thread.msg} className="conversation" onClick={() => handleChange(thread.user_id, thread.user_name)}>
                <img src={process.env.PUBLIC_URL + "/upload/" + thread.user_profile_pic} alt={`${thread.user_username}'s profile`} />
                <div className="info">
                  <span className="username">{thread.user_username}</span>
                  <div className="preview">
                    <span>{thread.latest_message_content} - </span>
                    <span className="date">{moment(thread.latest_message_time).fromNow()}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
  
        {selectedUser !== 0 && <MessageThread key={selectedUser} user={selectedUser} name={selectedUsername} />}
      </div>
    );
  };
  
  export default Messages;
  
