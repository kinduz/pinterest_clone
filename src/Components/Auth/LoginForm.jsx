import MyButton from "../UI/Button/MyButton";
import MyInput from "../UI/Input/MyInput";
import cl from "./Auth.module.css";
import { ImImages } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import MyLink from "../UI/Link/MyLink";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../../store/Reducers/AuthReducer";
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useMsgConverter } from "../../hooks/useMsgConverter";



const LoginForm = () => {
  const dispatch = useDispatch()
  
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitForm = (e) => {
    e.preventDefault()
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(({user}) => {
        dispatch(loginAction(user.email, user.accessToken, user.uid, '', user.displayName))
      })
      .catch((error) => {
        setError(error.code)
      })
  }

  const googleAuth = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        dispatch(loginAction(user.email, credential.accessToken, user.uid, user.photoURL, user.displayName))
      })
      .catch((error) => {
        console.error();
      });
  }

  const errorMsg = useMsgConverter(error);

  return (
    <div className={cl.loginForm}>
      <div className={cl.form__auth}>
        <div className="app__icon">
          <ImImages />
        </div>
        <h1>Войдите, чтобы увидеть больше</h1>
        {errorMsg && (
          <h2 className='error__msg'>{errorMsg}</h2>
        )}
        <form className={cl.form} onSubmit={(e) => submitForm(e)}>
          <MyInput label="Адрес электронной почты" type="text" required={true} changeFunc={(value) => setEmail(value)}/>
          <MyInput label="Пароль" type="password" required={true} changeFunc={(value) => setPassword(value)}/>
          <MyButton text="Войти" textColor="white" backColor="red" />
        </form>
        <p>или</p>
        <MyButton
          text="Войти через Google"
          icon={<FcGoogle fontSize="24px"/>}
          clickFunction={googleAuth}
        />
      </div>
      <div className={cl.toRegister}>
        <span>Еще не зарегистрировались в PinClone?</span> 
        <MyLink text='Зарегистрироваться'linkTo='/registration'/>
      </div>
    </div>
  );
};

export default LoginForm;
