// import React, { useEffect, useState } from 'react';
// import { useToast } from "./ToastContext";
// import axios from "axios";
// import { Table, Button, Modal, Form, Accordion, Row, Col } from "react-bootstrap";
// import "./showtimes.css";

// const API_URL = process.env.REACT_APP_PORT;

// export const Showtimes = () => {
//   const { showToast } = useToast();
//   const [movies, setMovies] = useState([]);
//   const [showtime, setShowtime] = useState([]);
//   const [selectedST, setSelectedST] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [formDataShowtime, setFormDataShowtime] = useState({
//     movie_id: '',
//     start_time: '',
//     end_time: ''
//   });
//   // screening
//   const [screenings, setScreening] = useState([]);
//   const [selectedScreen, setSelectedScreen] = useState(null);
//   const [showModalScreen, setShowModalScreen] = useState(false);
//   const [formDataScreen, setFormDataScreen] = useState({
//     showtime_id: '',
//     room_id: '',
//     screening_date: '',
//     start_time: '',
//     end_time: '',
//     screening_format: '',
//     screening_translation: ''
//   });
//   // room
//   const [rooms, setRoom] = useState([])

//   useEffect(() => {
//     fetchShowtime();
//     fetchMovies();
//     fetchScreening();
//     fetchRoom();
//   }, []);

//   const fetchShowtime = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/showtimes`);
//       if (Array.isArray(response.data)) {
//         setShowtime(response.data);
//       } else {
//         console.error("Dữ liệu lịch chiếu không phải mảng:", response.data);
//         setShowtime([]);
//       }
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách lịch chiếu:", error.response ? error.response.data : error.message);
//       setShowtime([]);
//     }
//   };

//   const fetchMovies = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/movies`);
//       if (Array.isArray(response.data)) {
//         setMovies(response.data);
//       } else {
//         console.error("Dữ liệu phim không phải mảng:", response.data);
//         setMovies([]);
//       }
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách phim:", error.response ? error.response.data : error.message);
//       setMovies([]);
//     }
//   };

//   const fetchScreening = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/screenings`);
//         setScreening(response.data);
//         console.log(response.data)
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách suất chiếu:", error.response ? error.response.data : error.message);
//       setScreening([]);
//     }
//   };

//   const fetchRoom = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/rooms`);
//         setRoom(response.data);
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách suất chiếu:", error.response ? error.response.data : error.message);
//       setRoom([]);
//     }
//   };

//   const handleShowModal = (showtime = null) => {
//     setSelectedST(showtime);
//     if (showtime) {
//       setFormDataShowtime({
//         movie_id: showtime.movie_id || '',
//         start_time: showtime.start_time 
//             ? new Date(showtime.start_time).toLocaleDateString("sv-SE") 
//             : "",
//         end_time: showtime.end_time 
//             ? new Date(showtime.end_time).toLocaleDateString("sv-SE") 
//             : "",
//       });
//     } else {
//       setFormDataShowtime({ movie_id: '', start_time: '', end_time: '' });
//     }
//     setShowModal(true);
//   };

//   const handleShowModalScreen = (screening = null) => {
//     setSelectedScreen(screening);
//     if (screening) {
//       setFormDataScreen({
//         showtime_id: screening.showtime_id || '',
//         room_id: screening.room_id || '',
//         screening_date: screening.screening_date ? new Date(screening.screening_date).toLocaleDateString("sv-SE") : "",
//         start_time: screening.start_time || '',
//         end_time: screening.end_time || '',
//         screening_format: screening.screening_format || '',
//         screening_translation: screening.screening_translation || ''
//       });
//     } else {
//       setFormDataScreen({
//         showtime_id: '',
//         room_id: '',
//         screening_date: '',
//         start_time: '',
//         end_time: '',
//         screening_format: '',
//         screening_translation: ''
//       });
//     }
//     setShowModalScreen(true);
//   };

//   const handleCloseModal = () => setShowModal(false);
//   const handleCloseModalScreen = () => setShowModalScreen(false);

