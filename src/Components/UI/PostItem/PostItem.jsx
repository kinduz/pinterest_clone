import { Link } from "react-router-dom";
import { AiOutlineZoomIn } from 'react-icons/ai'
import MyButton from "../Button/MyButton";
import { useRef } from "react";

const PostItem = ({post}) => {

  const imgRef = useRef(null)

  const downloadPin = (e) => {
    e.preventDefault()
    const imageURL = imgRef.current.src;
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'image.jpg';
    link.click();
  }

  return (
    <Link className="post" to={`../post/${post.id}`}>
      <div className="img__cover"/>
      <div className="img__btns">
        <AiOutlineZoomIn fontSize='64px' color="#FFF"/>
        <MyButton clickFunction={(e) => downloadPin(e)} text='Скачать пин' backColor='red' textColor='#FFF'/>    
      </div>
      <img src={post.url} alt="" ref={imgRef} />
    </Link>
  )
}        


export default PostItem