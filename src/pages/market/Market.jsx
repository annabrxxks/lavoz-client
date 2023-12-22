import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import MostLiked from "../../components/posts/MostLiked";
import Post from "../../components/post/Post";
import "./market.scss"
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import {  useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import SubmitEvent from "../../components/event/SubmitEvent";
import SubmitJob from "../../components/jobs/SubmitJob";
import Event from "../../components/event/Event";
import { AuthContext } from "../../context/authContext";
import Job from "../../components/jobs/Job";
import TextField from "@mui/material/TextField";

const Market = () => {
  const [tab, setTab] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [selectedCategories, setSelectedCategories] = useState(["construction", "gardener", "housekeeping", "janitor", "restaurant", "general", "temporary"]);
  const [jobInput, setJobInput] = useState("");

//   let jobInputHandler = (e) => {
//     var lowerCase = e.target.value.toLowerCase();
//     setJobInput(lowerCase);
//   };

  const handleCategoryPress = (category) => {
    switch (category) {
      case 'all':
        setSelectedCategories((prevCategories) => {
            if (prevCategories.length > 0) {
              return [];
            } 
            else {
              return["construction", "gardener", "housekeeping", "janitor", "restaurant", "general", "temporary"]
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

  const { isLoading, error, data } = useQuery({
      queryKey: ["events"],
      queryFn: () => makeRequest.get("/posts/events").then((res) => {return res.data})
  });
  const { isLoading: isJobsLoading, error: jobError, data: jobData } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => makeRequest.get("/posts/jobs").then((res) => {return res.data})
  });

  let filteredData;
  if (jobData && !isJobsLoading) {
    if (selectedCategories && selectedCategories.length > 0) {
      // Filter posts based on the provided categories
      filteredData = jobData.filter((job) => selectedCategories.includes(job.category));
    } else {
      // If no categories are provided, show all posts
      filteredData = jobData;
    }
  }


  return (
    <div className="market">
        <div className="background">
            <h1 className="title">MarketStation</h1>
            <div className="text-container">
                <div className="text-content">
                    <span>Submit events, job postings, or ads for your business.</span>
                </div>
            </div>
        </div>
        <div className="tabs">
            <button className={tab == 0 ? "tab selected" : "tab"} onClick={() => setTab(0)}>Events</button>
            <button className={tab == 1 ? "tab selected" : "tab"} onClick={() => setTab(1)}>Empleos</button>
            {/* <button className={tab == 2 ? "tab selected" : "tab"} onClick={() => setTab(2)}>Anuncios</button> */}
        </div>
        <div className="market-container">
            {tab == 0 &&
            <div>
                <div className="centered">
                    <SubmitEvent/>
                </div>
                <h3 className="subtitle">Upcoming Events</h3>
                <div className="grid">
                    {!isLoading && data && data.map((post) => 
                        <Event event={post} key={post.id}/>
                    )}
                </div>
                <div className="section">
                    <h3 className="subtitle">Posts</h3>
                    <div style={{marginBottom: 20}}/>
                    <Share/>
                    <Posts categories={["events"]}/>
                </div>  
            </div>   
            }
            {tab == 1 &&
            <div>
            <div className="centered">
                <SubmitJob/>
            </div>
            <h3 className="subtitle">Find a Job</h3>
            <h4 className="smaller">Filter Jobs by Category</h4>
            <div className="categories">
                <button className={selectedCategories.length === 7 ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("all")}>
                    Todo
                    {selectedCategories.length === 7 && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("construction") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("construction")}>
                    Construccion
                    {selectedCategories.includes("construction") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("gardener") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("gardener")}>
                    Jardineria
                    {selectedCategories.includes("gardener") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("housekeeping") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("housekeeping")}>
                    Housekeeping
                    {selectedCategories.includes("housekeeping") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("janitor") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("janitor")}>
                    Janitorial Service
                    {selectedCategories.includes("janitor") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("restaurant") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("restaurant")}>
                    Restaurante
                    {selectedCategories.includes("restaurant") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("general") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("general")}>
                    General
                    {selectedCategories.includes("general") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
                <button className={selectedCategories.includes("temporary") ? "widget" : "widget inactive"} onClick={() => handleCategoryPress("temporary")}>
                    Empleos Temporales
                    {selectedCategories.includes("temporary") && <DisabledByDefaultIcon fontSize="small"/>}
                </button>
            </div>
            {/* <div className="search">
                  <TextField
                      id="outlined-basic"
                      onChange={jobInputHandler}
                      variant="outlined"
                      fullWidth
                      label="Search"
                  />
            </div> */}
            <div className="grid">
                    {!isJobsLoading && filteredData && filteredData.map((post) => 
                        <Job job={post} key={post.id}/>
                    )}
                </div>
                <div className="section">
                    <h3 className="subtitle">Posts</h3>
                    <div style={{marginBottom: 20}}/>
                    <Share/>
                    <Posts categories={["jobs"]}/>
                </div> 
            </div>
            }
            {tab == 2 && 
              <div>
                <Share/>
                <Posts categories={["ads"]}/>
              </div>
            }
        </div>
    </div>
  )
}

export default Market;