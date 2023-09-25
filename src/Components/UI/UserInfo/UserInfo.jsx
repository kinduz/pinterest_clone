import cl from './UserInfo.module.css'

const UserInfo = ({userName, userImg, isSkipImg, flexColumn, widthHeightImg, spanFz}) => {
  const name  = userName ? userName : localStorage.getItem("name")
  const imgUrl = userImg ? userImg : isSkipImg ? null : localStorage.getItem("imgUrl")

  return (
    <div className={cl.profile} style={{flexDirection: flexColumn ? 'column' : 'row'}}>
          <div className={cl.profile__img} style={{width: widthHeightImg, height: widthHeightImg}}>
            {imgUrl ?
            <img src={imgUrl} alt="" />
            : <span style={{fontSize: widthHeightImg}} className={cl.name__word}>{name && name[0]}</span> 
            }
          </div>
          <span style={{fontSize: spanFz}} className={cl.name}>{name}</span>
        </div>
  )
}

export default UserInfo