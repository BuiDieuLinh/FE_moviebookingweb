import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import {
  Button,
  Form,
  Modal,
  Dropdown,
  Table,
  Accordion,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./room.css";
import { useNavigate } from "react-router-dom";

// Hàm generateSeats giữ nguyên
const generateSeats = (type) => {
  let totalSeats = type === 1 ? 100 : type === 2 ? 90 : 80;
  let rows = totalSeats / 10;
  let seats = [];

  for (let i = 1; i <= rows; i++) {
    if (i < rows) {
      for (let j = 1; j <= 10; j++) {
        let seatId = `${String.fromCharCode(64 + i)}${j}`;
        let seatType = i <= 4 ? "regular" : "vip";
        seats.push({ id: seatId, type: seatType });
      }
    } else {
      for (let j = 1; j <= 5; j++) {
        let seatId = `${String.fromCharCode(64 + i)}${j * 2 - 1}-${j * 2}`;
        seats.push({ id: seatId, type: "couple" });
      }
    }
  }
  return seats;
};

const API_URL = process.env.REACT_APP_PORT;

export const Room = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [roomType, setRoomType] = useState("1"); 
  const [seatData, setSeatData] = useState(generateSeats("1"));
  const [rooms, setRooms] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_id: "",
    room_name: "",
    room_type: 1,
    total_seats: "",
    room_status: "",
  });
  const [filter, setFilter] = useState({
    date: new Date().toISOString().split("T")[0],
    period: "day",
    roomId: "",
  });

  useEffect(() => {
    setSeatData(generateSeats(roomType));
    fetchData();
  }, [roomType]);

  const fetchData = async () => {
    try {
      const responseRooms = await axios.get(`${API_URL}/rooms`);
      const responseScreenings = await axios.get(`${API_URL}/screenings`);
      setRooms(responseRooms.data || []); 
      setScreenings(responseScreenings.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showToast("Lỗi", "Không thể lấy dữ liệu phòng!","error");
      setRooms([]); 
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "room_type") {
        const newRoomType = parseInt(value);
        setRoomType(newRoomType);
        setSeatData(generateSeats(newRoomType));
      }
      return updatedData;
    });
  };

  const handleSaveRoom = async () => {
    try {
      if (!formData.room_name || !formData.room_type) {
        showToast("Warning", "Vui lòng nhập đầy đủ thông tin phòng!", "warning");
        return;
      }
      const roomId = selectedRoom
        ? selectedRoom.room_id
        : `R${Math.floor(1000 + Math.random() * 9000)}`;
      const total_seats = { 1: 100, 2: 90, 3: 80 }[formData.room_type];
      const dataToSave = {
        room_id: roomId,
        room_name: formData.room_name,
        room_type: formData.room_type,
        total_seats,
      };

      if (selectedRoom) {
        await axios.put(`${API_URL}/rooms/${selectedRoom.room_id}`, dataToSave);
        showToast("Phòng", "Cập nhật phòng thành công!","success");
      } else {
        await axios.post(`${API_URL}/rooms`, dataToSave);
        showToast("Phòng", "Thêm phòng thành công!", "success");
        const seatsToCreate = seatData.map((seat) => ({
          seat_id: `${seat.id}-${roomId}`,
          seat_number: seat.id,
          seat_type: seat.type,
          room_id: roomId,
        }));
        await axios.post(`${API_URL}/seats/bulk`, seatsToCreate);
        showToast("Ghế", "Tạo ghế cho phòng thành công!","success");
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      showToast("Lỗi", "Lưu phòng thất bại!","error");
    }
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatId)
        ? prevSelected.filter((id) => id !== seatId)
        : [...prevSelected, seatId],
    );
  };

  const handleShowModal = (room = null) => {
    setSelectedRoom(room);
    const data = room || {
      room_name: "",
      room_type: 1,
      total_seats: "",
      room_status: "",
    };
    setFormData(data);
    setRoomType(data.room_type || 1);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Xử lý trạng thái phòng
  const updatedRooms = useMemo(() => {
    const now = new Date();
    const todayStr = filter.date;

    return rooms.map((room) => {
      const isBusy = screenings.some((screening) => {
        if (screening.room_id !== room.room_id) return false;
        const screeningDateStr = screening.screening_date;
        if (screeningDateStr !== todayStr) return false;

        const [startHour, startMinute] = screening.start_time.split(":");
        const [endHour, endMinute] = screening.end_time.split(":");
        const start = new Date(todayStr);
        start.setHours(startHour, startMinute);
        const end = new Date(todayStr);
        end.setHours(endHour, endMinute);

        return now >= start && now <= end;
      });

      return {
        ...room,
        room_status: isBusy ? 1 : 0,
        status_label: isBusy ? "Đang chiếu" : "Sẵn sàng",
      };
    });
  }, [rooms, screenings, filter.date]);


  return (
    <div className="container-room">
      <div className="p-0">
        <div className="d-flex justify-content-between align-items-center gap-2 p-2 mb-2 rounded-2">
          <p className="m-0">
            Total:{" "}
            <span
              className="rounded-1 p-1"
              style={{ backgroundColor: "rgba(168, 0, 0, 0.3)" }}
            >
              {rooms.length} rooms
            </span>
          </p>
          <div className="d-flex align-items-center gap-2">
            <Button
              style={{ backgroundColor: "#A9141E", border: "none" }}
              size="sm"
              onClick={() => handleShowModal()}
            >
              <i className="fas fa-plus"></i> Tạo phòng
            </Button>
          </div>
        </div>

        <div className="table-responsive rounded-2">
          <Table hover>
            <thead>
              <tr>
                <th>Tên phòng</th>
                <th>Loại phòng</th>
                <th>Tổng số ghế</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {updatedRooms.map((room) => {
                const styleStatus =
                  room.room_status === 1 ? "showing" : "ready";
                const type = room.room_type;
                let roomTypeDisplay = "";
                let styleRoomType = "";
                if (type === 1) {
                  roomTypeDisplay = "Normal";
                  styleRoomType = "normal";
                } else if (type === 2) {
                  roomTypeDisplay = "Standard";
                  styleRoomType = "standard";
                } else if (type === 3) {
                  roomTypeDisplay = "Vip";
                  styleRoomType = "roomvip";
                }
                return (
                  <tr key={room.room_id}>
                    <td onClick={() => navigate(`/room/${room.room_id}`)}>{room.room_name}</td>
                    <td>
                      <span className={styleRoomType}>
                        {roomTypeDisplay}
                      </span>
                    </td>
                    <td>{room.total_seats}</td>
                    <td>
                      <span className={styleStatus}>
                        {room.status_label}
                      </span>
                    </td>
                    <td>
                      <Button
                        style={{
                          border: "1px solid #A9141E",
                          backgroundColor: "transparent",
                          color: "#A9141E",
                        }}
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(room)}
                      >
                        <i className="fas fa-edit"></i> Sửa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRoom ? "Chỉnh Sửa Phòng" : "Tạo phòng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="w-75 m-auto">
              <Form.Group className="mb-2" controlId="formName">
                <Form.Label>Tên phòng *</Form.Label>
                <Form.Control
                  name="room_name"
                  value={formData.room_name}
                  size="sm"
                  type="text"
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formRoomType">
                <Form.Label>Loại phòng</Form.Label>
                <Form.Select
                  size="sm"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleInputChange}
                >
                  <option value="1">Normal (100 ghế)</option>
                  <option value="2">Standard (90 ghế)</option>
                  <option value="3">Vip (80 ghế)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formStatus">
                <Form.Label>Trạng thái</Form.Label>
                <div className="mb-3">
                  <Form.Check
                    inline
                    label="Sẵn sàng"
                    name="room_status"
                    type="radio"
                    value="0"
                    checked={formData.room_status === 0}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Check
                    inline
                    label="Đang chiếu"
                    name="room_status"
                    type="radio"
                    value="1"
                    checked={formData.room_status === 1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </Form.Group>
              <div>
                <h5>Danh sách ghế</h5>
                {Array.from(
                  new Set(seatData.map((seat) => seat.id[0])),
                ).map((row) => (
                  <div key={row} className="seat-row">
                    {seatData
                      .filter((seat) => seat.id.startsWith(row))
                      .map((seat) => (
                        <Button
                          key={seat.id}
                          className={`seat ${seat.type} ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                          onClick={() => toggleSeat(seat.id)}
                        >
                          {seat.id}
                        </Button>
                      ))}
                  </div>
                ))}
                <div className="text-center mt-3">
                  <strong>Ghế đã chọn:</strong>{" "}
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "Chưa chọn"}
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2">
                    <Button variant="secondary" size="sm">
                      Đã đặt
                    </Button>
                    <Button
                      variant="info"
                      className="text-light"
                      size="sm"
                    >
                      Đang chọn
                    </Button>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      style={{
                        backgroundColor: "rgb(128, 128, 128)",
                        border: "none",
                      }}
                      size="sm"
                    >
                      Ghế thường
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "rgb(255, 132, 19)",
                        border: "none",
                      }}
                      size="sm"
                    >
                      Ghế Vip
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "rgb(255, 55, 65)",
                        border: "none",
                      }}
                      size="sm"
                    >
                      Ghế đôi
                    </Button>
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="success" onClick={handleSaveRoom}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Room;
