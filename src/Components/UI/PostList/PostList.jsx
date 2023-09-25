import PostItem from "../PostItem/PostItem"

const PostList = ({postsArray}) => {
  return (
    postsArray.map(post => 
      <PostItem post={post} key={post.url}/>  
    )
  )
}

export default PostList