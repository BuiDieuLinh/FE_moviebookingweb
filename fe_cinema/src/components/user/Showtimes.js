import React, {useState} from 'react'
import "./showtimes.css"

export const Showtimes = () => {
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(todayFormatted); // Mặc định ngày đầu tiên

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


  return (
    <div className='showtime-container' >
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
        <p className='text-center text-warning mt-3'>Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.</p>

        {/* List phim */}
        <div className='container-listmovie'>
          <div className='detail-movie'>
            <div className='movie-img'>
              <img src='nhagiatien_card.jpg' alt='Image movie' width='100%' height='100%'/>
            </div>
            <div className='movie-info'>
              <div className='genre-duration'>
                <p >Hài, Tâm lý, tình cảm</p>
                <p >117 phút</p>
              </div>
              <p className='fs-5 fw-bold text-white'>NHÀ GIA TIÊN - T18</p>
              <p className='text-white'>Xuất xứ: <span>Viet Nam</span></p>
              <p className='text-white'>Khởi chiếu: <span>21/02/2025</span></p>
              <p className='text-danger'>T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</p>
              <div>
                <p className='fw-bold text-light'>Lịch chiếu</p>
                <div className='container-hour'>
                  <button>17:05</button>
                  <button>19:10</button>
                  <button>21:15</button>
                </div>
              </div>
            </div>
            <div className='standard-format'>2D</div>
          </div>

          <div className='detail-movie'>
            <div className='movie-img'>
              <img src='nhagiatien_card.jpg' alt='Image movie' width='100%' height='100%'/>
            </div>
            <div className='movie-info'>
              <div className='genre-duration'>
                <p >Hài, Tâm lý, tình cảm</p>
                <p >117 phút</p>
              </div>
              <p className='fs-5 fw-bold text-white'>NHÀ GIA TIÊN - T18</p>
              <p className='text-white'>Xuất xứ: <span>Viet Nam</span></p>
              <p className='text-white'>Khởi chiếu: <span>21/02/2025</span></p>
              <p className='text-danger'>T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</p>
              <div>
                <p className='fw-bold text-light'>Lịch chiếu</p>
                <div className='container-hour'>
                  <button>17:05</button>
                  <button>19:10</button>
                  <button>21:15</button>
                </div>
              </div>
            </div>
            <div className='standard-format'>2D</div>
          </div>

          <div className='detail-movie'>
            <div className='movie-img'>
              <img src='nhagiatien_card.jpg' alt='Image movie' width='100%' height='100%'/>
            </div>
            <div className='movie-info'>
              <div className='genre-duration'>
                <p >Hài, Tâm lý, tình cảm</p>
                <p >117 phút</p>
              </div>
              <p className='fs-5 fw-bold text-white'>NHÀ GIA TIÊN - T18</p>
              <p className='text-white'>Xuất xứ: <span>Viet Nam</span></p>
              <p className='text-white'>Khởi chiếu: <span>21/02/2025</span></p>
              <p className='text-danger'>T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</p>
              <div>
                <p className='fw-bold text-light'>Lịch chiếu</p>
                <div className='container-hour'>
                  <button>17:05</button>
                  <button>19:10</button>
                  <button>21:15</button>
                </div>
              </div>
            </div>
            <div className='standard-format'>2D</div>
          </div>
          <div className='detail-movie'>
            <div className='movie-img'>
              <img src='nhagiatien_card.jpg' alt='Image movie' width='100%' height='100%'/>
            </div>
            <div className='movie-info'>
              <div className='genre-duration'>
                <p >Hài, Tâm lý, tình cảm</p>
                <p >117 phút</p>
              </div>
              <p className='fs-5 fw-bold text-white'>NHÀ GIA TIÊN - T18</p>
              <p className='text-white'>Xuất xứ: <span>Viet Nam</span></p>
              <p className='text-white'>Khởi chiếu: <span>21/02/2025</span></p>
              <p className='text-danger'>T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</p>
              <div>
                <p className='fw-bold text-light'>Lịch chiếu</p>
                <div className='container-hour'>
                  <button>17:05</button>
                  <button>19:10</button>
                  <button>21:15</button>
                </div>
              </div>
            </div>
            <div className='standard-format'>2D</div>
          </div>

          <div className='detail-movie'>
            <div className='movie-img'>
              <img src='nhagiatien_card.jpg' alt='Image movie' width='100%' height='100%'/>
            </div>
            <div className='movie-info'>
              <div className='genre-duration'>
                <p >Hài, Tâm lý, tình cảm</p>
                <p >117 phút</p>
              </div>
              <p className='fs-5 fw-bold text-white'>NHÀ GIA TIÊN - T18</p>
              <p className='text-white'>Xuất xứ: <span>Viet Nam</span></p>
              <p className='text-white'>Khởi chiếu: <span>21/02/2025</span></p>
              <p className='text-danger'>T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</p>
              <div>
                <p className='fw-bold text-light'>Lịch chiếu</p>
                <div className='container-hour'>
                  <button>17:05</button>
                  <button>19:10</button>
                  <button>21:15</button>
                </div>
              </div>
            </div>
            <div className='standard-format'>2D</div>
          </div>
        </div>
    </div>
  )
}
export default Showtimes;