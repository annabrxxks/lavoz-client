import { useContext, useState, useEffect } from "react";
import "./notification.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const Notification = ({ notification }) => {
    const { t, i18n } = useTranslation();
    const { currentUser } = useContext(AuthContext);
    const [fetchedData, setFetchedData] = useState('');

    const type = notification.type;

    // get post by id
    const { isLoading, error, data } = useQuery({
        queryKey: ["post"],
        queryFn: () => makeRequest.get("/posts/find?id=" + notification.postId).then((res) => {return res.data})
    });

    useEffect(() => {
        getObject();
    }, [notification]);

    const getObject = async () => {
        let url = '';
        if (type === "comment") {
            url = `/comments/desc?commentId=${notification.objectId}`;
        } else if (type === "reaction") {
            url = `/likes/single?reactionId=${notification.objectId}`;
        }
    
        if (url && url != '') {
            try {
                const response = await makeRequest.get(url);
                const data = response.data;
                setFetchedData(data);
            } catch (error) {
                console.error("There was an error fetching the data:", error);
            }
        }
    };

    const displayReaction = () => {
        if (fetchedData && fetchedData[0]) {
            if (fetchedData[0].reaction === 1) return (<img className="reaction" src={`${process.env.PUBLIC_URL}/reactions/thumbs_up.png`}/>);
            else if (fetchedData[0].reaction === 2) return (<img className="reaction" src={`${process.env.PUBLIC_URL}/reactions/heart.png`}/>);
            else if (fetchedData[0].reaction === 3) return (<img className="reaction" src={`${process.env.PUBLIC_URL}/reactions/applause.png`}/>);
            else if (fetchedData[0].reaction === 4) return (<img className="reaction" src={`${process.env.PUBLIC_URL}/reactions/laughing.png`}/>);
            else if (fetchedData[0].reaction === 5) return (<img className="reaction" src={`${process.env.PUBLIC_URL}/reactions/wow.png`}/>);
            else if (fetchedData[0].reaction === 6) return (<img className="reaction" src={`${process.env.PUBLIC_URL}/reactions/high-five.png`}/>);
            else return (process.env.PUBLIC_URL + "/reactions/sad.png");
        }
    }

    const displayComment = () => {
        if (fetchedData && fetchedData[0] && fetchedData[0].desc != '') {
            return `"${fetchedData[0].desc.slice(0, 200)}"`;
        }
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: () => {
        return makeRequest.put('/notifications/clearAlert', {id: notification.id});
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['newNotifications']);
      },
    });

    useEffect(() => {
        // Call the API endpoint if notification.new is true
        if (notification.new) {
            const timer = setTimeout(() => {
                mutation.mutate(notification);
            }, 10000); // Delay in milliseconds (20000ms = 20s)

            // Cleanup function to clear the timeout if the component unmounts
            // or if the effect runs again before the timeout is completed.
            return () => clearTimeout(timer);
        }
    }, [notification, mutation]);

    const buildNotif = () => {
        if (type === 'reaction') {
            return(
                <Link to={"/post/"+notification.postId} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="notif">
                        <div className="notifRow">
                            <div className="pfp">
                                <img className="profilePic" src={notification.profilePic}/>
                                <div className="text">
                                    <div>
                                        <span>{notification.name} {t('notifs.reaction')}</span>
                                        {displayReaction()}
                                        <span>{t('notifs.topost')}</span>
                                    </div>
                                    <span className="date">{moment(notification.createdAt).fromNow()}</span>
                                </div>
                            </div>
                            {notification.new === 1 && 
                            <FiberManualRecordIcon style={{color: "red", marginRight: 15}} fontSize="small"/>
                            }
                        </div>
                    </div>
                </Link>
            )
        }
        else if (type === 'follow') {
            return(
                <Link to={"/profile/"+notification.userFrom} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="notif">
                        <div className="notifRow">
                            <div className="pfp">
                                <img className="profilePic" src={notification.profilePic}/>
                                <div className="text">
                                    <span>{notification.name} {t('notifs.follow')}</span>
                                    <span className="date">{moment(notification.createdAt).fromNow()}</span>
                                </div>
                            </div>
                            {notification.new === 1 && 
                                <FiberManualRecordIcon style={{color: "red", marginRight: 15}} fontSize="small"/>
                            }
                        </div>
                    </div>
                </Link>
            )
        }
        else if (type === 'comment') {
            return(
                <Link to={"/post/"+notification.postId+'/open'} style={{ textDecoration: "none", color: "inherit" }}>
                <div className= "notif">
                    <div className="notifRow">
                        <div className="pfp">
                            <img className="profilePic" src={notification.profilePic}/>
                            <div className="text">
                                <span>{notification.name} {t('notifs.comment')}</span>
                                <span className="date">{moment(notification.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        {notification.new === 1 && 
                            <FiberManualRecordIcon style={{color: "red", marginRight: 15}} fontSize="small"/>
                        }
                    </div>
                    <div className = "comment-desc">
                        {displayComment()}
                    </div>
                </div>
                </Link>
            )
        }
    }

    const getPostImg = () => {
        if (!isLoading && data != undefined) {
            return (data[0].img);
        }
        else {
            return ("./upload/1698694066104pusheen.png")
        }
    }

    return (
        <div>
        {isLoading ? "isLoading" :
            <div>
                {buildNotif()}
            </div>
        }
        </div>
    )
};

export default Notification;
