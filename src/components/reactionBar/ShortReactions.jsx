import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useState, useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import RecommendIcon from '@mui/icons-material/Recommend';
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import XIcon from "@mui/icons-material/X";
import './reactions.scss';

const ShortReactions = ({ shortId, shortUserId, currentUser }) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [reactionsOpen, setReactionsOpen] = useState(false);
    const [reaction, setReaction] = useState(0);
    const [rated, setRated] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const navigate = useNavigate();
    

    const url = () => {
      return `https://www.postsstation.com/post/${shortId}`
    }

    let { isLoading, error, data } = useQuery({
      queryKey: ["shortLikes", shortId],
      queryFn: () => makeRequest.get("/likes/shorts?shortId=" + shortId).then((res) => {return res.data})
    });

    const getPostReactions = (id) => {
      if (!data || error) return -1;
      return data.filter((like) => like.reaction === id).length;
    };

    const getReactionText = () => {
      if (reaction === 0) return (<span>{t('reactions.reactions')}</span>);
      else if (reaction === 1) return (<span>{t('reactions.like')}</span>);
      else if (reaction === 2) return (<span>{t('reactions.love')}</span>);
      else if (reaction === 3) return (<span>{t('reactions.applause')}</span>);
      else if (reaction === 4) return (<span>{t('reactions.laughing')}</span>);
      else if (reaction === 5) return (<span>{t('reactions.wow')}</span>);
      else if (reaction === 6) return (<span>{t('reactions.highfive')}</span>);
      else return ("Triste");
    }

    useEffect(() => {
      if (!currentUser) return;
      if (data) {
        const hasReacted = data.some((like) => like.userId === currentUser.id);
        setRated(hasReacted);
      }
    }, [data, currentUser]);

    useEffect(() => {
      if (!currentUser) return;
      if (data && data.some((like) => like.userId === currentUser.id)) {
        const userReaction = data.find((like) => like.userId === currentUser.id).reaction;
        setReaction(userReaction);
      } else {
        setReaction(0);
      }
    }, [data, currentUser]);

    const mutation = useMutation({
      mutationFn: async () => {
        if (!currentUser) return;
        const hasReacted = data.some((like) => like.userId === currentUser.id);
  
        if (hasReacted) {
          await makeRequest.delete('/likes/shorts?shortId=' + shortId);
        }

        return makeRequest.post('/likes/shorts', { shortId, reaction: reaction, shortUserId: shortUserId });
      },
      onSuccess: () => {
        // Close reactions after a short delay
        setTimeout(() => {
          setReactionsOpen(false);
        }, 800);
        queryClient.invalidateQueries(['shortLikes']);
      },
    });

    const deleteLikeMutation = useMutation({
      mutationFn: () => {
        return makeRequest.delete("/likes/shorts?shortId=" + shortId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["shortLikes"]);
      },
    });

    const handleSelect = (id) => {
      if (!currentUser) {
        navigate("/guest");
        return;
      }
      setReaction(id);
  
      if (rated && reaction === id) {
        // User has already reacted, delete the existing reaction
        deleteLikeMutation.mutate();
      } else {
        // User has not reacted, add the new reaction
        mutation.mutate();
      }
  
      // Close reactions after a short delay
      setTimeout(() => {
        setReactionsOpen(false);
      }, 800);
    };

    const getReaction = () => {
      if (reaction === 0) return (<RecommendIcon className={'icon'}/>);
      else if (reaction === 1) return (<img src={'https://www.postsstation.com/reactions/thumbs_up.png'}/>);
      else if (reaction === 2) return (<img src={'https://www.postsstation.com/reactions/heart.png'}/>);
      else if (reaction === 3) return (<img src={'https://www.postsstation.com/reactions/applause.png'}/>);
      else if (reaction === 4) return (<img src={'https://www.postsstation.com/reactions/laughing.png'}/>);
      else if (reaction === 5) return (<img src={'https://www.postsstation.com/reactions/wow.png'}/>);
      else if (reaction === 6) return (<img src={'https://www.postsstation.com/reactions/high-five.png'}/>);
      else return (process.env.PUBLIC_URL + "/reactions/sad.png");
    }

    const open = (id) => {
      if (id === 0) {
        if (shareOpen === true) setShareOpen(false);
        setReactionsOpen(!reactionsOpen);
        
      }
      else {
        if (reactionsOpen === true) setReactionsOpen(false);
        setShareOpen(!shareOpen);
      }
    }

    return(
      <div className="reactions-share" style={{marginTop: 10}}>
        <div className="reactions">
          <div className="closed-reaction-menu" onClick={() => open(0)}>
              {
              isLoading ? ("loading") 
              : 
              <div className="item" style={{gap: 10, display: 'flex', alignItems: 'center'}}> 
                  {getReaction(data)}
                  {getReactionText(data)}
              </div>
              }
          </div>
          <div>
          {reactionsOpen &&
            <div className={`reaction-container ${reactionsOpen ? 'show' : ''}`}>
                <div className='section'>
                <div className={`reaction ${reaction === 1 ? 'enlarged' : ''}`} onClick={() => handleSelect(1)}>
                    <div className="reaction-icon">
                    <img className="reaction-img" src={'https://www.postsstation.com/reactions/thumbs_up.png'}/>
                    <div className="label">{t('reactions.like')}</div>
                    </div>
                </div>
                {getPostReactions(1)}
                </div>
                <div className='section'>
                <div className={`reaction ${reaction === 2 ? 'enlarged' : ''}`} onClick={() => handleSelect(2)}>
                    <div className="reaction-icon">
                    <img src={'https://www.postsstation.com/reactions/heart.png'} className="reaction-img" />
                    <div className="label">{t('reactions.love')}</div>
                    </div>
                </div>
                {getPostReactions(2)}
                </div>
                <div className='section'>
                <div className={`reaction ${reaction === 3 ? 'enlarged' : ''}`} onClick={() => handleSelect(3)}>
                    <div className="reaction-icon">
                    <img src={'https://www.postsstation.com/reactions/applause.png'} className="reaction-img" />
                    <div className="label">{t('reactions.applause')}</div>
                    </div>
                </div>
                {getPostReactions(3)}
                </div>
                <div className='section'>
                <div className={`reaction ${reaction === 4 ? 'enlarged' : ''}`} onClick={() => handleSelect(4)}>
                    <div className="reaction-icon">
                    <img src={'https://www.postsstation.com/reactions/laughing.png'} className="reaction-img" />
                    <div className="label">{t('reactions.laughing')}</div>
                    </div>
                </div>
                {getPostReactions(4)}
                </div>
                <div className='section'>
                <div className={`reaction ${reaction === 5 ? 'enlarged' : ''}`} onClick={() => handleSelect(5)}>
                    <div className="reaction-icon">
                    <img src={'https://www.postsstation.com/reactions/wow.png'} className="reaction-img" />
                    <div className="label">{t('reactions.wow')}</div>
                    </div>
                </div>
                {getPostReactions(5)}
                </div>
                <div className='section'>
                <div className={`reaction ${reaction === 6 ? 'enlarged' : ''}`} onClick={() => handleSelect(6)}>
                    <div className="reaction-icon">
                    <img src={'https://www.postsstation.com/reactions/high-five.png'} className="reaction-img" />
                    <div className="label">{t('reactions.highfive')}</div>
                    </div>
                </div>
                {getPostReactions(6)}
                </div>
            </div>
          }
          </div>
        </div>

        {/* <div className="share-icons">
          <div className="closed-reaction-menu" onClick={() => open(1)}>
            <div className="item">
              <ShareOutlinedIcon />
              {t('post.share')}
            </div>
          </div>

          <div>
          {shareOpen &&
            <div className={`reaction-container ${shareOpen ? 'show' : ''}`}>
              <div className="section">
                <div className="reaction">
                  <a
                    className="twitter-share-button"
                    style={{ color: "inherit" }}
                    href={`https://twitter.com/intent/tweet?text=Check%20this%20out%20on%20Postsstation:&url=${encodeURIComponent(url())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  > 
                    <XIcon/>
                  </a>
                </div>
              </div>
              <div className="section">
                <div className="reaction">
                  <a
                    className="facebook-share-button"
                    style={{ color: "inherit" }}
                    href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(url())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  > 
                    <FacebookTwoToneIcon style={{ color: '#0572e6' }}/>
                  </a>
                </div>
              </div>
              <div className='section'>
                <div className={'reaction'}>
                  <a style={{color: "inherit"}}
                    href={`https://api.whatsapp.com/send?text=Check%20this%20out%20on%20PostStation%20${encodeURIComponent(url())}`} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon style={{backgroundColor: "#38d672", padding: 1, borderRadius: 10, color: 'white'}}/>
                  </a>
                </div>
              </div>
            </div>
          }
          </div>
        </div> */}
      </div>
    )
}

export default ShortReactions;