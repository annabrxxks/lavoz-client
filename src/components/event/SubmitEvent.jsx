import "./submitEvent.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import { makeRequest } from "../../axios"
import { Dropdown } from 'react-nested-dropdown';
import { useTranslation } from "react-i18next";

const SubmitEvent = () => {
  const { t, i18n } = useTranslation();
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
        queryClient.invalidateQueries(["events"]);
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
    setTexts({
      name: "",
      location: "",
      date: "",
      time: "",
      description: "",
      file: ""
    });
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  return (
    <div className="submit-event">
      {!currentUser ?
        <div/>
      :
      <div className="container">
      <div className="top">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <h2>{t('events.submit')}</h2>
      </div>
      <form>
          <div className="row">
            <label>{t('events.name')}</label>
            <input
              type="text"
              value={texts.name}
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="row">
              <label>{t('events.date')}</label>
              <input
              type="date"
              value={texts.date}
              name="date"
              onChange={handleChange}
              />
          </div>
          <div className="row">
              <label>{t('events.time')}</label>
              <input
              type="time"
              value={texts.time}
              name="time"
              onChange={handleChange}
              />
          </div>
          <div className="row">
            <label>{t('events.location')}</label>
            <input
              type="text"
              value={texts.location}
              name="location"
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <label>{t('events.description')}</label>
            <input
              type="text"
              value={texts.description}
              name="description"
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <label>{t('events.url')}</label>
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
                <source src={URL.createObjectURL(file)} type={"video/mp4"} />
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
              <span>{t('share.add')}</span>
            </div>
          </label>
        </div>
        <div className="right">
          <button onClick={handleClick}>{t('share.post')}</button>
        </div>
      </div>
      {error && <span className="error-msg">{t('jobs.error')}</span>}
    </div>
    }
    </div>
  );
};

export default SubmitEvent;
