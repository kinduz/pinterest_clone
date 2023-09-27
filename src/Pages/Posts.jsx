import { useEffect, useState } from "react";
import Loading from "../images/loading.svg";
import PostList from "../Components/UI/PostList/PostList";
import { useSelector } from "react-redux";
import {MdOutlineSort} from 'react-icons/md'
import { useHandleClick } from "../hooks/useHandleClick";

const Posts = () => {
  const posts = useSelector(state => state.posts.posts)
  const searchValue = useSelector(state => state.posts.searchValue)

  const [sortPosts, setSortPosts] = useState(null)
  const [foundPosts, setFoundPosts] = useState(null)

  const [isLoading, setIsLoading] = useState(true);
  const [isSortList, setIsSortList] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);

  const sortAllPosts = (typeSort) => {
    setSelectedSort(typeSort)
    const sortedPosts = [...posts].sort((a, b) => {
      return a[typeSort].toString().localeCompare(b[typeSort].toString());
    });
    setSortPosts(sortedPosts)
  }

  useEffect(() => {
    if (posts) {
      setIsLoading(false);
    }
  }, [posts]);

  useEffect(() => {
    document.title = 'Посты'
    if (searchValue) {
      const foundedPosts = posts.filter(post => post.title.includes(searchValue) || post.description.includes(searchValue) || post.author.includes(searchValue))
      setFoundPosts(foundedPosts)
    }
    else {
      setFoundPosts(null)
    }
  }, [searchValue])

  useHandleClick(isSortList, setIsSortList)

  return (
    <div className="posts__content flex__row">
      {isLoading ? (
        <div className="loading">
          <img src={Loading} alt="" />
        </div>
      ) : (
        <div className="content">
          <div className="posts__params">
            <h2 className="available__pins">Всего доступных пинов: {foundPosts ? foundPosts.length : posts.length}</h2>
            {foundPosts ? foundPosts.length > 1 : posts.length > 1 && 
            <div className="sort__icon" onClick={(e) => {setIsSortList(!isSortList); e.stopPropagation()}}>
              <MdOutlineSort/>
              {isSortList && (
                <div className="sort__list" onClick={(e) => e.stopPropagation()}>
                  <div className="sort__by author" style={{color: selectedSort === 'author' && 'black'}} onClick={() => sortAllPosts('author')}>По автору</div>
                  <div className="sort__by title" style={{color: selectedSort === 'title' && 'black'}} onClick={() => sortAllPosts('title')}>По заголовку</div>
                  <div className="sort__by date" style={{color: selectedSort === 'creationDate' && 'black'}} onClick={() => sortAllPosts('creationDate')}>По дате</div>
                </div>
              )}
            </div>
            }
          </div>

        <div className="posts__content flex__row">
          <PostList postsArray={foundPosts ? foundPosts : sortPosts ? sortPosts : posts} />
        </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
