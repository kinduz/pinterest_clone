import { useEffect, useState } from "react";

export const useConvertTime = (timestamp) => {
    const [date, setDate] = useState(null)
    useEffect(() => {
        if (timestamp) {
            const date = new Date(timestamp*1000)
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
        const year = date.getFullYear();

        const hours = date.getHours() < 10 
            ? `0${date.getHours()}` 
            : date.getHours();

        const minutes = date.getMinutes() < 10 
            ? `0${date.getMinutes()}` 
            : date.getMinutes();

        const fullDate = `${day}.${month}.${year} ${hours}:${minutes}`
        setDate(fullDate)
        }
    }, [timestamp])
    return date
}