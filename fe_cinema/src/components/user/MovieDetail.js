import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "./moviedetail.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className='bg-dark text-light'>
        <Modal.Title id="contained-modal-title-vcenter">
          Chi tiết nội dung
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark text-light rounded-bottom'>
        <p>
          Nhà Gia Tiên xoay quanh câu chuyện đa góc nhìn về các thế hệ khác nhau trong một gia đình, 
          có hai nhân vật chính là Gia Minh (Huỳnh Lập) và Mỹ Tiên (Phương Mỹ Chi). 
          Trở về căn nhà gia tiên để quay các video “triệu view” trên mạng xã hội, 
          Mỹ Tiên - một nhà sáng tạo nội dung thuộc thế hệ Z vốn không tin vào chuyện tâm linh, 
          hoàn toàn mất kết nối với gia đình, bất ngờ nhìn thấy Gia Minh - người anh trai đã mất từ lâu. 
          Để hồn ma của Gia Minh có thể siêu thoát và không tiếp tục làm phiền mình, 
          Mỹ Tiên bắt tay cùng Gia Minh lên kế hoạch giữ lấy căn nhà gia tiên đang bị họ hàng tranh chấp, 
          đòi ông nội chia tài sản. Đứng trước hàng loạt bí mật động trời trong căn nhà gia tiên, 
          liệu Mỹ Tiên có vượt qua được tất cả để hoàn thành di nguyện của Gia Minh?
        </p>
      </Modal.Body>
    </Modal>
  );
}

export const MovieDetail = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [allScreenings, setAllScreenings] = useState([]); // State mới để lưu dữ liệu từ bảng screenings

  useEffect(() => {
    fetchMovie();
    fetchShowtime();
    fetchScreenings(); // Thêm hàm để lấy dữ liệu từ bảng screenings
  }, []);

  const fetchMovie = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(response.data[0]);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết phim: ", err);
    }
  };

  const fetchShowtime = async () => {
    try {
      const response = await axios.get(`${API_URL}/showtimes`);
      setShowtimes(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy suất chiếu: ", err);
    }
  };

  const fetchScreenings = async () => {
    try {
      const response = await axios.get(`${API_URL}/screenings`); // Giả định có endpoint để lấy screenings
      setAllScreenings(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy screenings: ", err);
    }
  };

  // Function to generate all dates between start_time and end_time
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Process showtimes to get all upcoming dates from today
  useEffect(() => {
    if (!id || !showtimes) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh chính xác theo ngày

    // Filter showtimes by movie_id and from today onwards (based on start_time)
    const upcomingShowtimes = showtimes
      .filter(st => st.movie_id === id)
      .filter(st => {
        const startDate = new Date(st.start_time);
        return startDate >= now; // Chỉ lấy các suất chiếu từ ngày hiện tại trở đi
      });

    // Generate all dates between start_time and end_time for each showtime
    let allDates = [];
    upcomingShowtimes.forEach(st => {
      const datesBetween = getDatesBetween(st.start_time, st.end_time);
      allDates = [...allDates, ...datesBetween];
    });

    // Get unique dates
    const uniqueDates = [...new Set(allDates)];

    // Format dates for display
    const formattedDates = uniqueDates.map(date => {
      const d = new Date(date);
      return {
        date: d.getDate(),
        day: `Th.${d.getMonth() + 1}`,
        weekDay: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"][d.getDay()],
        fullDate: date
      };
    });

    // Sort dates in ascending order
    formattedDates.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    setDates(formattedDates);
    if (formattedDates.length > 0) {
      setSelectedDate(formattedDates[0].fullDate); // Default to the first upcoming date
    }
  }, [id, showtimes]);

  // Filter screenings for the selected date using screening_date
  useEffect(() => {
    if (!selectedDate || !allScreenings || !showtimes) return;

    // Lấy danh sách showtime_id của movie hiện tại
    const movieShowtimeIds = showtimes
      .filter(st => st.movie_id === id)
      .map(st => st.showtime_id);

    // Lọc screenings dựa trên showtime_id và screening_date
    const filteredScreenings = allScreenings
      .filter(sc => movieShowtimeIds.includes(sc.showtime_id))
      .filter(sc => {
        const screeningDate = new Date(sc.screening_date).toISOString().split("T")[0];
        return screeningDate === selectedDate;
      });

    setScreenings(filteredScreenings);
  }, [selectedDate, allScreenings, showtimes, id]);

  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  if (!movie) return <p style={{ marginTop: '70px' }}>Đang tải...</p>;

  return (
    <div className='container-details'>
      {/* Thông tin chi tiết */}
      <Card className="bg-dark text-light rounded-0 position-relative min-h-auto">
        <Card.Img src='nhagiatien_poster.jpg' className='rounded-0' alt="Poster" style={{ opacity: '0.2', height: '400px' }} />
        <Card.ImgOverlay className='d-flex flex-column w-75 m-auto p-3'>
          <div className="row align-items-start container-overlay">
            <div className="text-center card-logo">
              <img src={`${API_URL}${movie.poster_url}`} alt='Card' className='rounded-4' />
            </div>
            <div className='info-detail'>
              <div className='title-rep'>
                <Card.Title className="fs-3 fw-bold text-uppercase">{movie.title}</Card.Title>
                <Card.Text className=''>
                  {movie.genre} <span>Viet Nam</span><span>{movie.duration} phút</span>
                </Card.Text>
              </div>
              <div className="text-md-start mt-3">
                <Card.Text className='m-0'> Đạo diễn: <span>{movie.director}</span></Card.Text>
                <Card.Text className='m-0'> Diễn viên: <span>{movie.cast}</span></Card.Text>
                <Card.Text className=''> Khởi chiếu: <span></span></Card.Text>
                <Card.Text className='text-truncate-multiline'>
                  {movie.description}
                </Card.Text>
                <Card.Text className='text-danger'>Kiểm duyệt: T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</Card.Text>
                <div className='d-flex gap-4 align-items-center'>
                  <a className='text-decoration-underline text-light' onClick={() => setModalShow(true)}>chi tiết nội dung</a>
                  <Button className='rounded-pill border-2 border-warning px-4 bg-transparent text-warning' onClick={() => setModalShow(true)}>
                    Trailer
                  </Button>
                </div>
                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </div>
            </div>
          </div>
        </Card.ImgOverlay>
      </Card>

      {/* Ngày chiếu */}
      <div className='container-date text-light bg-dark'>
        <div className="date-list">
          {dates.map((item) => (
            <div
              key={item.fullDate}
              className={`date ${selectedDate === item.fullDate ? "selected" : ""}`}
              onClick={() => setSelectedDate(item.fullDate)}
            >
              <p>{item.day}</p>
              <p className="fs-5 fw-bold">{item.date}</p>
              <p>{item.weekDay}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Giờ chiếu */}
      <div className='container-showtime'>
        <p className='text-center text-warning'>Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.</p>
        <div className='showtime'>
          {screenings.length > 0 ? (
            screenings.map(screening => (
              <button key={screening.screening_id}>
                {formatTime(screening.start_time)} - {formatTime(screening.end_time)} 
              </button>
            ))
          ) : (
            <p className='text-light'>Không có suất chiếu</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;