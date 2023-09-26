import MyButton from "../UI/Button/MyButton";
import MyInput from "../UI/Input/MyInput";
import cl from "./Auth.module.css";
import { ImImages } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import MyLink from "../UI/Link/MyLink";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { registrationAction } from "../../store/Reducers/AuthReducer";
import { useMsgConverter } from "../../hooks/useMsgConverter";
import { db } from "../../firebase";

const RegistrationForm = () => {

  const dispatch = useDispatch()

  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [date, setDate] = useState('')

  const errorMsg = useMsgConverter(error);

  const addNewUserDb = async (userName, userEmail, imgUrl = null) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", userEmail ? userEmail : email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        const docRef = await addDoc(usersRef, {
          name: userName ? userName : name,
          email: userEmail ? userEmail : email,
          born: date ? date : null,
          imgUrl: imgUrl,
        });
    }
    } catch (e) {
      console.error();
    }
  };

  const submitForm = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("auth/not-confirm-password")
      return
    }
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email, password)
      .then(({user}) => {
        updateProfile(user, {
          displayName: name,
        })
        setMsg("Регистрация прошла успешно")
        dispatch(registrationAction(user.email, name, user.accessToken, user.uid))
        addNewUserDb()
      })
      .catch((error) => {
        setMsg('')
        setError(error.code)
      })
  }

  const resetParams = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setDate("")
    setName("")
  }

  const googleAuth = () => {
    resetParams()
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        addNewUserDb(user.displayName, user.email, user.photoURL)
        dispatch(registrationAction(user.email, user.displayName, user.accessToken, user.uid, user.photoURL))
      })
      .catch((error) => {
        console.error();
      });
  }

    return (
        <div className={cl.loginForm}>
          <div className={cl.form__auth}>
            <div className="app__icon">
              <ImImages />
            </div>
            <h1>Добро пожаловать в PinClone!</h1>
            {msg ? (
              <h2 className={cl.success__msg}>{msg}</h2>
            ) : (
              errorMsg && (
                <h2 className={cl.error__msg}>{errorMsg}</h2>
              )
            )}
            <form className={cl.form} onSubmit={(e) => submitForm(e)}>
              <MyInput label="Введите ваше имя" type="text" required={true} changeFunc={(value) => setName(value)}/>
              <MyInput label="Адрес электронной почты" type="email" required={true} changeFunc={(value) => setEmail(value)}/>
              <MyInput label="Создайте пароль" type="password" required={true} changeFunc={(value) => setPassword(value)}/>
              <MyInput label="Подтвердите пароль" type="password" required={true} changeFunc={(value) => setConfirmPassword(value)}/>
              <MyInput label="Дата рождения" type="date" required={true} changeFunc={(value) => setDate(value)}/>
              <MyButton text="Продолжить" textColor="white" backColor='red' />
            </form>
            <p>или</p>
            <MyButton
              text="Войти через Google"
              icon={<FcGoogle fontSize="24px" />}
              clickFunction={googleAuth}
            />
          </div>
          <div className={cl.toRegister}>
            <span>Уже зарегистрировались?</span> 
            <MyLink text='Войти'linkTo='/login'/>
          </div>
        </div>
      );
}

export default RegistrationForm