//   const handleInputChange = (e) => {
//     setFormDataShowtime({ ...formDataShowtime, [e.target.name]: e.target.value });
//   };

//   const handleInputChangeScreen = (e) => {
//     setFormDataScreen({ ...formDataScreen, [e.target.name]: e.target.value });
//   };

//   const handleSaveShowTime = async () => {
//     try {
//       if (!formDataShowtime.movie_id || !formDataShowtime.start_time || !formDataShowtime.end_time) {
//         showToast("Cảnh báo", "Vui lòng nhập đầy đủ thông tin!");
//         return;
//       }
//       const formattedData = {
//         ...formDataShowtime,
//         start_time: new Date(formDataShowtime.start_time).toLocaleDateString("en-CA"),
//         end_time: new Date(formDataShowtime.end_time).toLocaleDateString("en-CA"),
//       };
//       if (selectedST) {
//         const res = await axios.put(`${API_URL}/showtimes/${selectedST.showtime_id}`, formattedData);
//         if (res.status === 200) showToast("Lịch chiếu", "Cập nhật lịch chiếu thành công!");
//       } else {
//         const response = await axios.post(`${API_URL}/showtimes`, formattedData);
//         if (response.status === 201) showToast("Lịch chiếu", "Thêm lịch chiếu thành công!");
//       }
//       fetchShowtime();
//       handleCloseModal();
//     } catch (error) {
//       console.error("Lỗi khi lưu lịch chiếu:", error.response ? error.response.data : error.message);
//       showToast("Lỗi", "Lưu lịch chiếu thất bại!");
//     }
//   };

//   // validate dữ liệu
//   function isValidDate(dateString) {
//     const regex = /^\d{4}-\d{2}-\d{2}$/; // Kiểm tra định dạng YYYY-MM-DD
//     if (!regex.test(dateString)) return false;
//     const date = new Date(dateString);
//     return date instanceof Date && !isNaN(date);
// }

// function isValidTime(timeString) {
//     const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Kiểm tra định dạng HH:MM
//     return regex.test(timeString);
// }

// // Chuẩn hóa giờ thành dạng HH:MM:SS
// function formatTimeInput(timeString) {
//     return timeString.length === 5 ? timeString + ":00" : timeString; // Thêm giây nếu thiếu
// }

// function isValidScreeningTime(startTime, endTime) {
//     startTime = formatTimeInput(startTime);
//     endTime = formatTimeInput(endTime);
//     return endTime > startTime || endTime < "06:00"; // Cho phép kết thúc sau 0h nhưng không quá 6h sáng
// }

// // Kiểm tra dữ liệu đầu vào
// function validateScreeningData(screeningDate, startTime, endTime) {
//     if (!isValidDate(screeningDate)) {
//         showToast("Lỗi", "Ngày chiếu không hợp lệ! Định dạng đúng: YYYY-MM-DD");
//         return false;
//     }
    
//     if (!isValidTime(startTime) || !isValidTime(endTime)) {
//         showToast("Lỗi", "Giờ chiếu không hợp lệ! Định dạng đúng: HH:MM");
//         return false;
//     }

//     if (!isValidScreeningTime(startTime, endTime)) {
//         showToast("Lỗi", "Giờ kết thúc phải lớn hơn giờ bắt đầu hoặc không muộn hơn 06:00 sáng!");
//         return false;
//     }

//     return true;
// }

//   const handleSaveScreening = async () => {
//     try {
//         if (!formDataScreen.showtime_id || !formDataScreen.room_id || !formDataScreen.screening_date || 
//             !formDataScreen.start_time || !formDataScreen.end_time || !formDataScreen.screening_format || 
//             !formDataScreen.screening_translation) {
//             showToast("Cảnh báo", "Vui lòng nhập đầy đủ thông tin suất chiếu!");
//             return;
//         }

