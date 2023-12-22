import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import MostLiked from "../../components/posts/MostLiked";
import Post from "../../components/post/Post";
import "./news.scss"
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const News = () => {
  const { isLoading, error, data } = useQuery({
      queryKey: ["latestNews"],
      queryFn: () => makeRequest.get("/posts/latestNews").then((res) => {return res.data})
  });

  const [selectedCategories, setSelectedCategories] = useState(["local", "usa", "latam", "global"]);
  
  const handleCategoryPress = (category) => {
    switch (category) {
      case 'all':
        setSelectedCategories((prevCategories) => {
            if (prevCategories.length > 0) {
              return [];
            } 
            else {
              return["local", "usa", "latam", "global"]
            }
        });
        break;
      default:
        setSelectedCategories((prevCategories) => {
          if (prevCategories.includes(category)) {
            return prevCategories.filter((c) => c !== category);
          } else {
            return [...prevCategories, category];
          }
        });
    }
  };

  return (
    <div className="news">
        <div className="background">
            <h1 className="title">Noticias</h1>
            <span>Stay up-to-date with the latest news.</span>
        </div>
        <div className="news-container">
            <Share/>
            <h3 className="subtitle">Noticas de última hora</h3>
            <div className="grid">
                {!isLoading && data && data.map((post) => 
                    <div className="tile">
                        <Post post={post} key={post.id}/>
                    </div>
                )}
            </div>
            <div className="section">
                <h3 className="subtitle">Filter News by Category</h3>
                <div className="categories">
                    <button className={selectedCategories.length === 4 ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("all")}>
                        Todas Noticias
                        {selectedCategories.length === 4 && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("local") ? "widget" : "widget inactive"}  onClick = {() => handleCategoryPress('local')}>
                        Locales
                        {selectedCategories.includes("local") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("usa") ? "widget" : "widget inactive"}   onClick = {() => handleCategoryPress('usa')}>
                        Estados Unidos
                        {selectedCategories.includes("usa") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("latam") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('latam')}>
                        Latinoamerica
                        {selectedCategories.includes("latam") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("global") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('global')}>
                        Global
                        {selectedCategories.includes("global") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                </div>
                <Posts categories={selectedCategories}/>
            </div>
        </div>
    </div>
  )
}

export default News