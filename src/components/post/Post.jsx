import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [reaction, setReaction] = useState(0);

  const containerStyle = {
    height: 0,
    paddingBottom: '25%',
    position: 'relative',
  };

  const iframeStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => {return res.data})
  });
  const queryClient = useQueryClient();
  

  const mutation = useMutation({
    mutationFn: () => {
      if (data && data.some((like) => like.userId === currentUser.id)) {
        makeRequest.delete("/likes?postId=" + post.id);
      }
      return makeRequest.post("/likes", { postId: post.id, reaction: reaction, postUserId: post.userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["likes"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });

  useEffect(() => {
    if (data && data.some((like) => like.userId === currentUser.id)) {
      const userReaction = data.find((like) => like.userId === currentUser.id).reaction;
      setReaction(userReaction);
    } else {
      setReaction(0);
    }
  }, [data, currentUser.id]);

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const isImage = (url) => {
    if (url === null) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };
  
  const isVideo = (url) => {
    if (url === null) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const handleSelect = (id) => {
    setReaction(id);
    mutation.mutate();
    setTimeout(() => {
      setReactionsOpen(false);
    }, 800);
  }

  const getReaction = (data) => {
    if (reaction === 0) return (process.env.PUBLIC_URL + "/reactions/add_emoji.png");
    else if (reaction === 1) return (process.env.PUBLIC_URL + "/reactions/thumbs_up.png");
    else if (reaction === 2) return (process.env.PUBLIC_URL + "/reactions/heart.png");
    else if (reaction === 3) return (process.env.PUBLIC_URL + "/reactions/applause.png");
    else if (reaction === 4) return (process.env.PUBLIC_URL + "/reactions/laughing.png");
    else if (reaction === 5) return (process.env.PUBLIC_URL + "/reactions/angry.png");
    else return (process.env.PUBLIC_URL + "/reactions/sad.png");
  }

  const getReactionText = () => {
    if (reaction === 0) return ("Reacciones");
    else if (reaction === 1) return ("Me gusta");
    else if (reaction === 2) return ("Me encanta");
    else if (reaction === 3) return ("Aplausos");
    else if (reaction === 4) return ("Riendo");
    else if (reaction === 5) return ("Enojado");
    else return ("Triste");
  }

  const getPostReactions = (id) => {
    return (data.filter(() => {if (reaction === id) return true;}).length);
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={process.env.PUBLIC_URL + "/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        
        <div className="content">
          <p>{post.desc}</p>
          {isImage(post.img) && <img src={process.env.PUBLIC_URL + `/upload/${post.img}`}/>}
          {isVideo(post.img) && (
            <video controls>
              <source src={process.env.PUBLIC_URL + `/upload/${post.img}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {post.gifUrl && 
          <div style={containerStyle}>
            <iframe
              src={post.gifUrl}
              width="100%"
              height="100%"
              style={iframeStyle}
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
              title="Giphy Embed"
            ></iframe>
            {/* <p>
              <a href={post.gifUrl}>
                via GIPHY
              </a>
            </p> */}
          </div>
          }
        </div>

        <div className="info">
        {reactionsOpen && 
          <div className={`reaction-container ${reactionsOpen ? 'show' : ''}`}>
            <div className='section'>
              <div className={`reaction ${reaction === 1 ? 'enlarged' : ''}`} onClick={() => handleSelect(1)}>
              <img src={process.env.PUBLIC_URL + "/reactions/thumbs_up.png"}/>
              </div>
              {getPostReactions(1)}
            </div>
            <div className='section'>
              <div className={`reaction ${reaction === 2 ? 'enlarged' : ''}`} onClick={() => handleSelect(2)}>
              <img src={process.env.PUBLIC_URL + "/reactions/heart.png"}/>
              </div>
              {getPostReactions(2)}
            </div>
            <div className='section'>
              <div className={`reaction ${reaction === 3 ? 'enlarged' : ''}`} onClick={() => handleSelect(3)}>
              <img src={process.env.PUBLIC_URL + "/reactions/applause.png"}/>
              </div>
              {getPostReactions(3)}
            </div>
            <div className='section'>
              <div className={`reaction ${reaction === 4 ? 'enlarged' : ''}`} onClick={() => handleSelect(4)}>
                <img src={process.env.PUBLIC_URL + "/reactions/laughing.png"}/>
              </div>
              {getPostReactions(4)}
            </div>
            {/* <div className='section'>
              <div className={`reaction ${reaction === 5 ? 'enlarged' : ''}`} onClick={() => handleSelect(5)}>
              <img src={process.env.PUBLIC_URL + "/reactions/angry.png"}/>
              </div>
              {getPostReactions(5)}
            </div>
            <div className='section'>
              <div className={`reaction ${reaction === 6 ? 'enlarged' : ''}`} onClick={() => handleSelect(6)}>
              <img src={process.env.PUBLIC_URL + "/reactions/sad.png"}/>
              </div>
              {getPostReactions(6)}
            </div> */}
          </div>
        }
        </div>
        <div className="info">
          <div className="item"
            onClick={()=>setReactionsOpen(!reactionsOpen)}
          >
            {/* {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            Love */}
            {isLoading ? ("loading") : 
            <div className="item"> 
            <img src={getReaction(data)}/>
            {getReactionText(data)}
            </div>
            }
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comentarios
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Compartir
          </div> */}
        </div>
        {commentOpen && <Comments post={post}/>}
      </div>
    </div>
  );
};

export default Post;