//         // Kiểm tra định dạng dữ liệu
//         if (!validateScreeningData(formDataScreen.screening_date, formDataScreen.start_time, formDataScreen.end_time)) {
//             return; // Nếu không hợp lệ thì dừng lại
//         }

//         // Định dạng lại ngày chiếu về dạng YYYY-MM-DD (MySQL yêu cầu)
//         const formattedData = {
//             ...formDataScreen,
//             screening_date: new Date(formDataScreen.screening_date).toLocaleDateString("en-CA"), // Chuyển về format YYYY-MM-DD
//             start_time: formatTimeInput(formDataScreen.start_time),
//             end_time: formatTimeInput(formDataScreen.end_time),
//         };

//         if (selectedScreen) {
//             const res = await axios.put(`${API_URL}/screenings/${selectedScreen.screening_id}`, formattedData);
//             if (res.status === 200) showToast("Suất chiếu", "Cập nhật suất chiếu thành công!");
//         } else {
//             const response = await axios.post(`${API_URL}/screenings`, formattedData);
//             console.log(response);
//             if (response.status === 201) showToast("Suất chiếu", "Thêm suất chiếu thành công!");
//         }
        
//         fetchScreening();
//         handleCloseModalScreen();
//     } catch (error) {
//         console.error("Lỗi khi lưu suất chiếu:", error.response ? error.response.data : error.message);
//         showToast("Lỗi", "Lưu suất chiếu thất bại!");
//     }
// };


//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
//   };


//   const now = new Date();
//   const upcomingTime = new Date();
  
//   const upcomingShowtimes = showtime.filter((show) => {
//     const startDate = new Date(show.start_time);
//     const endDate = new Date(show.end_time);
//     return now >= startDate && now <= endDate;
    
//   });

//   return (
//     <div style={{ marginTop: '70px' }}>
//       <Accordion defaultActiveKey={['1']} alwaysOpen>
//         <Accordion.Item eventKey="0" className="mb-2">
//           <Accordion.Header>Lịch chiếu</Accordion.Header>
//           <Accordion.Body>
//             <Button variant='danger' size='sm' onClick={() => handleShowModal(null)}> 
//               <i className="fas fa-plus"></i> Tạo lịch chiếu
//             </Button>
//             <div className="table-responsive rounded-2">
//               <Table hover>
//                 <thead>
//                   <tr>
//                     <th>Phim chiếu</th>
//                     <th>Thời gian chiếu</th>
//                     <th>Phân loại</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Array.isArray(showtime) && showtime.length > 0 ? (
//                     showtime.map((st) => {
//                       const today = new Date();
//                       const startDate = new Date(st.start_time);
//                       const endDate = new Date(st.end_time);
//                       let status = "";
//                       let statusStyle = "";
//                       if (endDate < today) {
//                         status = "Hoàn thành";
//                         statusStyle = "completed";
//                       } else if (startDate > today) {
//                         status = "Sắp chiếu";
//                         statusStyle = "commingsoon";
//                       } else {
//                         status = "Đang chiếu";
//                         statusStyle = "nowshowing";
//                       }
//                       const movie = Array.isArray(movies) ? movies.find(m => m.movie_id === st.movie_id) || { title: 'Không xác định' } : { title: 'Không xác định' };

//                       return (
//                         <tr key={st.showtime_id || st.id}>
//                           <td>{movie.title}</td>
//                           <td>
//                             {formatDate(st.start_time)} - {formatDate(st.end_time)}
//                           </td>
//                           <td><span className={statusStyle}>{status}</span></td>
//                           <td className="text-end">
//                             <Button
//                               style={{ border: "1px solid #A9141E", backgroundColor: "#A9141E", color: "white" }}
//                               size="sm"
//                               className="me-2"
//                               onClick={() => handleShowModal(st)}
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="4">Không có lịch chiếu</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>

