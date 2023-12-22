import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import moment from 'moment';
import "./messages.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import SendIcon from '@mui/icons-material/Send';
import InputEmoji from 'react-input-emoji';

const MessageThread = ({user, name}) => {
  const { currentUser } = useContext(AuthContext);
  const [inputText, setInputText] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const queryClient = useQueryClient();
  const userId = user;
  const [msgSubmitted, setMsgSubmitted] = useState(false);

  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const handleClick = () => {
    if (newMsg == "") {return;}
    const msgTo = userId;
    const msg = newMsg;
    setMsgSubmitted(true);
    setTimeout(() => {
      mutation.mutate({ msg, msgTo });
      setMsgSubmitted(false);
    }, 700);
    setNewMsg("");

  };

  const mutation = useMutation({
    mutationFn: (newMessage) => {
      return makeRequest.post("/messages", newMessage);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const { isLoading, error, data: mData } = useQuery({
    queryKey: ["messages"],
    queryFn: () => makeRequest.get("/messages?userId=" + userId).then((res) => {return res.data})
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading messages: {error.message}</div>;
  }

  // Group messages by day
  const groupedMessages = mData.reduce((result, message) => {
    const day = moment(message.createdAt).format("YYYY-MM-DD");
    if (!result[day]) {
      result[day] = [];
    }
    result[day].push(message);
    return result;
  }, {});

  return (
        <div className="right">
            {!isLoading && mData &&
              <div className = "thread">
                {/* <div className = "username">{name}</div> */}
                {/* Render messages grouped by day */}
                {Object.entries(groupedMessages).map(([day, messages]) => (
                    <div key={day} className="convo">
                    <div className="date">
                        {moment(day).format("dddd M/D/YYYY")}
                    </div>
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div className="row">
                                {message.msgTo === currentUser.id && (
                                <img src={process.env.PUBLIC_URL + "/upload/" + message.profilePic} className="profilePic" />
                                )}
                                <div
                                className={message.msgFrom === currentUser.id ? "msg-to" : "msg-from"}
                                >
                                {message.msg}
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                ))}
              </div>
            }
            
            <div className="write">
                <InputEmoji 
                placeholder="Message..." 
                value={newMsg}
                onChange={setNewMsg}
                borderRadius = {10}
                />
                <button className="submit" onClick = {handleClick}> <SendIcon style={msgSubmitted === false ? {color: "gray"} : {color: "green"}}/> </button>
            </div>
          </div>
  );
};

export default MessageThread;
