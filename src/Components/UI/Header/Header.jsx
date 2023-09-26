import { ImImages } from "react-icons/im";
import MyLink from "../Link/MyLink";
import cl from "./Header.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSectionAction } from "../../../store/Reducers/sectionReducer";
import MyInput from "../Input/MyInput";
import { useEffect, useState } from "react";
import MyButton from "../Button/MyButton";
import {logoutAction, setProfileParamsAction} from "../../../store/Reducers/AuthReducer";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FiSearch } from 'react-icons/fi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useHandleClick } from "../../../hooks/useHandleClick";
import { useGetCollection } from "../../../hooks/useGetCollection";
import { setPostsAction, setSearchValueAction } from "../../../store/Reducers/postsReducer";
import UserInfo from "../UserInfo/UserInfo";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {

  const [userId, setUserId] = useState(null);


  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedSection = useSelector(state => state.sections.selectedSection);
  const email = useSelector((state) => state.auth.email);

  const [isDropped, setIsDropped] = useState(false);
  const [formIsClick, setFormIsClick] = useState(false)
  const [searchValue, setSearchValue] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useHandleClick(formIsClick, setFormIsClick)
  useHandleClick(isDropped, setIsDropped)

  const posts = useGetCollection("posts", location.pathname);
  const users = useGetCollection("users", location.pathname);

  useEffect(() => {
    if (posts) dispatch(setPostsAction(posts))  
    if (users) {
      const currentProfile = users.find(user => user.email === email)
      if (currentProfile) {
        localStorage.setItem("id", currentProfile.id)
        setUserId(localStorage.getItem("id"))
        setCurrentUser(currentProfile)
      }
    }
    if (location.pathname === '/posts') {
      dispatch(setSectionAction("main"))
    }
  }, [posts, users, location])


  useEffect(() => {
    const loadingData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (email === data.email) {
          dispatch(setProfileParamsAction(data.name));
        }
      });
    };
    loadingData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault()
    navigate("/posts", {replace: true})
    dispatch(setSearchValueAction(searchValue.trim()))
  }



  return (
    <nav className={cl.navbar}>
      <MyLink
        clickFunction={() => dispatch(setSectionAction("main"))}
        linkTo="/posts"
        text={<ImImages fontSize="32px" color="rgb(217, 27, 27)" />}
      />
      <div className={cl.sections__group}>
        <MyLink
          text="Главная"
          linkTo="/posts"
          color={selectedSection === "main" ? "white" : "black"}
          backColor={selectedSection === "main" ? "black" : "white"}
          clickFunction={() => dispatch(setSectionAction("main"))}
        />
        <div
          className={cl.make__list}
          style={{ borderColor: isDropped && "#000" }}
          onClick={(e) => {setIsDropped(!isDropped); e.stopPropagation()}}
        >
          <span>Создать</span>
          <MdKeyboardArrowDown />
          {isDropped && (
            <div className={cl.dropped__menu}>
              <MyLink text="Создать пин" linkTo="make-pin" clickFunction={() => dispatch(setSectionAction("make-pin"))}/>
            </div>
          )}
        </div>
      </div>
      <form action="" className={cl.form} onClick={(e) => {setFormIsClick(true); e.stopPropagation()}} onSubmit={(e) => handleSearch(e)}>
        <div className={cl.form__icon}>
          <FiSearch/>
        </div>
        <MyInput
          changeFunc={(value) => setSearchValue(value)}
          label="Поиск"
          required={false}
          value={searchValue}
          type="text"
        />
        <div className={cl.form__close} style={{display: formIsClick ? '' : 'none'}} onClick={() => setSearchValue('')}>
          <AiFillCloseCircle/>
        </div>
      </form>
      <Link className={cl.profile__block} to={`user/${userId}`} onClick={() => dispatch(setSectionAction("profile"))}>
        <UserInfo userImg={currentUser.imgUrl}/>
        <MyButton text="Выйти" clickFunction={() => dispatch(logoutAction())} />
      </Link>
    </nav>
  );
};

export default Header;
