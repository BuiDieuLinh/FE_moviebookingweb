// Screenings.jsx
import React, { useEffect, useState } from 'react';
import { useToast } from "./ToastContext";
import axios from "axios";
import { Table, Button, Modal, Form, Accordion, Row, Col, Pagination } from "react-bootstrap";
import "./showtimes.css";

const API_URL = process.env.REACT_APP_PORT;

export const Screening = () => {
  const { showToast } = useToast();
  const [screenings, setScreenings] = useState([]);
  const [showtime, setShowtime] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showModalScreen, setShowModalScreen] = useState(false);
  const [formDataScreen, setFormDataScreen] = useState({
    showtime_id: '', room_id: '', screening_date: '', start_time: '',
    end_time: '', screening_format: '', screening_translation: ''
  });
  const [searchRoom, setSearchRoom] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchScreenings();
    fetchShowtime();
    fetchRooms();
  }, []);

  const fetchScreenings = async () => {
    try {
      const response = await axios.get(`${API_URL}/screenings`);
      setScreenings(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách suất chiếu:", error);
      setScreenings([]);
    }
  };

  const fetchShowtime = async () => {
    try {
      const response = await axios.get(`${API_URL}/showtimes`);
      setShowtime(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch chiếu:", error);
      setShowtime([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phòng chiếu:", error);
      setRooms([]);
    }
  };

  const handleShowModalScreen = (screening = null) => {
    setSelectedScreen(screening);
    setFormDataScreen(screening ? {
      showtime_id: screening.showtime_id || '',
      room_id: screening.room_id || '',
      screening_date: screening.screening_date ? new Date(screening.screening_date).toLocaleDateString("sv-SE") : "",
      start_time: screening.start_time || '',
      end_time: screening.end_time || '',
      screening_format: screening.screening_format || '',
      screening_translation: screening.screening_translation || ''
    } : {
      showtime_id: '', room_id: '', screening_date: '', start_time: '',
      end_time: '', screening_format: '', screening_translation: ''
    });
    setShowModalScreen(true);
  };

  const handleCloseModalScreen = () => setShowModalScreen(false);

  const handleInputChangeScreen = (e) => {
    setFormDataScreen({ ...formDataScreen, [e.target.name]: e.target.value });
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const isValidTime = (timeString) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeString);
  };

  const formatTimeInput = (timeString) => {
    return timeString.length === 5 ? timeString + ":00" : timeString;
  };

  const handleSaveScreening = async () => {
    try {
      if (!Object.values(formDataScreen).every(val => val)) {
        showToast("Cảnh báo", "Vui lòng nhập đầy đủ thông tin suất chiếu!");
        return;
      }

      if (!isValidDate(formDataScreen.screening_date) || 
          !isValidTime(formDataScreen.start_time) || 
          !isValidTime(formDataScreen.end_time)) {
        showToast("Lỗi", "Định dạng ngày hoặc giờ không hợp lệ!");
        return;
      }

      const formattedData = {
        ...formDataScreen,
        screening_date: new Date(formDataScreen.screening_date).toLocaleDateString("en-CA"),
        start_time: formatTimeInput(formDataScreen.start_time),
        end_time: formatTimeInput(formDataScreen.end_time),
      };

      const response = selectedScreen
        ? await axios.put(`${API_URL}/screenings/${selectedScreen.screening_id}`, formattedData)
        : await axios.post(`${API_URL}/screenings`, formattedData);

      showToast("Suất chiếu", selectedScreen ? "Cập nhật suất chiếu thành công!" : "Thêm suất chiếu thành công!");
      fetchScreenings();
      handleCloseModalScreen();
    } catch (error) {
      console.error("Lỗi khi lưu suất chiếu:", error);
      showToast("Lỗi", "Lưu suất chiếu thất bại!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  };

  const filteredScreenings = screenings.filter(screen => {
    const roomMatch = searchRoom ? screen.room_id === searchRoom : true;
    const dateMatch = searchDate ? 
      new Date(screen.screening_date).toLocaleDateString("sv-SE") === searchDate : true;
    return roomMatch && dateMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentScreenings = filteredScreenings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const selectedName = rooms.find(room => room.room_id === searchRoom)

  const now = new Date();

  const upcomingShowtimes = showtime.filter((show) => {
    const startDate = new Date(show.start_time);
    const endDate = new Date(show.end_time);
    return now >= startDate && now <= endDate;

  });

  const getStatusInfo = (screening) => {
    const now = new Date();
  
    const [year, month, day] = screening.screening_date.split("T")[0].split("-");
    const [startHour, startMinute, startSecond] = screening.start_time.split(":");
    const [endHour, endMinute, endSecond] = screening.end_time.split(":");
  
    const start = new Date(year, month - 1, day, startHour, startMinute, startSecond);
    const end = new Date(year, month - 1, day, endHour, endMinute, endSecond);
  
    if (now < start) {
      return {
        label: "Sắp chiếu",
        class: "commingsoon"
      };
    } else if (now >= start && now <= end) {
      return {
        label: "Đang chiếu",
        class: "nowshowing"
      };
    } else {
      return {
        label: "Đã chiếu",
        class: "completed"
      };
    }
  };
  
  // console.log(selectedName)
  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>Suất chiếu</Accordion.Header>
      <Accordion.Body>
        <div className='d-flex justify-content-between mb-3'>
          <div className='d-flex gap-4'>
            <Form.Group as={Row}>
              <Form.Label column sm='5'>Phòng chiếu:</Form.Label>
              <Col sm="7">
                <Form.Select 
                  size='sm' 
                  value={searchRoom} 
                  onChange={(e) => setSearchRoom(e.target.value)}
                >
                  <option value="">Tất cả phòng</option>
                  {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="5">Ngày chiếu:</Form.Label>
              <Col sm="7">
                <Form.Control 
                  type="date" 
                  size='sm'
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </Col>
            </Form.Group>
          </div>
          <Button variant='danger' size='sm' onClick={() => handleShowModalScreen(null)}>
            Tạo suất chiếu
          </Button>
        </div>

        <div>
          {!searchDate || !searchDate ? "" : <p className='fw-bold text-center text-success'>Lịch chiếu ngày: <span>{searchDate}</span> - <span> {selectedName?.room_name}</span></p>}
          
        </div>
        <div className="table-responsive rounded-2">
          <Table hover>
            <thead>
              <tr>
                <th>Phim chiếu</th>
                <th>Phòng chiếu</th>
                <th>Hình thức chiếu</th>
                <th>Hình thức dịch</th>
                <th>Thời gian chiếu</th>
                <th>Ngày chiếu</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentScreenings.map((screen) => {
                const today = new Date();
                const screeningDate = new Date(screen.screening_date);
                const statusStyle = screeningDate < today ? "completed" : screeningDate > today ? "commingsoon" : "nowshowing";
                const formatStyle = screen.screening_format === "2D" ? "style2d" : 
                  screen.screening_format === "3D" ? "style3d" : "styleimax";

                return (
                  <tr key={screen.screening_id}>
                    <td className='movie-title-column'>{screen.movie_title}</td>
                    <td>{screen.room_name}</td>
                    <td className='text-center'><span className={formatStyle}>{screen.screening_format}</span></td>
                    <td className='text-center'><span className='translator'>{screen.screening_translation}</span></td>
                    <td><span className='screening'>{`${screen.start_time} - ${screen.end_time}`}</span></td>
                    <td className='text-center'>{formatDate(screen.screening_date)}</td>
                    <td className='text-center'><span className={getStatusInfo(screen).class}>{getStatusInfo(screen).label}</span></td>
                    <td className="text-end">
                      <Button
                        style={{ border: "1px solid #A9141E", backgroundColor: "#A9141E", color: "white" }}
                        size="sm"
                        onClick={() => handleShowModalScreen(screen)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        )}

        <Modal show={showModalScreen} onHide={handleCloseModalScreen}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedScreen ? "Chỉnh Sửa Suất Chiếu" : "Thêm Suất Chiếu"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Phim chiếu</Form.Label>
                <Form.Select name="showtime_id" value={formDataScreen.showtime_id} onChange={handleInputChangeScreen}>
                  <option value="">Chọn suất chiếu</option>
                  {upcomingShowtimes.map((show) => (
                    <option key={show.showtime_id} value={show.showtime_id}>
                      {show.movie_title} - {new Date(show.start_time).toLocaleDateString()} → {new Date(show.end_time).toLocaleDateString()}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phòng chiếu</Form.Label>
                <Form.Select name='room_id' value={formDataScreen.room_id} onChange={handleInputChangeScreen}>
                  <option value='' disabled>-- chọn phòng --</option>
                  {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày chiếu</Form.Label>
                <Form.Control
                  type="date"
                  name="screening_date"
                  value={formDataScreen.screening_date}
                  onChange={handleInputChangeScreen}
                  required
                />
              </Form.Group>
              <Row>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label>Giờ bắt đầu</Form.Label>
                  <Form.Control
                    type="time"
                    name="start_time"
                    value={formDataScreen.start_time}
                    onChange={handleInputChangeScreen}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label>Giờ kết thúc</Form.Label>
                  <Form.Control
                    type="time"
                    name="end_time"
                    value={formDataScreen.end_time}
                    onChange={handleInputChangeScreen}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Hình thức chiếu</Form.Label>
                <Form.Select name="screening_format" value={formDataScreen.screening_format} onChange={handleInputChangeScreen}>
                  <option value="">Chọn hình thức</option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hình thức dịch</Form.Label>
                <Form.Select name="screening_translation" value={formDataScreen.screening_translation} onChange={handleInputChangeScreen}>
                  <option value="">Chọn hình thức</option>
                  <option value="Phụ đề">Phụ đề</option>
                  <option value="Thuyết minh">Thuyết minh</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalScreen}>Đóng</Button>
            <Button variant="primary" onClick={handleSaveScreening}>Lưu</Button>
          </Modal.Footer>
        </Modal>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Screening;