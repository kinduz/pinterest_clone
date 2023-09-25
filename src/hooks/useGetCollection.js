import { useEffect, useState } from "react"
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const useGetCollection = (collection_name, pathName) => {
    const [data, setData] = useState('')
    useEffect(() => {
        const loadingData = async () => {
            const dataArray = []
            const querySnapshot = await getDocs(collection(db, collection_name));
            querySnapshot.forEach((doc) => {
                if (collection_name === 'posts' || collection_name === 'users') {
                    const id = doc.id
                    const data = doc.data()
                    const dataWithId = Object.assign({}, data, { id });
                    dataArray.push(dataWithId)    
                }
                else {
                    dataArray.push(doc.data())    
                }
            })
            setData(dataArray)
          };
          loadingData();
    }, [collection_name, pathName])
    return data
}