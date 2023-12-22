import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import MostLiked from "../../components/posts/MostLiked"
import "./home.scss"
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useState } from "react";

const Home = () => {
  
  const [selectedCategories, setSelectedCategories] = useState(["news", "local", "usa", "latam", "global", "hora", 
                                                                "market", "jobs", "events", 
                                                                "tamu", "games",
                                                                "greatThings", "more", "general"]);
  const handleCategoryPress = (category) => {
    switch (category) {
      case 'all':
        setSelectedCategories((prevCategories) => {
            if (prevCategories.length > 0) {
              return [];
            } 
            else {
              return["news", "local", "usa", "latam", "global", "hora", 
                     "market", "jobs", "events", 
                     "tamu", "games",
                     "greatThings", "more", "general"
                    ]
            }
        });
        break;
      case 'news':
        setSelectedCategories((prevCategories) => {
          if (prevCategories.includes('news')) {
            // If "Noticias" is already selected, remove it along with its subcategories
            return prevCategories.filter((c) => !['news', 'local', 'usa', 'latam', 'global', 'hora'].includes(c));
          } else {
            // If "Noticias" is not selected, add it along with its subcategories
            return [...prevCategories, 'news', 'local', 'usa', 'latam', 'global', 'hora'];
          }
        });
        break;
      case 'market':
        setSelectedCategories((prevCategories) => {
          if (prevCategories.includes('market')) {
            return prevCategories.filter((c) => !['market', 'jobs', 'events'].includes(c));
          } else {
            return [...prevCategories, 'market', 'jobs', 'events'];
          }
        });
        break;
      case 'tamu':
        setSelectedCategories((prevCategories) => {
          if (prevCategories.includes('tamu')) {
            return prevCategories.filter((c) => !['tamu', 'games'].includes(c));
          } else {
            return [...prevCategories, 'tamu', 'games'];
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
    <div className="home">
      <Stories/>
      <Share/>
      <h3 className="title">This Week's Top Posts</h3>
      <MostLiked/>
      <h3 className="title">Filter Posts by Category</h3>
      <div className="categories">
        <button className={selectedCategories.length === 14 ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("all")}>
          Todo
          {selectedCategories.length === 14 && <DisabledByDefaultIcon fontSize="small"/>}
        </button>

        <button className={selectedCategories.includes("news") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('news')}>
          Noticias
          {selectedCategories.includes("news") && <DisabledByDefaultIcon fontSize="small"/>}
        </button>
      
        <button className={selectedCategories.includes("market") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('market')}>
          MarketStation
          {selectedCategories.includes("market") && <DisabledByDefaultIcon fontSize="small"/>}
        </button>

        <button className={selectedCategories.includes("tamu") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('tamu')}>
          Universidad Texas A&M
          {selectedCategories.includes("tamu") && <DisabledByDefaultIcon fontSize="small"/>}
        </button>
        <button className={selectedCategories.includes("greatThings") ? "widget" : "widget inactive"}  onClick = {() => handleCategoryPress('greatThings')}>
          Great Things
          {selectedCategories.includes("greatThings") && <DisabledByDefaultIcon fontSize="small"/>}
        </button>
        <button className={selectedCategories.includes("more") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('more')}>
          Descubre Mas
          {selectedCategories.includes("more") && <DisabledByDefaultIcon fontSize="small"/>}
        </button>
        <button className={selectedCategories.includes("general") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('general')}>
          General
          {selectedCategories.includes("general") && <DisabledByDefaultIcon fontSize="small"/>}
        </button>
        </div>
        {selectedCategories.includes("news") && 
        <div className="categories">
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
          <button className={selectedCategories.includes("hora") ? "widget" : "widget inactive"}  onClick = {() => handleCategoryPress('hora')}>
            Noticias de última hora
            {selectedCategories.includes("hora") && <DisabledByDefaultIcon fontSize="small"/>}
          </button>
        </div>
      }

      {selectedCategories.includes("market") && 
        <div className="categories">
          <button className={selectedCategories.includes("events") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('events')}>
            Events
            {selectedCategories.includes("events") && <DisabledByDefaultIcon fontSize="small"/>}
          </button>
          <button className={selectedCategories.includes("jobs") ? "widget" : "widget inactive"} onClick = {() => handleCategoryPress('jobs')}>
            Empleos
            {selectedCategories.includes("jobs") && <DisabledByDefaultIcon fontSize="small"/>}
          </button>
        </div>
      }

      {selectedCategories.includes("tamu") && 
        <div className="categories">
          <button className={selectedCategories.includes("games") ? "widget" : "widget inactive"}  onClick = {() => handleCategoryPress('games')}>
            Juegos de los Aggies
            {selectedCategories.includes("games") && <DisabledByDefaultIcon fontSize="small"/>}
          </button>
        </div>
      }
      <Posts categories={selectedCategories}/>
    </div>
  )
}

export default Home