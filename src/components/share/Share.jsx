import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import Flag from "../../assets/tamu_flag.png";
import Tamu from "../../assets/tamu.jpg";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import { makeRequest } from "../../axios"
import { Dropdown } from 'react-nested-dropdown';
import 'react-nested-dropdown/dist/styles.css';
import ReactGiphySearchbox from 'react-giphy-searchbox';
import AddReactionIcon from '@mui/icons-material/AddReaction';

const Share = () => {
  const [category, setCategory] = useState(null);

  const items = [
    {
      label: 'General',
      onSelect: () => setCategory("general"),
    },
    {
      label: 'Noticias',
      items: [
        {
          label: 'Locales',
          onSelect: () => setCategory("local"),
        },
        {
          label: 'Estados Unidos',
          onSelect: () => setCategory("usa"),
        },
        {
          label: 'Latinoamerica',
          onSelect: () => setCategory("latam"),
        },
        {
          label: 'Global',
          onSelect: () => setCategory("global"),
        },
      ],
    },
    {
      label: 'MarketStation',
      items: [
        {
          label: 'Empleos',
          onSelect: () => setCategory("jobs"),
        },
        {
          label: 'Events',
          onSelect: () => setCategory("events"),
        },
        {
          label: 'Anuncios',
          onSelect: () => setCategory("ads"),
        },
      ],
    },
    {
      label: 'Universidad Texas A&M',
      items: [
        {
          label: 'Universidad Texas A&M',
          onSelect: () => setCategory("tamu"),
        },
        {
          label: 'Juegos de los Aggies',
          onSelect: () => setCategory("games"),
        },
      ],
    },
    {
      label: 'Great Things',
      onSelect: () => setCategory("greatThings"),
    },
  ];

  const [file,setFile] = useState(null);
  const [desc,setDesc] = useState("");
  const [error, setError] = useState(null);
  const [gifOpen, setGifOpen] = useState(false);
  const [gif, setGif] = useState(null);
  const [flag, setFlag] = useState(false);

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

  const containerStyle = {
    height: 0,
    paddingBottom: '15%',
    position: 'relative',
  };

  const iframeStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  };

  const {currentUser} = useContext(AuthContext);
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost)=>{
      return makeRequest.post("/posts", newPost);
    },
    onSuccess:
    () => {
        // invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (category === null) {
      setError(true);
      return;
    }
    let imgUrl = "";
    if (file) imgUrl = await upload();
    setError(false);
    mutation.mutate({ desc, img: imgUrl, category, gifUrl: gif});
    setDesc("");
    setFile(null);
    setGif(null);
    setCategory(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
            <img
              src={process.env.PUBLIC_URL + "/upload/" + currentUser.profilePic}
              alt=""
            />
            <input 
              type="text" 
              placeholder={`Hacer nuevo post...`} 
              onChange={e=>setDesc(e.target.value)} 
              value={desc}
            />
        </div>
        
        <div className="middle">
          {file && (
            <>
            <button className="x" style={{marginLeft: 300}} onClick={()=>setFile(null)}>x</button>
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
        {gif && 
          <div>
            <button className="x" style={{position: "relative", left: "70%"}}onClick={()=>setGif(null)}>x</button>
          <div style={containerStyle}>
            <iframe
              src={gif}
              width="100%"
              height="100%"
              style={iframeStyle}
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
              title="Giphy Embed"
            ></iframe>
            {/* <p>
              <a href={gif}>
                via GIPHY
              </a>
            </p> */}
          </div>
          </div>
        }
        
        {flag && 
        <div>
          <img className="file"
            src={Flag}
            style={{width: 300}}
            alt=""
          />
          <button style={{marginLeft: "50px"}} className="x" onClick={()=>setFlag(false)}>x</button>
          </div>
        }
        <hr />
        <div className="bottom">
          <div className="left">
            <div className="item">
              <img src={Friend}/>
              <Dropdown items={items}>
                {({ isOpen, onClick }) => (
                  <button type="button" onClick={onClick} className={"category-label"}>
                    {category === null ? "Select Category *" : category}
                  </button>
                )}
              </Dropdown>
            </div>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image/Video/Audio</span>
              </div>
            </label>
            <label>
              <div className="item">
                <AddReactionIcon style={{color: "gray"}} onClick={()=>setGifOpen(!gifOpen)}/>
                <span>Add Gif</span>
              </div>
            </label>
            <label>
              <div className="item">
                <img src={Tamu} onClick={()=>setFlag(!flag)}/>
                <span>Add TAMU Flag</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick}>Post</button>
          </div>
        </div>
        {error && <span className="error-msg">Please select a category.</span>}
        {gifOpen &&
          <div className='searchbox-wrapper'>
            <ReactGiphySearchbox 
              apiKey='wTlyF2IWF5BelAJ5IdnYcy5NJPZlEW5Z' 
              onSelect={(item) => {setGif(item.embed_url)}}
              masonryConfig = {[
                {columns: 2, imageWidth:110,gutter:5},
                {mq: "700px", columns: 3, imageWidth: 120, gutter: 5}
              ]}
              />
          </div>
        }
      </div>
      
    </div>
  );
};

export default Share;
