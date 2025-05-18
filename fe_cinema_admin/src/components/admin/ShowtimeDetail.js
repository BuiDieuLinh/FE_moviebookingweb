import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const API_URL = process.env.REACT_APP_PORT;
export default function ShowtimeDetail() {
    const { showtime_id } = useParams();
    const [showtimeDetail, setShowtimeDetail] = useState();

    useEffect(() => {
        fetchShowtimebyID();
    }, []);

    const fetchShowtimebyID = async () =>{
        try{
            const response = await axios.get(`${API_URL}/showtimes/${showtime_id}`);
            console.log(response.data)
        }catch(err){
            console.error("Lỗi khi lấy dữ liệu: ", err)
        }
    }
    return (
        <div>ShowtimeDetail</div>
    )
}
