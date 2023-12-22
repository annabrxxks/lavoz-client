import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import MostLiked from "../../components/posts/MostLiked";
import Post from "../../components/post/Post";
import "./tamu.scss"
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Tamu = () => {
  const [selectedCategories, setSelectedCategories] = useState(["tamu", "games"]);
  const handleCategoryPress = (category) => {
    setSelectedCategories((prevCategories) => {
        if (prevCategories.includes(category)) {
        return prevCategories.filter((c) => c !== category);
        } else {
        return [...prevCategories, category];
        }
    });
  };

  return (
    <div className="tamu">
        <div className="background">
            <h1 className="title">Universidad Texas A&M</h1>
            <span>Stay connected with your fellow Aggies.</span>
        </div>
        <div className="news-container">
            <Share/>
            <div className="section">
                <h3 className="subtitle">Filter Posts by Category</h3>
                <div className="categories">
                    <button className={selectedCategories.includes("tamu") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("tamu")}>
                        Universidad Texas A&M
                        {selectedCategories.includes("tamu") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("games") ? "widget" : "widget inactive"}  onClick = {() => handleCategoryPress('games')}>
                        Juegos de los Aggies
                        {selectedCategories.includes("games") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                </div>
                <Posts categories={selectedCategories}/>
            </div>
        </div>
    </div>
  )
}

export default Tamu;