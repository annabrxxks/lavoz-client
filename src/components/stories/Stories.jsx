import { useContext, useState } from "react";
import "./stories.scss"
import { AuthContext } from "../../context/authContext"
import Image from "../../assets/img.png";
import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios"

const Stories = () => {

  const {currentUser} = useContext(AuthContext);
  const [shareOpen, setShareOpen] = useState(false);
  const [file,setFile] = useState(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => {return res.data})
  });

  console.log(data)

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStory)=>{
      return makeRequest.post("/stories", newStory);
    },
    onSuccess:
    () => {
        // invalidate and refetch
        queryClient.invalidateQueries(["stories"]);
      },
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ img: imgUrl });
    setFile(null);
    setShareOpen(false);
  };
  

  return (
    <div className="stories">
      {!isLoading && data &&
      <div className="story">
        <img src={process.env.PUBLIC_URL + "/upload/" + currentUser.profilePic} alt="" />
        <button className={data.length < 5 && "lower"} onClick = {() => {setShareOpen((true))}}>+</button>
      </div>
      }
      {!isLoading && data && data.map(story=>(
        <div className="story" key={story.id}>
          <img src={process.env.PUBLIC_URL + "/upload/" + story.img} alt="" />
          <span className={data.length < 5 && "lower"}>{story.name}</span>
        </div>
      ))}
      {shareOpen && 
      <div className="share">
        <div className="wrapper">
          <button className="close" onClick = {() => setShareOpen(false)}>x</button>
          <h2>Upload a Story</h2>
          <span>Stories are visible for 24 hours before they disappear!</span>
          {file && (
            <>
              {file.type.startsWith("image/") ? (
                <img className="file" alt="" src={URL.createObjectURL(file)} />
              ) : (
                <video className="file" controls>
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}
          <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="file">
            <div className="item">
              <img src={Image} alt="" />
              <span>Choose Image/Video</span>
            </div>
          </label>
          {file && <button className="post" onClick={handleClick}>Post</button>}
        </div>
      </div>
      }
    </div>
  )
}

export default Stories