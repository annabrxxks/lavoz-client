import "./submitEvent.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import { makeRequest } from "../../axios"
import { Dropdown } from 'react-nested-dropdown';

const SubmitEvent = () => {
  const [category, setCategory] = useState(null);
  const [file,setFile] = useState(null);
  const [date, setDate] = useState(new Date());

  const [texts, setTexts] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    description: "",
    file: ""
  });

  const [error, setError] = useState(null);

  const {currentUser} = useContext(AuthContext);
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newEvent)=>{
      return makeRequest.post("/posts/event", newEvent);
    },
    onSuccess:
    () => {
        // invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (texts.name == null || texts.location == null || texts.date == null || texts.time == null) {
      setError(true);
      return;
    }
    let imgUrl = "";
    if (file) imgUrl = await upload();
    let name = texts.name;
    let location = texts.location;
    let date = texts.date;
    let time = texts.time;
    let description = texts.description;
    let url = texts.url;
    mutation.mutate({ name, location, date, time, description, img: imgUrl, url});
    setError(false);
    setFile(null);
    setTexts("");
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  return (
    <div className="submit-event">
      <div className="container">
        <div className="top">
            <img
              src={process.env.PUBLIC_URL + "/upload/" + currentUser.profilePic}
              alt=""
            />
            <h2>Submit an Event</h2>
        </div>
        <form>
            <div className="row">
              <label>Event Name*</label>
              <input
                type="text"
                value={texts.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="row">
                <label>Date*</label>
                <input
                type="date"
                value={texts.date}
                name="date"
                onChange={handleChange}
                />
            </div>
            <div className="row">
                <label>Time*</label>
                <input
                type="time"
                value={texts.time}
                name="time"
                onChange={handleChange}
                />
            </div>
            <div className="row">
              <label>Location*</label>
              <input
                type="text"
                value={texts.location}
                name="location"
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Description</label>
              <input
                type="text"
                value={texts.description}
                name="description"
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>URL</label>
              <input
                type="text"
                value={texts.url}
                name="url"
                onChange={handleChange}
              />
            </div>
        </form>
        <div className="middle">
          {file && (
            <>
              {file.type.startsWith("image/") ? (
                <img className="file" alt="" src={URL.createObjectURL(file)} />
              ) : (
                <video className="file" controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image/Video</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick}>Submit</button>
          </div>
        </div>
        {error && <span className="error-msg">* indicates a required field</span>}
      </div>
    </div>
  );
};

export default SubmitEvent;
