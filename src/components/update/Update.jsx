import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Switch from '@mui/material/Switch';

const Update = ({ setOpenUpdate, user }) => {
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
      email: user.email,
      password: user.password,
      name: user.name,
      city: user.city,
      website: user.website,
      language: user.language,
      instagram: user.instagram,
      twitter: user.twitter,
      facebook: user.facebook,
      bio: user.bio,
      account_type: user.account_type,
      business_type: user.business_type,
    });
    const [checked, setChecked] = useState(user.account_type === 'business');

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
            return makeRequest.put("/users", user);
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["user"]);
        },
    });
  
    const handleClick = async (e) => {
      e.preventDefault();
    
      try {
        let coverUrl = cover ? await upload(cover) : user.coverPic;
        let profileUrl = profile ? await upload(profile) : user.profilePic;
    
        mutation.mutate({
          ...texts,
          coverPic: coverUrl,
          profilePic: profileUrl,
        });
        setOpenUpdate(false);
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
          <h1>Update Your Profile</h1>
          <form>
            <div className="files">
              <label htmlFor="cover">
                <span>Cover Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      cover
                        ? URL.createObjectURL(cover)
                        : process.env.PUBLIC_URL + "/upload/" + user.coverPic
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
                        : "/upload/" + user.profilePic
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
              <label>Email</label>
              <input
                type="text"
                value={texts.email}
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="row">
            <label>Password</label>
              <input
                type="password"
                value={texts.password}
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <label>Name</label>
              <input
                type="text"
                value={texts.name}
                name="name"
                onChange={handleChange}
              />
            </div>
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
            <button onClick={handleClick}>Update</button>
          </form>
          <button className="close" onClick={() => setOpenUpdate(false)}>
            close
          </button>
        </div>
      </div>
    );
  };
  
  export default Update;