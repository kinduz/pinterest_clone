import { useEffect, useState } from 'react'
import { BsFillArrowUpCircleFill} from 'react-icons/bs'
import  MyInput  from '../Components/UI/Input/MyInput'
import UserInfo from '../Components/UI/UserInfo/UserInfo'
import MyButton from '../Components/UI/Button/MyButton'
import { db } from '../firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'


const MakePin = () => {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email")

  const navigate = useNavigate()

  const {state} = useLocation();

  const [inputFile, setInputFile] = useState(null);
  const [fileData, setFileData] = useState(state?.value?.url !== null ? state?.value?.url : null);
  const [titlePost, setTitlePost] = useState(state?.value?.title !== null ? state?.value?.title : '')
  const [descriptionPost, setDescriptionPost] = useState(state?.value?.description !== null ? state?.value?.description : '');
  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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
  }, [inputFile]);

  const uploadPin = (e) => {
    e.preventDefault()
    if (fileData === null) {
      setErrorMsg('Загрузите изображение')
      return
    }
    setErrorMsg('')
    setIsLoadingPost(true)
    try {
      if (!state) {
        const docRef = addDoc(collection(db, "posts"), {
          title: titlePost,
          description: descriptionPost,
          author: name,
          url: fileData,
          authorEmail: email,
          creationDate: Math.floor(Date.now()/1000)
        });
        docRef.then(res => {
          setIsLoadingPost(false)
          navigate('/posts', {replace: true})
        })
      }
      else {
        const docRef = updateDoc(doc(db, "posts", state.value.id), {
          title: titlePost,
          description: descriptionPost,
          author: name,
          url: fileData,
          authorEmail: email,
          editDate: Math.floor(Date.now()/1000)
        });
        docRef.then(res => {
          setIsLoadingPost(false)
          navigate('/posts', {replace: true})
        })
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetUploadFile = () => {
    setInputFile(null);
    setFileData(null);
  };

  return (
    <div className="pin__container">
      <div className="pin__form">
        {fileData ? (
          <div className="loaded__img">
            <img src={fileData} alt="" />
            <MyButton
              icon={<AiFillCloseCircle />}
              backColor="red"
              clickFunction={resetUploadFile}
              textColor="#FFF"
            />
          </div>
        ) : (
          <>
          <div className="upload__file">
            <div className="upload__border">
              <input
                onChange={(e) => handleInput(e)}
                type="file"
                className="input__make"
                draggable
              />
              <div className="upload__drag flex__column__center">
                <BsFillArrowUpCircleFill />
                <span>
                  Перетащите изображение или нажмите кнопку для загрузки
                </span>
              </div>
              <span className="upload__advice ">
                Советуем использовать файлы высокого разрешения в формате .jpeg
                (размером меньше 20 МБ)
              </span>
            </div>
          </div>
          </>
        )}

        <div className="inputs__blocks">
          <MyInput
            label="Добавьте название"
            changeFunc={(value) => setTitlePost(value)}
            required={true}
            type="text"
            fontSize="32px"
            value={titlePost}
          />
          <div className="author__item">
            <UserInfo/>
          </div>
          <MyInput
            
            label="Добавьте описание"
            changeFunc={(value) => setDescriptionPost(value)}
            required={true}
            type="textarea"
            value={descriptionPost}
          />
          {!isLoadingPost ? (
            <MyButton
            backColor="red"
            textColor="#FFF"
            text={!state ? "Опубликовать пин" : "Отредактировать пин"}
            clickFunction={(e) => uploadPin(e)}
          />
          ) : (
            <div className='pin__loading'>
              <h1>Загрузка пина</h1>
            </div>
          )}
          {errorMsg && (
            <h2 className='error__msg'>{errorMsg}</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default MakePin