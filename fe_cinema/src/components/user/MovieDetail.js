import React, { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "./moviedetail.css";
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const countdownRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [allScreenings, setAllScreenings] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [countdown, setCountdown] = useState(600);
  const [countdownDisplay, setCountdownDisplay] = useState("10:00");

  useEffect(() => {
    fetchMovie();
    fetchShowtime();
    fetchScreenings();
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
      const response = await axios.get(`${API_URL}/screenings`);
      setAllScreenings(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy screenings: ", err);
    }
  };

  const fetchSeatsByRoom = async (room_id, screening_id) => {
    try {
      const response = await axios.get(`${API_URL}/seats/room/${room_id}/${screening_id}`);
      setSeatData(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách ghế: ", err);
      setSeatData([]);
    }
  };

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

  useEffect(() => {
    if (!id || !showtimes) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingShowtimes = showtimes
      .filter(st => st.movie_id === id)
      .filter(st => {
        const endDate = new Date(st.end_time);
        return now <= endDate;
      });

    let allDates = [];
    upcomingShowtimes.forEach(st => {
      const startDate = new Date(st.start_time);
      const effectiveStartDate = startDate < now ? now : startDate;
      const datesBetween = getDatesBetween(effectiveStartDate, st.end_time);
      allDates = [...allDates, ...datesBetween];
    });

    const uniqueDates = [...new Set(allDates)];

    const formattedDates = uniqueDates.map(date => {
      const d = new Date(date);
      return {
        date: d.getDate(),
        day: `Th.${d.getMonth() + 1}`,
        weekDay: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"][d.getDay()],
        fullDate: date
      };
    });

    formattedDates.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

    setDates(formattedDates);
    if (formattedDates.length > 0) {
      setSelectedDate(formattedDates[0].fullDate);
    }
  }, [id, showtimes]);

  useEffect(() => {
    if (!selectedDate || !allScreenings || !showtimes) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    console.log(today)
    const movieShowtimeIds = showtimes
      .filter(st => st.movie_id === id)
      .map(st => st.showtime_id);

    const filteredScreenings = allScreenings
      .filter(sc => movieShowtimeIds.includes(sc.showtime_id))
      .filter(sc => {
        const screeningDate = new Date(sc.screening_date).toISOString().split("T")[0];
        if (screeningDate !== selectedDate) return false;

        if (screeningDate === today) {
          const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
          const [hours, minutes] = sc.start_time.split(":");
          const screeningTime = parseInt(hours) * 3600 + parseInt(minutes) * 60;
          return screeningTime >= currentTime;
        }
        return true;
      });

    setScreenings(filteredScreenings);
  }, [selectedDate, allScreenings, showtimes, id]);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const startCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCountdown(600);
    setCountdownDisplay("10:00");

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(countdownRef.current);
          window.location.reload();
          return 0;
        }

        const minutes = Math.floor(prev / 60);
        const seconds = prev % 60;
        setCountdownDisplay(
          `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
        );
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectScreening = (screening) => {
    setSelectedScreening(screening);
    setSelectedSeats([]);
    setTotalPrice(0);
    fetchSeatsByRoom(screening.room_id, screening.screening_id);
    startCountdown();
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prevSelected) => {
      let newSelected;
      if (prevSelected.includes(seatId)) {
        newSelected = prevSelected.filter((id) => id !== seatId);
      } else {
        newSelected = [...prevSelected, seatId];
      }

      let total = 0;
      newSelected.forEach((selectedSeatId) => {
        const seat = seatData.find((s) => s.seat_id === selectedSeatId);
        if (seat) {
          if (seat.seat_type === "regular") {
            total += 60000;
          } else if (seat.seat_type === "vip") {
            total += 65000;
          } else if (seat.seat_type === "couple") {
            total += 150000;
          }
        }
      });
      setTotalPrice(total);
      return newSelected;
    });
  };

  const handlePayment = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    navigate('/checkout', {
      state: {
        screening_id: selectedScreening.screening_id,
        selectedSeats: selectedSeats.map((seatId) => {
          const seat = seatData.find((s) => s.seat_id === seatId);
          let price;
          if (seat.seat_type === "regular") price = 60000;
          else if (seat.seat_type === "vip") price = 65000;
          else if (seat.seat_type === "couple") price = 150000;
          return {
            seat_id: seat.seat_id,
            seat_name: seat.seat_number,
            price: price,
          };
        }),
        totalPrice: totalPrice,
        title: selectedScreening.movie_title,
        screening_date: new Date(selectedScreening.screening_date).toLocaleDateString(),
        time: `${formatTime(selectedScreening.start_time)} - ${formatTime(selectedScreening.end_time)}`,
        screening_format: selectedScreening.screening_format,
        room_name: selectedScreening.room_name,
      },
    });
  };

  if (!movie) return <p style={{ marginTop: '70px' }}>Đang tải...</p>;

  return (
    <div className='container-details'>
      <Card className="bg-dark text-light rounded-0 position-relative min-h-auto">
        <Card.Img src={`${API_URL}${movie.poster_url}`} className='rounded-0 object-fit-cover' alt="Poster" style={{ opacity: '0.2', height: '400px' }} />
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

      <div className='container-date text-light bg-dark'>
        <div className="date-list">
          {dates.map((item) => (
            <div
              key={item.fullDate}
              className={`date ${selectedDate === item.fullDate ? "selected" : ""}`}
              onClick={() => {
                setSelectedDate(item.fullDate);
                setSelectedScreening(null);
                setSelectedSeats([]);
                setTotalPrice(0);
                clearInterval(countdownRef.current);
              }}
            >
              <p>{item.day}</p>
              <p className="fs-5 fw-bold">{item.date}</p>
              <p>{item.weekDay}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='container-showtime'>
        <p className='text-center text-warning'>Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.</p>
        <div className='showtime'>
          {screenings.length > 0 ? (
            screenings.map(screening => (
              <button
                key={screening.screening_id}
                onClick={() => handleSelectScreening(screening)}
                className={selectedScreening?.screening_id === screening.screening_id ? "selected" : ""}
              >
                {formatTime(screening.start_time)} - {formatTime(screening.end_time)}
              </button>
            ))
          ) : (
            <p className='text-light'>Không có suất chiếu</p>
          )}
        </div>
      </div>

      {selectedScreening && (
        <div className='w-75 m-auto text-light my-4'>
          <div className='d-flex justify-content-between'>
            <p>
              Giờ chiếu: <span className='fw-bold'>{formatTime(selectedScreening.start_time)} - {formatTime(selectedScreening.end_time)}</span>
            </p>
            <div className='border border-warning rounded p-2'>
              <span>Thời gian chọn ghế: </span>
              <span className='fw-bold'>{countdownDisplay}</span>
            </div>
          </div>

          <div className='my-2'>
            <img src='/screen.jpg' className='w-100' alt='Screen' />
            <h5 className='text-center fw-bold'>{selectedScreening.room_name}</h5>
          </div>

          {seatData.length > 0 ? (
            Array.from(new Set(seatData.map((seat) => seat.seat_number[0]))).map((row) => (
              <div key={row} className="seat-row">
                {seatData
                  .filter((seat) => seat.seat_number.startsWith(row))
                  .map((seat) => (
                    <Button
                      key={seat.seat_id}
                      className={`seat ${seat.seat_type} ${seat.seat_status === "booked" ? "booked" : ""} ${selectedSeats.includes(seat.seat_id) ? "selected" : ""}`}
                      style={seat.seat_status === "booked" ? { backgroundImage: 'url(/vietnam.png)', zIndex: '100' } : {}}
                      disabled={seat.seat_status === "booked"}
                      onClick={() => toggleSeat(seat.seat_id)}
                    >
                      {seat.seat_number}
                    </Button>
                  ))}
              </div>
            ))
          ) : (
            <p>Đang tải ghế...</p>
          )}

          <div className='d-flex justify-content-around my-2'>
            <div className='d-flex gap-2 align-items-center'>
              <button style={{ backgroundImage: 'url(/vietnam.png)' }} className='seat1'></button> <span>Đã đặt</span>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <button className='seat1' style={{ backgroundColor: 'rgb(13, 202, 240)' }}></button> <span>Đang chọn</span>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <button className='seat1' style={{ backgroundColor: 'rgb(36, 36, 36)' }}></button> <span>Ghế thường</span>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <button className='seat1' style={{ backgroundColor: 'rgb(255, 132, 19)' }}></button> <span>Ghế vip</span>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <button className='seat1' style={{ backgroundColor: 'rgb(255, 55, 65)' }}></button> <span>Ghế đôi</span>
            </div>
          </div>

          <div className='d-flex justify-content-between my-4'>
            <div className='fs-6'>
              <p className='m-0'>Ghế đã chọn: <span>
                {selectedSeats.length > 0
                  ? selectedSeats
                      .map((seatId) => {
                        const seat = seatData.find((s) => s.seat_id === seatId);
                        return seat ? seat.seat_number : seatId;
                      })
                      .join(", ")
                  : " "}
              </span></p>
              <p>Tổng tiền: <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
            </div>
            <div>
              <Button
                variant='dark'
                className='rounded-pill mx-2 p-2'
                onClick={() => {
                  setSelectedScreening(null);
                  setSelectedSeats([]);
                  setTotalPrice(0);
                  clearInterval(countdownRef.current);
                }}
              >
                Quay lại
              </Button>
              <Button
                variant='danger'
                className='rounded-pill p-2'
                onClick={handlePayment}
                disabled={selectedSeats.length === 0}
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;