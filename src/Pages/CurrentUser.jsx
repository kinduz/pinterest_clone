import { useParams } from "react-router-dom";
import { useGetCollection } from "../hooks/useGetCollection";
import { useEffect, useState } from "react";
import MyLoading from "../Components/UI/Loading/MyLoading";
import UserInfo from "../Components/UI/UserInfo/UserInfo";
import MyButton from "../Components/UI/Button/MyButton";
import MyLink from "../Components/UI/Link/MyLink";
import PostList from "../Components/UI/PostList/PostList";
import Modal from "../Components/Modal/Modal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const CurrentUser = () => {
  const params = useParams();
  const email = localStorage.getItem("email");

  const users = useGetCollection("users");
  const posts = useGetCollection("posts");

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserPosts, setCurrentUserPosts] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [inputFile, setInputFile] = useState(null);
  const [fileData, setFileData] = useState(null);

  const handleInput = (e) => {
    e.preventDefault();
    setInputFile(e.target.files[0]);
  };

  useEffect(() => {
    if (inputFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(reader.result); 
      };
      reader.readAsDataURL(inputFile);
    }
    if (fileData) {
      try {
        updateDoc(doc(db, "users", currentUser.id), {
          imgUrl: fileData,
        }).then(() => {
          localStorage.removeItem("imgUrl");
          localStorage.setItem("imgUrl", fileData);
          window.location.reload()
        });
      } catch (e) {
        console.error();
      }
    }
  }, [inputFile, fileData]);

  useEffect(() => {
    if (users) {
      const foundUser = users.find((user) => user.id === params.id);
      if (foundUser) {
        setCurrentUser(foundUser);
      }
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      const foundPosts = posts?.filter(
        (post) => post.authorEmail === currentUser.email
      );
      if (foundPosts) {
        setCurrentUserPosts(foundPosts);
      }
      setIsLoading(false);
    }
  }, [currentUser]);

  return (
    <div>
      {isLoading ? (
        <MyLoading />
      ) : !currentUser ? (
        <h1>Такого пользователя не существует</h1>
      ) : (
        <div className="user__main">
          <div className="user__info">
            <div className="info__main">
              <UserInfo
                isSkipImg={true}
                flexColumn={true}
                userImg={currentUser.imgUrl}
                userName={currentUser.name}
                widthHeightImg="128px"
                spanFz="32px"
              />
              <span className="tag__user">@{currentUser.id}</span>
            </div>
            {currentUser.email === email && (
              <div className="user__btns">
                <MyButton
                  text="Изменить имя"
                  clickFunction={() => setIsModal(true)}
                />
                <div className="upload__img">
                  <MyButton text="Обновить фото" />
                  <input
                    onChange={(e) => handleInput(e)}
                    type="file"
                    className="input__make"
                    title=" "
                  />
                </div>
              </div>
            )}
          </div>
          <div className="posts__text">
            {currentUserPosts.length ?
            currentUser.email === email ? (
              <h1>Ваши пины, {currentUser.name}</h1>
            ) : (
              <h1>Пины пользователя {currentUser.name}</h1>
            ) : ''
            }
          </div>
          <div className="user__posts">
            {currentUserPosts.length ? (
              <PostList postsArray={currentUserPosts} />
            ) : (
              <div className="make__post">
                <span>Похоже, у вас нет ни одного пина :(</span>
                <span>Давайте создадим ваш первый пин!</span>
                <MyLink
                  backColor="#FFF"
                  color="red"
                  linkTo="/make-pin"
                  text="Создать пин"
                />
              </div>
            )}
          </div>
          {isModal && <Modal currentUser={currentUser} setIsModal={setIsModal} />}
        </div>
      )}
    </div>
  );
};

export default CurrentUser;
