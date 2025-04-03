import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './showtimes.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const Showtimes = () => {
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(todayFormatted);
  const [showtimes, setShowtime] = useState([]);
  const navigate = useNavigate(); 
  
  // Tạo danh sách 5 ngày từ hôm nay
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    return {
      fullDate: date.toISOString().split("T")[0], // YYYY-MM-DD
      displayButton: date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-"), // Định dạng dd-mm-yyyy
    };
  });

  useEffect(() => {
    fetchShowTimes();
  }, []);

  const fetchShowTimes = async () => {
    try {
      const response = await axios.get(`${API_URL}/showtimes/showtimebydate`);
      setShowtime(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu suất chiếu", error);
    }
  };

  const filteredShowtimes = showtimes.filter(st => {
    // Chuyển release_date về dạng YYYY-MM-DD
    const formattedReleaseDate = new Date(st.screening_date).toISOString().split("T")[0];
    console.log(formattedReleaseDate, selectedDate)
    return formattedReleaseDate === selectedDate;
  });
  

  // 👉 **Nhóm phim theo `title` để tránh hiển thị nhiều lần**
  const groupedShowtimes = filteredShowtimes.reduce((acc, curr) => {
    const existingMovie = acc.find(movie => movie.title === curr.title);

    if (existingMovie) {
      // Nếu phim đã có, thêm `start_time` vào danh sách
      existingMovie.showtimes.push(curr.start_time);
    } else {
      // Nếu chưa có, tạo mới
      acc.push({
        ...curr,
        showtimes: [curr.start_time] // Tạo mảng chứa suất chiếu
      });
    }
    return acc;
  }, []);

  return (
    <div className='showtime-container'>
      <div className="d-flex align-items-center gap-2 text-white flex-row justify-content-center">
        <div className="rounded-circle bg-danger bg-gradient" style={{ width: "16px", height: "16px" }}></div>
        <h4 className="fw-bold m-0">Phim đang chiếu</h4>
      </div>

      {/* Ngày chiếu */}
      <div className="container-date">
        <div className="showtime">
          {dates.map((item) => (
            <button
              key={item.fullDate}
              className={`date ${selectedDate === item.fullDate ? "selected" : ""}`}
              onClick={() => setSelectedDate(item.fullDate)}
            >
              {item.displayButton}
            </button>
          ))}
        </div>
      </div>

      <p className='text-center text-warning mt-3'>
        Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.
      </p>

      {/* Danh sách phim */}
      <div className='container-listmovie'>
        {groupedShowtimes.length >0 ? (
            groupedShowtimes.map(st => (
            <div key={st.title} className='detail-movie' onClick={() => navigate(`/movie/${st.movie_id}`)}>
              <div className='movie-img'>
                <img src={`${API_URL}${st.poster_url}`} alt='Image movie' width='100%' height='100%'/>
              </div>
              <div className='movie-info'>
                <div className='genre-duration'>
                  <p>{st.genre}</p>
                  <p>{st.duration} phút</p>
                </div>
                <p className='fs-5 fw-bold text-white text-uppercase'>{st.title} - T{st.age_restriction}</p>
                <p className='text-white'>Xuất xứ: <span>Viet Nam</span></p>
                <p className='text-white'>Khởi chiếu: <span>{new Date(st.release_date).toISOString().split("T")[0].split("-").reverse().join("/")}</span></p>
                <p className='text-danger'>T{st.age_restriction} - Phim được phổ biến đến người xem từ đủ {st.age_restriction} tuổi trở lên</p>
                <div>
                  <p className='fw-bold text-light'>Lịch chiếu</p>
                  <div className='container-hour'>
                    {st.showtimes.map((time, index) => (
                      <button key={index}>{time}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className='standard-format'>{st.screening_format}</div>
            </div>
          ))
        ) : (
          <p className='text-light'>Không có lịch chiếu nào ...</p>
        )}
        
      </div>
    </div>
  );
};

export default Showtimes;