//             {/** popup lịch chiếu */}
//             <Modal show={showModal} onHide={handleCloseModal}>
//               <Modal.Header closeButton>
//                 <Modal.Title>{selectedST ? "Chỉnh Sửa Lịch Chiếu" : "Thêm Lịch Chiếu"}</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <Form>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Phim chiếu</Form.Label>
//                     <Form.Select name="movie_id" value={formDataShowtime.movie_id} onChange={handleInputChange}>
//                       <option value="">Chọn phim</option>
//                       {movies.map((movie) => (
//                         <option key={movie.movie_id} value={movie.movie_id}>{movie.title}</option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Ngày bắt đầu</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="start_time"
//                       value={formDataShowtime.start_time}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Ngày kết thúc</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="end_time"
//                       value={formDataShowtime.end_time}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </Form.Group>
//                 </Form>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
//                 <Button variant="primary" onClick={handleSaveShowTime}>Lưu</Button>
//               </Modal.Footer>
//             </Modal>
//           </Accordion.Body>
//         </Accordion.Item>

//         {/** Suất chiếu */}
//         <Accordion.Item eventKey="1">
//           <Accordion.Header>Suất chiếu</Accordion.Header>
//           <Accordion.Body>
//             <div className='d-flex justify-content-between mb-3'>
//               <div className='d-flex gap-4'>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm='5'>Phòng chiếu:</Form.Label>
//                   <Col sm="7">
//                     <Form.Select name="room_id" value={rooms.room_id} size='sm' >
//                       <option value="">Chọn phòng</option>
//                       {rooms.map((room) => (
//                         <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm="5">Ngày chiếu:</Form.Label>
//                   <Col sm="7">
//                     <Form.Control type="date" size='sm'/>
//                   </Col>
//                 </Form.Group>
//                 <Button size='sm' variant='info'><i class="fas fa-search"></i> Tìm kiếm</Button>
//               </div>
//               <Button variant='danger' size='sm' onClick={() => handleShowModalScreen(null)}>Tạo suất chiếu</Button>
//             </div>

//             <div className='w-100 d-inline-block text-center fw-bold mt-2 mb-3'>
//               Lịch chiếu ngày: 28-03-2025 - Phòng 1
//             </div>
//             <div className="table-responsive rounded-2">
//               <Table hover>
//                 <thead>
//                   <tr>
//                     <th>Phim chiếu</th>
//                     <th>Phòng chiếu</th>
//                     <th>Hình thức chiếu</th>
//                     <th>Hình thức dịch</th>
//                     <th>Thời gian chiếu</th>
//                     <th>Ngày chiếu</th>
//                     <th>Status</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Array.isArray(screenings) && screenings.length > 0 ? (
//                     screenings.map((screen) => {
//                       const today = new Date();
//                       const screeningDate = new Date(screen.screening_date);
//                       let status = screeningDate < today ? "Đã chiếu" : screeningDate > today ? "Sắp chiếu" : "Đang chiếu";
//                       let statusStyle = screeningDate < today ? "completed" : screeningDate > today ? "commingsoon" : "nowshowing";
//                       let format, formatStyle;
//                       if (screen.screening_format === "2D") {
//                         format = "2D";
//                         formatStyle = "style2d";
//                       } else if (screen.screening_format === "3D") {
//                         format = "3D";
//                         formatStyle = "style3d";
//                       } else if (screen.screening_format === "IMAX") {
//                         format = "IMAX";
//                         formatStyle = "styleimax";
//                       }
//                       return (
//                         <tr key={screen.screening_id}>
//                           <td>{screen.movie_title}</td>
//                           <td>{screen.room_name}</td>
//                           <td><span className={formatStyle}>{format}</span></td>
//                           <td><span className='translator'>{screen.screening_translation}</span></td>
//                           <td><span className='screening'>{`${screen.start_time} - ${screen.end_time}`}</span></td>
//                           <td>{formatDate(screen.screening_date)}</td>
//                           <td><span className={statusStyle}>{status}</span></td>
//                           <td className="text-end">
//                             <Button
//                               style={{ border: "1px solid #A9141E", backgroundColor: "#A9141E", color: "white" }}
//                               size="sm"
//                               className="me-2"
//                               onClick={() => handleShowModalScreen(screen)}
//                             >
//                               <i className="fas fa-edit"></i>
//                             </Button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td colSpan="8">Không có suất chiếu</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>

