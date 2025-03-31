import React, { useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import { Button, Form, Modal, Dropdown, Table } from "react-bootstrap";
import "./room.css";

const generateSeats = (type) => {
  let totalSeats = type === 1 ? 100 : type === 2 ? 90 : 80;
  let rows = totalSeats / 10;
  let seats = [];

  for (let i = 1; i <= rows; i++) {
    if (i < rows) {
      for (let j = 1; j <= 10; j++) {
        let seatId = `${String.fromCharCode(64 + i)}${j}`;
        let seatType = i <= 4 ? "thuong" : "vip";
        seats.push({ id: seatId, type: seatType });
      }
    } else {
      for (let j = 1; j <= 5; j++) {
        let seatId = `${String.fromCharCode(64 + i)}${j * 2 - 1}-${j * 2}`;
        seats.push({ id: seatId, type: "doi" });
      }
    }
  }

  return seats;
};

const API_URL = process.env.REACT_APP_PORT;

export const Room = () => {
  const { showToast } = useToast();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [roomType, setRoomType] = useState("0");
  const [seatData, setSeatData] = useState(generateSeats("1"));
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_name: "",
    room_type: 1, // Khởi tạo mặc định
    total_seats: "",
    room_status: "",
  });

  useEffect(() => {
    setSeatData(generateSeats(roomType));
    fetchRoom();
  }, [roomType]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${API_URL}/rooms`);
      setRooms(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phòng:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      if (name === "room_type") {
        const newRoomType = parseInt(value); // kiểu dữ liệu trog csdl của room_type là int
        setRoomType(newRoomType);
        setSeatData(generateSeats(newRoomType)); // Cập nhật danh sách ghế ngay lập tức
      }
      return updatedData;
    });
  };
  const handleSaveRoom = async () => {
    try {
      if (!formData.room_name || !formData.room_type) {
        console.error("Vui lòng nhập đầy đủ thông tin phòng!");
        showToast("Warning", "Vui lòng nhập đầy đủ thông tin phòng!");
        return;
      }

      // Tính toán total_seats dựa trên room_type
      const total_seats = {
        1: 100,
        2: 90,
        3: 80,
      }[formData.room_type];
      console.log(formData.room_type)
      const dataToSave = { ...formData, total_seats };
       console.log(dataToSave)
      if (selectedRoom) {
        // Cập nhật phòng
        try {
          const res = await axios.put(`${API_URL}/rooms/${selectedRoom.room_id}`, dataToSave);
          if (res.status === 200) {
            console.log("Phòng đã được cập nhật thành công:", res.data);
            showToast("Phòng", "Cập nhật phòng thành công!");
          } else {
            throw new Error("Lỗi: Không có hàng nào được cập nhật!");
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật phòng:", error.response ? error.response.data : error.message);
          showToast("Warning", "Lỗi khi cập nhật phòng");
        }
      } else {
        // Thêm mới phòng
        try {
          const response = await axios.post(`${API_URL}/rooms`, dataToSave);
          console.log("🟢 Phản hồi khi thêm phòng:", response.data);
  
          if (response.status === 200 && response.data) {
            showToast("Phòng", "Thêm phòng thành công!");
          } else {
            throw new Error("Lỗi: Không có dữ liệu nào được thêm!");
          }
        } catch (error) {
          console.error("🔴 Lỗi khi thêm phòng:", error.response ? error.response.data : error.message);
          showToast("Warning", "Lỗi khi thêm phòng");
        }
      }

      fetchRoom(); // Load lại danh sách phòng
      handleCloseModal(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      showToast("Lỗi", "Lưu phòng thất bại!");
    }
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatId)
        ? prevSelected.filter((id) => id !== seatId)
        : [...prevSelected, seatId]
    );
  };

  const handleShowModal = (room = null) => {
    setSelectedRoom(room);
    const data = room || { room_name: "", room_type: 1, total_seats: "", room_status: "" };
    setFormData(data);
    setRoomType(data.room_type || 1); // Đồng bộ roomType khi mở modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container-room">
      <div className="container p-0">
        <div className="d-flex justify-content-between align-items-center gap-2 p-2 mb-2 rounded-2 ">
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
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                Loại phòng
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Action</Dropdown.Item>
                <Dropdown.Item href="#">Another action</Dropdown.Item>
                <Dropdown.Item href="#">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="table-responsive rounded-2">
          <Table hover>
            <thead>
              <tr>
                <th>Tên phòng</th>
                <th>Loại phòng</th>
                <th>Tổng số ghế</th>
                <th>Ghế đã đặt</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              
              {rooms.map((room) => {
                 const status = room.room_status === 1 ? "Đang chiếu" : "Sẵn sàng";
                 const styleStatus = room.room_status === 1 ? "showing" : "ready";
                 const type = room.room_type;
                  let roomTypeDisplay = "";
                  let styleRoomType = "";
                 if(type === 1){
                    roomTypeDisplay = "Normal";
                    styleRoomType = 'normal';
                 } else if (type === 2){
                    roomTypeDisplay = "Standard";
                    styleRoomType = 'standard';
                 } else if (type === 3){
                      roomTypeDisplay = "Vip";
                      styleRoomType = 'roomvip';
                 }
                 return(
                  <tr key={room.id}>
                  <td>{room.room_name}</td>
                  <td><span className={styleRoomType}>{roomTypeDisplay}</span></td>
                  <td>{room.total_seats}</td>
                  <td className="text-danger">{0}</td>
                  <td>
                    <span className={styleStatus}>{status}</span>
                  </td>
                  <td >
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
            <Modal.Title>{selectedRoom ? "Chỉnh Sửa Phòng" : "Tạo phòng"}</Modal.Title>
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
                {Array.from(new Set(seatData.map((seat) => seat.id[0]))).map((row) => (
                  <div key={row} className="seat-row">
                    {seatData
                      .filter((seat) => seat.id.startsWith(row))
                      .map((seat) => (
                        <Button
                          key={seat.id}
                          className={`seat ${seat.type} ${
                            selectedSeats.includes(seat.id) ? "selected" : ""
                          }`}
                          onClick={() => toggleSeat(seat.id)}
                        >
                          {seat.id}
                        </Button>
                      ))}
                  </div>
                ))}
                <div className="text-center mt-3">
                  <strong>Ghế đã chọn:</strong>{" "}
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
                </div>

                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2">
                    <Button variant="secondary" size="sm">Đã đặt</Button>
                    <Button variant="info" className="text-light" size="sm">Đang chọn</Button>
                  </div>
                  <div className="d-flex gap-2">
                    <Button style={{backgroundColor: '#d1d0d0', border: 'none'}} size="sm">Ghế thường</Button>
                    <Button style={{backgroundColor: '#ffcc00', border: 'none'}} size="sm">Ghế Vip</Button>
                    <Button style={{backgroundColor: '#ff6666', border: 'none'}} size="sm">Ghế đôi</Button>
                  </div>
                </div>
                <hr></hr>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="success" onClick={handleSaveRoom}>Lưu</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Room;