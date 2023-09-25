import { useEffect, useState } from "react";

export const useMsgConverter = (msg) => {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const convertMsg = async () => {
      switch (msg) {
        case "auth/invalid-email":
          setMessage("Неверный формат ввода email");
          return
        case "auth/invalid-login-credentials":
          setMessage("Неправильный логин/пароль");
          return
        case 'auth/weak-password':
          setMessage("Пароль должен быть не менее 6 символов")
          return
        case 'auth/email-already-in-use':
          setMessage("Такой email уже используется")
          return
        case 'auth/not-confirm-password':
          setMessage("Пароли не совпадают")
          return
        default:
          setMessage("Произошла ошибка");
          return
      }
    };
    if (msg) convertMsg();
  }, [msg]);
  return message
};
