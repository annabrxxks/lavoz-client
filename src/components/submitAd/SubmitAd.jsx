// This is the code for the "submit ad" component -- where people can sell items in MarketStation (general, construction, gardening, etc)

import "../share/share.scss";
import Image from "../../assets/img.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import { makeRequest } from "../../axios"
import { Dropdown } from 'react-nested-dropdown';
import 'react-nested-dropdown/dist/styles.css';
import ReactGiphySearchbox from 'react-giphy-searchbox';
import DisabledByDefault from "@mui/icons-material/DisabledByDefault";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { useTranslation } from "react-i18next";
import ReactSimplyCarousel from "react-simply-carousel";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from "react-router-dom";
import DefaultUser from "../../assets/pfp.jpg";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextareaAutosize from 'react-textarea-autosize';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const SubmitAd = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const items = [
    {
      label: t('categories.general'),
      onSelect: () => setCategory("general-ad"),
    },
    {
      label: "Aggie Merch",
      onSelect: () => setCategory("merch"),
    },
    {
      label: t('categories.construction'),
      onSelect: () => setCategory("construction"),
    },
    {
      label: t('categories.free'),
      onSelect: () => setCategory("free"),
    },
    {
      label: t('categories.home'),
      onSelect: () => setCategory("home"),
    },
    {
      label: t('categories.landscape'),
      onSelect: () => setCategory("landscape"),
    },
    {
      label: t('categories.vehicle'),
      onSelect: () => setCategory("vehicles"),
    },
  ];

  const [files, setFiles] = useState([]);
  const [desc,setDesc] = useState("");
  const [error, setError] = useState(null);
  const [displayMessage, setDisplayMessage] = useState(null);
  const [gifOpen, setGifOpen] = useState(false);
  const [gif, setGif] = useState(null);
  const [tooManyFiles, setTooManyFiles] = useState(false);
  const [url, setURL] = useState(null);

  const isVideo = (url) => {
    if (url === null) return false;
    const videoExtensions = [".mp4", ".mov", ".webp", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const isAudio = (url) => {
    if (url === null) return false;
    const videoExtensions = [".mp3", ".m4a"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  }

  const getVideoDuration = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        resolve(duration);
      };
      video.onerror = reject;
  
      video.src = URL.createObjectURL(file);
    });
  };

  const upload = async (files) => {
    try {
      const uploadedUrls = await Promise.all(files.slice(0, 10).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await makeRequest.post("/upload", formData);
        return res.data;
      }));
      return uploadedUrls;
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.error) {
        // Handle specific error for video duration exceeding 1 minute
        setError(err.response.data.error);
      } else {
        // Handle other errors
        console.log(err);
      }
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
      return makeRequest.post("/posts/addPost", newPost);
    },
    onSuccess:
    () => {
        // invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (category === null || !category) {
      //setCategory("general");
      setError("no-category");
      return;
    }
    if (desc === "" && files.length === 0) return;
    if (files.length > 10) {
      setTooManyFiles(true);
      return;
    }
    setIsSubmitting(true);
  
    let imgUrls = [null, null, null, null, null, null, null, null, null, null];
    if (files.length > 0) {
      try {
        const uploadedUrls = await upload(files.slice(0, 10));
  
        uploadedUrls.forEach((url, index) => {
          if (url !== null) {
            imgUrls[index] = url;
          }
        });
      } catch (err) {
        console.error("Error uploading files:", err);
        setError("An error occurred during post creation.");
        setIsSubmitting(false);
      }
    }
    setError(false);
    setDisplayMessage(0);
    mutation.mutate({ desc, img0: imgUrls[0], img1: imgUrls[1], img2: imgUrls[2], img3: imgUrls[3], img4: imgUrls[4], img5: imgUrls[5], img6: imgUrls[6], img7: imgUrls[7], img8: imgUrls[8], img9: imgUrls[9], category, hasFlag: false, url });
    setDesc("");
    setGif(null);
    setURL("");
    setTooManyFiles(false);
    setIsSubmitting(false);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setFiles([]);
    },3000);
  };

  const handleX = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    if (files.length <= 10) setTooManyFiles(false);
  };

  const handleFileChange = async (e) => {
    if (files.length >= 10) {
      setTooManyFiles(true);
      return;
    }
    const selectedFiles = Array.from(e.target.files);
    for (let file of selectedFiles) {
      if (isVideo(file.name)) {
        try {
          const duration = await getVideoDuration(file);
          if (duration > 60) {
            setError("video-error");
            setDisplayMessage(1);
            return;
          }
          else {
            setDisplayMessage(0);
          }
        } catch (err) {
          console.error("error:", err);
        }
      }
      else if (isAudio(file.name)) {
        try {
          const duration = await getVideoDuration(file);
          if (duration > 60) {
            setError("audio-error");
            setDisplayMessage(1);
            return;
          }
          else {
            setDisplayMessage(0);
          }
        } catch (err) {
          console.error("error:", err);
        }
      }
    }
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setTimeout(() => {
      setActiveSlideIndex(activeSlideIndex+1);
    },600);
  };

  const getCarousel = () => {
    return(
      <div style={{flexWrap: "nowrap"}}>
        <ReactSimplyCarousel
          containerProps={{
            style: {
              display: "flex",
              alignItems: "center",
              margin: "auto",
              padding: "auto",
            }
          }}
          activeSlideIndex={activeSlideIndex}
          activeSlideProps={{
            marginBottom: 30,
          }}
          itemsToShow={1}
          itemsToScroll={1}
          swipeTreshold={20}
          onRequestChange={setActiveSlideIndex}
          forwardBtnProps={{
            children: <ArrowForwardIosIcon style={{color: "gray"}} fontSize="large"/>,
            className: "right-arrow"
          }}
          backwardBtnProps={{
            children: <ArrowBackIosNewIcon style={{color: "gray"}} fontSize="large"/>,
            className: "left-arrow"
          }}
          dotsNav={{
            show: true,
            itemBtnProps: {
              style: {
                height: 14,
                width: 14,
                borderRadius: "50%",
                border: 0,
                background: "lightgray",
                marginTop: 10,
                marginRight: 2,
                marginLeft: 2
              }
            },
            activeItemBtnProps: {
              style: {
                height: 14,
                width: 14,
                borderRadius: "50%",
                border: 0,
                background: "black",
                marginTop: 10,
                marginRight: 2,
                marginLeft: 2
              }
            }
          }}
          speed={400}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            > 
            {file.type.startsWith("image/") ? 
            <div> 
              <button className="x-carousel" style={{marginLeft: 300}} onClick={() => handleX(index)}>
                <DisabledByDefault style={{color: 'gray'}}/>
              </button>
              <img className="file" src={URL.createObjectURL(file)}/> 
            </div>
            
            : 
            <div>
              <button className="x-carousel" style={{marginLeft: 300}} onClick={() => handleX(index)}>
                <DisabledByDefault style={{color: 'gray'}}/>
              </button>
              <video controls>
                <source src={URL.createObjectURL(file)} className="file" type={"video/mp4"} />
                Your browser does not support the video tag.
              </video>
            </div>
            }
            </div>
          ))}
        </ReactSimplyCarousel>
      </div>
    )
  }

  const renderFilePreviews = () => {
    if (files.length > 1) {
      return getCarousel();
    }
    else if (files.length === 1) {
      return(
        <>
        <button className="x" style={{marginLeft: 300}} onClick={() => handleX(0)}>
          <DisabledByDefault style={{color: 'gray'}}/>
        </button>
        {files[0].type.startsWith("image/") ? (
          <img className="file" alt="" src={URL.createObjectURL(files[0])} />
          ) : 
          (
          <video className="file" controls>
            <source src={URL.createObjectURL(files[0])} type={"video/mp4"} />
            Your browser does not support the video tag.
          </video>
          )
        }
        </>
      )
    }
    else return;
  };

  return (
    <div className="share">
      {!currentUser ? 
          <div className="container">
            <div className="top">
              <img
                src={DefaultUser}
                alt=""
              />
              <span className="textInput">Howdy! To upload posts, please sign in or make an account.</span>
            </div>
            <div className="content" style={{marginTop: 50}}>
                <hr />
                <div className="row" style={{marginTop: 0}}>
                  <Link to={"/register"}>
                    <button className="guest-button">Learn More</button>
                  </Link>
                </div>
            </div>
          </div>
    : 
    isSubmitting && files.length !== 0 ?
    <div className="container" style={{display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none"}}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
        <h2 className="confirmationHeading" style={{margin: 0}}>{t('share.processingHeading')}</h2>
        <div className="loading-text" style={{margin: 0, marginLeft: 2}}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
      <div className="confirmationText" style={{textAlign: "center", margin: 5}}>
        <p>{t('share.processingText')}</p>
      </div>
      {files && files[0] &&
      <div style={{position: "relative"}}>
        {files[0].type.startsWith("image/") ? (
          <img className="filePreview" alt="" src={URL.createObjectURL(files[0])} />
          ) : 
          (
          <video controls className="filePreview">
            <source src={URL.createObjectURL(files[0]) + "#t=0.001"} type={"video/mp4"} />
            Your browser does not support the video tag.
          </video>
          )
        }
        <div className="loading-circle"></div>
      </div>
      }
    </div>
  :
    showConfirmation ?
    <div className="container" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <CheckCircleIcon style={{color: "grey", fontSize: "3em"}}/>
      <h2 className="confirmationHeading">{t('share.confirmationHeading')}</h2>
      <p className="confirmationText">{t('share.confirmationText')}</p>
      {/* <button className="confirmationButton" onClick={() => setShowConfirmation(false)}>{t('share.submitMore')}</button> */}
    </div>
  :
          <div className="container">
            <div className="top">
                <img
                  src={currentUser.profilePic}
                  alt=""
                />
                <TextareaAutosize
                  type="text" 
                  placeholder={t('share.sellItem')} 
                  onChange={e=>setDesc(e.target.value)} 
                  value={desc}
                  maxLength={500}
                />
            </div>
            
            <div className="middle">
              {renderFilePreviews()}
            </div>

            <div className="character-count"> 
              <span style={{ color: "darkgray", fontSize: 12 }}>{desc.length}</span>
              <span style={{color: "gray", fontSize: 12}}> / 500</span>
            </div>
            
            <hr />
            <div className="bottom">
              <div className="left">
                <div className="item">
                  <img src={Friend}/>
                  <Dropdown items={items}>
                    {({ isOpen, onClick}) => (
                      <button type="button" onClick={onClick} className={"category-label"}>
                        {category === null ? t('share.select') : category}
                      </button>
                    )}
                  </Dropdown>
                </div>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  accept=".png, .jpg, .jpeg, .mp4, .mp3, .mov, .m4a"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="file">
                  <div className="item">
                    <img src={Image} alt="" />
                    {files.length >= 1 ? <span>{t('share.addMore')}</span>
                    : <span>{t('share.add')}</span>
                    }
                  </div>
                </label>
                <label>
                  <div className="item">
                    <InsertLinkIcon style={{color: "gray"}}/>
                    <input
                      name="url"
                      type="text"
                      placeholder={t('share.url')}
                      value={url}
                      style={{border: "none", fontSize: 12, color: "blue"}}
                      onChange={e => setURL(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              <div className="right">
                <button onClick={handleClick} disabled={isSubmitting}> {isSubmitting ? t('share.uploading') : t('share.post') } </button>
              </div>
            </div>
            {tooManyFiles && <span className="error-msg">{t('share.ten')}</span>}
            {displayMessage === 1 && <span className="error-msg">{t('share.error')}</span>}
          </div>
    }
    </div>
  );
};

export default SubmitAd;
