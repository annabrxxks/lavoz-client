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
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const News = () => {
  const { t, i18n } = useTranslation();
  const { isLoading, error, data } = useQuery({
      queryKey: ["latestNews"],
      queryFn: () => makeRequest.get("/posts/latestNews").then((res) => {return res.data})
  });

  const [selectedCategories, setSelectedCategories] = useState(["local", "usa", "latam", "global", "news"]);
  
  const handleCategoryPress = (category) => {
    switch (category) {
      case 'all':
        setSelectedCategories((prevCategories) => {
            if (prevCategories.length > 0) {
              return [];
            } 
            else {
              return["local", "usa", "latam", "global", "news"]
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
            <h1 className="title">{t('categories.news')}</h1>
            <span>{t('otherPages.news')}</span>
        </div>
        <div className="news-container">
            <Share categ={null}/>
            <div className="section" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              {i18n.language == 'en' ? 
                <iframe width="1000" height="440"  src="https://rss.app/embed/v1/carousel/_uyYrMmgWWaF69e0M" frameborder="0"></iframe>
              :
                <iframe width="1000" height="440"  src="https://rss.app/embed/v1/carousel/_EeLNdyLLpuYAovrj" frameborder="0"></iframe>
              }
            </div>
            <div className="section">
                <h3 className="subtitle">{t('otherPages.filterNews')}</h3>
                <div className="categories">
                    <button className={selectedCategories.length === 5 ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("all")}>
                        {t('categories.all')}
                        {selectedCategories.length === 5 && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("local") ? "widget" : "widget inactive"}  onClick = {() => handleCategoryPress('local')}>
                        {t('categories.local')}
                        {selectedCategories.includes("local") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("usa") ? "widget" : "widget inactive"}   onClick = {() => handleCategoryPress('usa')}>
                        {t('categories.us')}
                        {selectedCategories.includes("usa") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("latam") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('latam')}>
                        {t('categories.latam')}
                        {selectedCategories.includes("latam") && <DisabledByDefaultIcon fontSize="small"/>}
                    </button>
                    <button className={selectedCategories.includes("global") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('global')}>
                        {t('categories.global')}
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