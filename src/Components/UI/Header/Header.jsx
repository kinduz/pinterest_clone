import { ImImages } from "react-icons/im";
import MyLink from "../Link/MyLink";
import cl from "./Header.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSectionAction } from "../../../store/Reducers/sectionReducer";
import MyInput from "../Input/MyInput";
import { useEffect, useState } from "react";
import MyButton from "../Button/MyButton";
import {
  logoutAction,
  setProfileParamsAction,
} from "../../../store/Reducers/AuthReducer";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FiSearch } from "react-icons/fi";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { useHandleClick } from "../../../hooks/useHandleClick";
import { useGetCollection } from "../../../hooks/useGetCollection";
import {
  setBurgerMenuAction,
  setPostsAction,
  setSearchValueAction,
} from "../../../store/Reducers/postsReducer";
import UserInfo from "../UserInfo/UserInfo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedSection = useSelector(
    (state) => state.sections.selectedSection
  );
  const email = useSelector((state) => state.auth.email);

  const [isDropped, setIsDropped] = useState(false);
  const [formIsClick, setFormIsClick] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isBurgerMenu, setIsBurgerMenu] = useState(false);

  useHandleClick(formIsClick, setFormIsClick);
  useHandleClick(isDropped, setIsDropped);

  const posts = useGetCollection("posts", location.pathname);
  const users = useGetCollection("users", location.pathname);

  useEffect(() => {
    if (posts) dispatch(setPostsAction(posts));
    if (users) {
      const currentProfile = users.find((user) => user.email === email);
      if (currentProfile) {
        localStorage.setItem("id", currentProfile.id);
        localStorage.removeItem("imgUrl");
        localStorage.setItem("imgUrl", currentProfile.imgUrl);
        setUserId(localStorage.getItem("id"));
        setCurrentUser(currentProfile);
      }
    }
    if (location.pathname !== "/posts") {
      dispatch(setSectionAction("another"));
    }
  }, [posts, users, location]);

  useEffect(() => {
    if (location.pathname === "/posts") {
      dispatch(setSectionAction("main"));
    } else {
      setSearchValue("");
      dispatch(setSearchValueAction(""));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isBurgerMenu === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    dispatch(setBurgerMenuAction());
  }, [isBurgerMenu]);

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
    e.preventDefault();
    setIsBurgerMenu(false);
    navigate("/posts", { replace: true });
    dispatch(setSearchValueAction(searchValue.trim()));
  };

  const setBurgerMenu = () => {
    setIsBurgerMenu(!isBurgerMenu);
  };

  return (
    <nav className={cl.navbar}>
      <MyLink
        clickFunction={() => dispatch(setSectionAction("main"))}
        linkTo="/posts"
        text={<ImImages fontSize="32px" color="rgb(217, 27, 27)" />}
      />
      <div className={cl.all__sections}>
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
            onClick={(e) => {
              setIsDropped(!isDropped);
              e.stopPropagation();
            }}
          >
            <span>Создать</span>
            <MdKeyboardArrowDown />
            {isDropped && (
              <div className={cl.dropped__menu}>
                <MyLink
                  text="Создать пин"
                  linkTo="make-pin"
                  clickFunction={() => dispatch(setSectionAction("make-pin"))}
                />
              </div>
            )}
          </div>
        </div>
        <form
          action=""
          className={cl.form}
          onClick={(e) => {
            setFormIsClick(true);
            e.stopPropagation();
          }}
          onSubmit={(e) => handleSearch(e)}
        >
          <div className={cl.form__icon}>
            <FiSearch />
          </div>
          <MyInput
            changeFunc={(value) => setSearchValue(value)}
            label="Поиск"
            required={false}
            value={searchValue}
            type="text"
          />
          <div
            className={cl.form__close}
            style={{ display: formIsClick ? "" : "none" }}
            onClick={(e) => setSearchValue("")}
          >
            <AiFillCloseCircle />
          </div>
        </form>
        <Link
          className={cl.profile__block}
          to={`user/${userId}`}
          onClick={() => dispatch(setSectionAction("profile"))}
        >
          <UserInfo userImg={currentUser.imgUrl} />
          <MyButton
            text="Выйти"
            clickFunction={() => dispatch(logoutAction())}
          />
        </Link>
      </div>
      <div className={cl.burger__menu} onClick={setBurgerMenu}>
        <RxHamburgerMenu />
        {isBurgerMenu && (
          <div
            className={cl.burger__content}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cl.burger__close} onClick={setBurgerMenu}>
              <AiOutlineClose />
            </div>
            <div className={cl.burger__sections}>
              <form
                action=""
                className={cl.form}
                onClick={(e) => {
                  setFormIsClick(true);
                  e.stopPropagation();
                }}
                onSubmit={(e) => handleSearch(e)}
              >
                <div className={cl.form__icon}>
                  <FiSearch />
                </div>
                <MyInput
                  changeFunc={(value) => setSearchValue(value)}
                  label="Поиск"
                  required={false}
                  value={searchValue}
                  type="text"
                />
              </form>
              <div className={cl.menu__sections}>
                <div className={cl.buttons__sections}>
                  <MyLink
                    text="Главная"
                    linkTo="/posts"
                    clickFunction={() => {
                      setIsBurgerMenu(false);
                      dispatch(setSectionAction("main"));
                    }}
                  />
                  <MyLink
                    text="Создать пин"
                    linkTo="make-pin"
                    clickFunction={() => {
                      setIsBurgerMenu(false);
                      dispatch(setSectionAction("make-pin"));
                    }}
                  />
                </div>

                <Link
                  to={`user/${userId}`}
                  className={cl.user__info}
                  onClick={() => {
                    setIsBurgerMenu(false);
                    dispatch(setSectionAction("profile"));
                  }}
                >
                  <UserInfo userImg={currentUser.imgUrl} />
                </Link>
                <MyButton
                  text="Выйти"
                  clickFunction={() => {
                    setIsBurgerMenu(false);
                    dispatch(logoutAction());
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