//             {/** popup suất chiếu */}
//             <Modal show={showModalScreen} onHide={handleCloseModalScreen}>
//               <Modal.Header closeButton>
//                 <Modal.Title>{selectedScreen ? "Chỉnh Sửa Suất Chiếu" : "Thêm Suất Chiếu"}</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <Form>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Phim chiếu</Form.Label>
//                     <Form.Select name="showtime_id" value={formDataScreen.showtime_id} onChange={handleInputChangeScreen}>
//                       <option value="">Chọn suất chiếu</option>
//                       {upcomingShowtimes.map((show) => (
//                         <option key={show.showtime_id} value={show.showtime_id}>
//                           {show.movie_title} - {new Date(show.start_time).toLocaleDateString()} → {new Date(show.end_time).toLocaleDateString()}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Phòng chiếu</Form.Label>
//                     <Form.Select name='room_id' value={formDataScreen.room_id} onChange={handleInputChangeScreen}>
//                       <option value='' disabled>-- chọn phòng --</option>
//                       {rooms.map((room) =>(
//                         <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Ngày chiếu</Form.Label>
//                     <Form.Control
//                       type="date"
//                       name="screening_date"
//                       value={formDataScreen.screening_date}
//                       onChange={handleInputChangeScreen}
//                       required
//                     />
//                   </Form.Group>
//                   <Row>
//                       <Form.Group as={Col} className="mb-3">
//                       <Form.Label>Giờ bắt đầu</Form.Label>
//                       <Form.Control
//                         type="time"
//                         name="start_time"
//                         value={formDataScreen.start_time}
//                         onChange={handleInputChangeScreen}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group as={Col} className="mb-3">
//                       <Form.Label>Giờ kết thúc</Form.Label>
//                       <Form.Control
//                         type="time"
//                         name="end_time"
//                         value={formDataScreen.end_time}
//                         onChange={handleInputChangeScreen}
//                         required
//                       />
//                     </Form.Group>
//                   </Row>
                  
//                   <Form.Group className="mb-3">
//                     <Form.Label>Hình thức chiếu</Form.Label>
//                     <Form.Select
//                       name="screening_format"
//                       value={formDataScreen.screening_format}
//                       onChange={handleInputChangeScreen}
//                       required
//                     >
//                       <option value="">Chọn hình thức</option>
//                       <option value="2D">2D</option>
//                       <option value="3D">3D</option>
//                       <option value="IMAX">IMAX</option>
//                     </Form.Select>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Hình thức dịch</Form.Label>
//                     <Form.Select
//                       name="screening_translation"
//                       value={formDataScreen.screening_translation}
//                       onChange={handleInputChangeScreen}
//                       required
//                     >
//                       <option value="">Chọn hình thức</option>
//                       <option value="Phụ đề">Phụ đề</option>
//                       <option value="Thuyết minh">Thuyết minh</option>
//                     </Form.Select>
//                   </Form.Group>
//                 </Form>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={handleCloseModalScreen}>Đóng</Button>
//                 <Button variant="primary" onClick={handleSaveScreening}>Lưu</Button>
//               </Modal.Footer>
//             </Modal>
//           </Accordion.Body>
//         </Accordion.Item>
//       </Accordion>
//     </div>
//   );
// };

// export default Showtimes;

// App.jsx or wherever you want to use them
import React from 'react';
import { Accordion } from "react-bootstrap";
import { Showtime } from './Showtime';
import { Screening } from './Screening';

const Showtimes = () => {
  return (
    <div style={{ marginTop: '70px' }}>
      <Accordion defaultActiveKey={['1']} alwaysOpen>
        <Showtime />
        <Screening />
      </Accordion>
    </div>
  );
};

export default Showtimes;