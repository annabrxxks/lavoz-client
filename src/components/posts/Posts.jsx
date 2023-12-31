import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({userId, categories}) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts?userId="+userId).then((res) => {return res.data})
  });

  let filteredData;
  if (data && !isLoading) {
    if (categories && categories.length > 0) {
      // Filter posts based on the provided categories
      filteredData = data.filter((post) => categories.includes(post.category));
    } else {
      // If no categories are provided, show all posts
      filteredData = data;
    }
  }

  return(
    <div className="posts">
      { error ? "Something went wrong!" : 
        isLoading ? "loading" : 
        filteredData.map((post) => (<Post post={post} key={post.id} />))
      }
    </div>
  );
};

export default Posts;
