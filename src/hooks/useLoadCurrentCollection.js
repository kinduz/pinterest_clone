export const useLoadCurrentCollection = (filterValue, filterField, collectionName) => {
    useEffect(() => {
        const loadingData = async () => {
          const querySnapshot = await getDocs(collection(db, collectionName));
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (filterValue === data[filterField]) {
              dispatch(setProfileParamsAction(data.name));
            }
          });
        };
        loadingData();
      }, [filterValue, filterField, collectionName]);
}