import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Post from "../../components/post/Post";
import Share from "../../components/share/Share"
import "./postpage.scss"
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";

const PostPage = () => {
  const queryClient = useQueryClient();
  const postId = parseInt(useLocation().pathname.split("/")[2]); 

  const { isLoading, error, data } = useQuery({
    queryKey: ["post"],
    queryFn: () => makeRequest.get("/posts/find?id=" + postId).then((res) => {return res.data})
  });
  
  return (
    <div className="home">
    {isLoading ? "loading" :
      (data.length > 0 ? <Post post={data[0]} /> : "post has been deleted")
    }
    </div>
  )
}

export default PostPage;