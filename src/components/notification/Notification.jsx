import { useContext, useState } from "react";
import "./notification.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Notification = ({ notification }) => {
    const { t, i18n } = useTranslation();
    const { currentUser } = useContext(AuthContext);
    
    const type = notification.type;

    // get post by id
    const { isLoading, error, data } = useQuery({
        queryKey: ["post"],
        queryFn: () => makeRequest.get("/posts/find?id=" + notification.postId).then((res) => {return res.data})
    });

    const buildNotif = () => {
        if (type == 'reaction') {
            return(
                <Link to={"/post/"+notification.postId} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="notif">
                        <div className="pfp">
                            <img src={notification.profilePic}/>
                            <div className="text">
                                <span>{notification.name} {t('notifs.reaction')}</span>
                                <span className="date">{moment(notification.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        {/* <div className="post">
                            <img src={getPostImg()}/>
                        </div> */}
                    </div>
                </Link>
            )
        }
        else if (type == 'follow') {
            return(
                <Link to={"/profile/"+notification.userFrom} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="notif">
                        <div className="pfp">
                            <img src={notification.profilePic}/>
                            <div className="text">
                                <span>{notification.name} {t('notifs.follow')}</span>
                                <span className="date">{moment(notification.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        }
        else if (type == 'comment') {
            return(
                <Link to={"/post/"+notification.postId} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="notif">
                    <div className="pfp">
                        <img src={notification.profilePic}/>
                        <div className="text">
                            <span>{notification.name} {t('notifs.comment')}</span>
                            <span className="date">{moment(notification.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    {/* <div className="post">
                        <img src={getPostImg()}/>
                    </div> */}
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
