import { makeRequest } from "../../axios";
import "./firstLogin.scss";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Switch from '@mui/material/Switch';
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";

const FirstLogin = () => {
  const navigate = useNavigate()
  const {currentUser} = useContext(AuthContext);
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
      email: currentUser.email,
      password: currentUser.password,
      name: currentUser.name,
      city: currentUser.city,
      website: currentUser.website,
      language: currentUser.language,
      instagram: currentUser.instagram,
      twitter: currentUser.twitter,
      facebook: currentUser.facebook,
      bio: currentUser.bio,
      account_type: currentUser.account_type,
      business_type: currentUser.business_type,
    });
    const [checked, setChecked] = useState(currentUser.account_type === 'business');

    const handleToggle = () => {
      setChecked(!checked);
      // Update the account_type in the texts state based on the toggle
      setTexts((prev) => ({ ...prev, account_type: checked ? 'personal' : 'business' }));
    };
  
    const upload = async (file) => {
      console.log(file)
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeRequest.post("/upload", formData);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
  
    const handleChange = (e) => {
      setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
    };
  
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
        mutationFn: (user) => {
            return makeRequest.put("/users", currentUser);
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["user"]);
        },
    });
  
    const handleClick = async (e) => {
      e.preventDefault();
    
      try {
        let coverUrl = cover ? await upload(cover) : currentUser.coverPic;
        let profileUrl = profile ? await upload(profile) : currentUser.profilePic;
    
        mutation.mutate({
          ...texts,
          coverPic: coverUrl,
          profilePic: profileUrl,
        });
        setCover(null);
        setProfile(null);
      } catch (error) {
        console.error("File upload failed:", error.message);
        // Handle the error, e.g., show a user-friendly message
      }
    };
  
    return (
      <div className="update">
        <div className="wrapper">
          <h1>Welcome to La Voz Hispana!</h1>
          <div className="welcome-msg">
            <span>To get started, let's fill out your profile a little more.</span>
            <br />
            <p className="another-msg">All fields are optional.</p>
          </div>
          <form>
            <div className="files">
              <label htmlFor="cover">
                <span>Cover Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      cover
                        ? URL.createObjectURL(cover)
                        : process.env.PUBLIC_URL + "/upload/" + currentUser.coverPic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="cover"
                style={{ display: "none" }}
                onChange={(e) => setCover(e.target.files[0])}
              />
              <label htmlFor="profile">
                <span>Profile Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      profile
                        ? URL.createObjectURL(profile)
                        : "/upload/" + currentUser.profilePic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="profile"
                style={{ display: "none" }}
                onChange={(e) => setProfile(e.target.files[0])}
              />
            </div>
            <div className="row">
              <label>Business Profile?</label>
                <Switch
                  checked={checked}
                  onChange={handleToggle}
                />
            </div>
            {checked && 
              <div className="row">
              <label>Business Type</label>
              <input
                type="text"
                name="business_type"
                value={texts.business_type}
                onChange={handleChange}
              />
              </div>
            }
            <span className = "description">A business account allows you to post advertisements and display information about your business on your profile.</span>
            <div className='row'>
              <label>Bio</label>
              <input
                type="text"
                value={texts.bio}
                name="bio"
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Country/City</label>
              <input
                type="text"
                name="city"
                value={texts.city}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Language</label>
              <input
                type="text"
                name="website"
                value={texts.website}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Facebook Link</label>
              <input
                type="text"
                name="facebook"
                value={texts.facebook}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Instagram Link</label>
              <input
                type="text"
                name="instagram"
                value={texts.instagram}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Twitter Link</label>
              <input
                type="text"
                name="twitter"
                value={texts.twitter}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Website Link</label>
              <input
                type="text"
                name="website"
                value={texts.website}
                onChange={handleChange}
              />
            </div>
          </form>
          
          <button className="continue" onClick={() => navigate("/")}>Get Started</button>
          
        </div>
      </div>
    );
  };
  
  export default FirstLogin;