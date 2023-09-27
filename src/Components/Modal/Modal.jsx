import cl from "./Modal.module.css";
import MyInput from "../UI/Input/MyInput";
import MyButton from "../UI/Button/MyButton";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore"; 
import { getAuth, updateProfile } from "firebase/auth";
import {db} from '../../firebase'

const Modal = ({ setIsModal, currentUser }) => {
  const auth = getAuth();
  const [msg, setMsg] = useState('')
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const updateNameUser = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
      updateProfile(user, {
        displayName: newName,
      }).then(() => {
        setMsg("Имя пользователя успешно изменено");
      });

      await updateDoc(doc(db, "users", currentUser.id), {
        name: newName ? newName : currentUser.name,
      })
        .then(() => {
          localStorage.removeItem("name");
          localStorage.setItem("name", newName);
          setMsg("Имя пользователя успешно изменено");
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
      }
    } catch (e) {
      console.error();
    }
  
  };

  const updateDescriptionUser = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {

      await updateDoc(doc(db, "users", currentUser.id), {
        description: newDescription ? newDescription : currentUser.description,
      })
        .then(() => {
          setMsg("Описание пользователя успешно изменено");
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
      }
    } catch (e) {
      console.error();
    }
  
  };

  return (
    <div className={cl.modal} onClick={() => setIsModal(false)}>
      <div className={cl.modal__content} onClick={(e) => e.stopPropagation()}>
        <div className={cl.modal__close} onClick={() => setIsModal(false)}>
          <AiOutlineClose />
        </div>
        <div className={cl.modal__forms}>
          <form onSubmit={(e) => updateNameUser(e)} className={`${cl.form__name} ${cl.modal__form}`}>
            <span>Введите новое имя</span>
            <MyInput label='Новое имя' changeFunc={(value) => setNewName(value)}/>
            <MyButton text="Обновить" clickFunction={(e) => updateNameUser(e)}/>
          </form>
          <form onSubmit={(e) => updateDescriptionUser(e)} className={`${cl.form__name} ${cl.modal__form}`}>
            <span>Введите новое описание</span>
            <MyInput label='Новое описание' changeFunc={(value) => setNewDescription(value)}/>
            <MyButton text="Обновить" clickFunction={(e) => updateDescriptionUser(e)}/>
          </form>
        </div>
        {msg && (
          <span className={cl.msg__modal}>{msg}</span>
        )}
      </div>
    </div>
  );
};

export default Modal;
