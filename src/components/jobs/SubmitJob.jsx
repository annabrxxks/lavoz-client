import "./submitJob.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import { makeRequest } from "../../axios"
import { Dropdown } from 'react-nested-dropdown';

const SubmitJob = () => {
  const [category, setCategory] = useState(null);
  const [file,setFile] = useState(null);
  const [date, setDate] = useState(new Date());

  const [texts, setTexts] = useState({
      name: "",
      pay: "",
      schedule: "",
      startDate: "",
      employer: "",
      location: "",
      description: "",
      contact: "",
  });

  const items = [
    {
      label: 'General',
      onSelect: () => setCategory("general"),
    },
    {
      label: 'Construccion',
      onSelect: () => setCategory("construction"),
    },
    {
      label: 'Jardineria',
      onSelect: () => setCategory("gardener"),
    },
    {
      label: 'Housekeeping',
      onSelect: () => setCategory("housekeeping"),
    },
    {
        label: 'Janitorial Service',
        onSelect: () => setCategory("janitor"),
    },
    {
        label: 'Restaurante',
        onSelect: () => setCategory("restaurant"),
    },
  ];

  const [error, setError] = useState(null);

  const {currentUser} = useContext(AuthContext);
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newJob)=>{
      return makeRequest.post("/posts/job", newJob);
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
    if (texts.name == "" || category == null || texts.pay == "" || texts.schedule == "" || texts.location == "" || texts.contact == "") {
      setError(true);
      return;
    }
    let imgUrl = "";
    if (file) imgUrl = await upload();
    let name = texts.name;
    let location = texts.location;
    let start_date = texts.startDate;
    let description = texts.description;
    let contact = texts.contact;
    let pay = texts.pay;
    let schedule = texts.schedule;
    let employer = texts.employer;
    mutation.mutate({ name, location, start_date, description, img: imgUrl, contact, pay, schedule, employer, category});
    setError(false);
    setFile(null);
    setCategory(null);
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  return (
    <div className="submit-job">
      <div className="container">
        <div className="top">
            <img
              src={process.env.PUBLIC_URL + "/upload/" + currentUser.profilePic}
              alt=""
            />
            <h2>Post a Job</h2>
        </div>
        <form>
            <div className="row">
                <label>Job Type*</label>
                <Dropdown items={items} containerWidth="200px">
                    {({ isOpen, onClick }) => (
                        <button type="button" onClick={onClick} className={"dropdown"}>
                        {category === null ? "Select" : category}
                        </button>
                    )}
                </Dropdown>
            </div>
            <div className="row">
              <label>Job Name*</label>
              <input
                type="text"
                value={texts.name}
                name="name"
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Pay*</label>
              <input
                type="text"
                value={texts.pay}
                name="pay"
                onChange={handleChange}
              />
            </div>
            <div className="row">
                <label>Schedule*</label>
                <input
                type="text"
                value={texts.schedule}
                name="schedule"
                onChange={handleChange}
                />
            </div>
            <div className="row">
                <label>Desired Start Date</label>
                <input
                type="date"
                value={texts.startDate}
                name="startDate"
                onChange={handleChange}
                />
            </div>
            <div className="row">
              <label>Employer Name</label>
              <input
                type="text"
                value={texts.employer}
                name="employer"
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
              <label>To apply, contact:*</label>
              <input
                type="text"
                value={texts.contact}
                name="contact"
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

export default SubmitJob;
