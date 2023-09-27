import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import MyButton from "../Components/UI/Button/MyButton";
import {useGetCollection} from '../hooks/useGetCollection'
import UserInfo from '../Components/UI/UserInfo/UserInfo'
import MyLoading from '../Components/UI/Loading/MyLoading'
import { useConvertTime } from "../hooks/useConvertTime";
import {BsTrash} from 'react-icons/bs'
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AiFillEdit } from "react-icons/ai";

const CurrentPost = () => {
  const navigate = useNavigate()

  const params = useParams();
  const posts = useSelector((state) => state.posts.posts);
  const email = localStorage.getItem("email")

  const [postId, setPostId] = useState(null);
  const [userPost, setUserPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const imgRef = useRef(null)

  const users = useGetCollection("users")
  const date = useConvertTime(postId?.creationDate)
  const editDate = useConvertTime(postId?.editDate)

  useEffect(() => {
    if (users && postId) {
      document.title = postId.title;
      setUserPost(users.find(user => user.email === postId.authorEmail))
    }
  }, [users, postId])

  useEffect(() => {
    if (posts) setPostId(posts.find((post) => post.id === params.id));
  }, [posts]);

  useEffect(() => {
    if (userPost) setIsLoading(false)
  }, [userPost])

  const editPost = () => {
    navigate('/make-pin', {state: {value: postId}, replace: true})
  }

  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', postId.id)).then((res) => {
      setTimeout(() => {
        navigate('/posts', {replace: true})
      }, 1000)
    })
    .catch(() => {
      console.error();
    })
  }


  const downloadPin = (e) => {
    e.preventDefault()
    const imageURL = imgRef.current.src;
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'image.jpg';
    link.click();
  }

  return (
    <div>
      {isLoading ? (
        <MyLoading/>
      ) : (
        <div className="pin__container">
          <div className="pin__form  current__pin">
            <div className="pin__media">
              {userPost.email === email && 
                <>
                  <MyButton clickFunction={editPost} text={<AiFillEdit/>} textColor='#000' backColor='#FFF'/>
                  <MyButton clickFunction={deletePost} text={<BsTrash/>} textColor='#FFF' backColor='red'/>
                </>
              }
              <img src={postId.url} alt="" ref={imgRef}/>
            </div>
            <div className="pin__info">
              <div className="pin__btns">
                <MyButton backColor='red' text='Скачать пин' textColor='#FFF' clickFunction={(e) => downloadPin(e)}/>
              </div>
              <div className="pin__text">
              <div className="pin__title">
                <h2>{postId.title}</h2>
              </div>
              <div className="pin__description">
                <h3>{postId.description}</h3>
              </div>
              </div>
              <Link className="pin__author" to={`../user/${userPost.id}`}>
                <UserInfo userName={userPost.name} userImg={userPost.imgUrl} isSkipImg={true}/>
              </Link>
              <div className="date__post">
                <span>Дата создания пина: {date}</span>
                {postId.editDate &&
                  <span>       (Отредактировано: {editDate})</span>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPost;
