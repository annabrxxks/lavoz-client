import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const MostLiked = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["topPosts"],
    queryFn: () => makeRequest.get("/posts/top").then((res) => {return res.data})
  });

  return(
        <div className="grid">
        { error ? "Something went wrong!" : 
            isLoading || !data ? "loading" : 
            data.map((post) => (<Post post={post} key={post.id} />))
        }
        </div>
  );
};

export default MostLiked;
