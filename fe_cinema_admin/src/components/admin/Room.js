import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import { Button, Form, Modal, Dropdown, Table, Accordion } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./room.css";

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
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [roomType, setRoomType] = useState("1"); // Khởi tạo mặc định là 1
  const [seatData, setSeatData] = useState(generateSeats("1"));
  const [rooms, setRooms] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
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

  const [barChartData, setBarChartData] = useState({
    labels: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    datasets: [
      {
        label: "Số suất chiếu",
        data: Array(7).fill(0),
        backgroundColor: "#A9141E",
      },
    ],
  });

  // Gọi fetchData khi component mount
  useEffect(() => {
    setSeatData(generateSeats(roomType));
    fetchData();
  }, [roomType]);

  const fetchData = async () => {
    try {
      const responseRooms = await axios.get(`${API_URL}/rooms`);
      const responseScreenings = await axios.get(`${API_URL}/screenings`);
      const responseBookings = await axios.get(`${API_URL}/bookings`);
      const responseBookingDetails = await axios.get(`${API_URL}/bookingdetails`);
      setRooms(responseRooms.data || []); // Đảm bảo rooms là mảng rỗng nếu không có dữ liệu
      setScreenings(responseScreenings.data || []);
      setBookings(responseBookings.data || []);
      setBookingDetails(responseBookingDetails.data || []);
      console.log("Rooms fetched:", responseRooms.data); // Debug dữ liệu rooms
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      showToast("Lỗi", "Không thể lấy dữ liệu phòng!");
      setRooms([]); // Đặt rooms về rỗng nếu lỗi
    }
  };

  // Tính toán thống kê
  const calculateStats = useMemo(() => {
    const startDate = new Date(filter.date);
    let endDate = new Date(filter.date);

    if (filter.period === "week") {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(startDate.getDate() + 6);
    } else if (filter.period === "month") {
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    }

    const filteredScreenings = screenings.filter((s) => {
      const screeningDate = new Date(s.screening_date);
      const isInTimeRange = screeningDate >= startDate && screeningDate <= endDate;
      const isInRoom = filter.roomId ? s.room_id === filter.roomId : true;
      return isInTimeRange && isInRoom;
    });

    const screeningsCount = filteredScreenings.length;

    const filteredBookings = bookings.filter(
      (b) => filteredScreenings.some((s) => s.screening_id === b.screening_id) && b.status === "paid"
    );

    const seatsBooked = bookingDetails.filter((bd) =>
      filteredBookings.some((b) => b.booking_id === bd.booking_id)
    ).length;

    const revenue = filteredBookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0);

    const movieStats = filteredScreenings.reduce((acc, s) => {
      acc[s.movie_title] = (acc[s.movie_title] || 0) + 1;
      return acc;
    }, {});
    const mostPopularMovie = Object.keys(movieStats).reduce(
      (a, b) => (movieStats[a] > movieStats[b] ? a : b),
      "Chưa có dữ liệu"
    );

    return {
      screeningsCount,
      seatsBooked,
      revenue,
      mostPopularMovie,
    };
  }, [screenings, bookings, bookingDetails, filter.date, filter.period, filter.roomId]);

  // Cập nhật biểu đồ
  useEffect(() => {
    const calculateBarData = () => {
      let labels = [];
      let data = [];

      if (filter.period === "day") {
        labels = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
        data = Array(7).fill(0);
        screenings.forEach((s) => {
          if (
            s.screening_date === filter.date &&
            (!filter.roomId || s.room_id === filter.roomId)
          ) {
            const hour = parseInt(s.start_time.split(":")[0]);
            if (hour >= 8 && hour <= 20) {
              const index = Math.floor((hour - 8) / 2);
              data[index] += 1;
            }
          }
        });
      } else if (filter.period === "week") {
        const startDate = new Date(filter.date);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        labels = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          return d.toLocaleDateString("vi-VN", { weekday: "short" });
        });
        data = Array(7).fill(0);
        screenings.forEach((s) => {
          const screeningDate = new Date(s.screening_date);
          if (
            screeningDate >= startDate &&
            screeningDate < new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) &&
            (!filter.roomId || s.room_id === filter.roomId)
          ) {
            const dayIndex = screeningDate.getDay();
            data[dayIndex] += 1;
          }
        });
      } else if (filter.period === "month") {
        const startDate = new Date(filter.date);
        startDate.setDate(1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        const weeks = Math.ceil(endDate.getDate() / 7);
        labels = Array.from({ length: weeks }, (_, i) => `Tuần ${i + 1}`);
        data = Array(weeks).fill(0);
        screenings.forEach((s) => {
          const screeningDate = new Date(s.screening_date);
          if (
            screeningDate >= startDate &&
            screeningDate <= endDate &&
            (!filter.roomId || s.room_id === filter.roomId)
          ) {
            const weekIndex = Math.floor((screeningDate.getDate() - 1) / 7);
            data[weekIndex] += 1;
          }
        });
      }

      setBarChartData({
        labels,
        datasets: [
          {
            label: "Số suất chiếu",
            data,
            backgroundColor: "#A9141E",
          },
        ],
      });
    };

    calculateBarData();
  }, [screenings, filter.date, filter.period, filter.roomId]);

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
        showToast("Warning", "Vui lòng nhập đầy đủ thông tin phòng!");
        return;
      }
      const roomId = selectedRoom ? selectedRoom.room_id : `R${Math.floor(1000 + Math.random() * 9000)}`;
      const total_seats = { 1: 100, 2: 90, 3: 80 }[formData.room_type];
      const dataToSave = { room_id: roomId, room_name: formData.room_name, room_type: formData.room_type, total_seats };

      if (selectedRoom) {
        await axios.put(`${API_URL}/rooms/${selectedRoom.room_id}`, dataToSave);
        showToast("Phòng", "Cập nhật phòng thành công!");
      } else {
        await axios.post(`${API_URL}/rooms`, dataToSave);
        showToast("Phòng", "Thêm phòng thành công!");
        const seatsToCreate = seatData.map((seat) => ({
          seat_id: `${seat.id}-${roomId}`,
          seat_number: seat.id,
          seat_type: seat.type,
          room_id: roomId,
        }));
        await axios.post(`${API_URL}/seats/bulk`, seatsToCreate);
        showToast("Ghế", "Tạo ghế cho phòng thành công!");
      }

      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      showToast("Lỗi", "Lưu phòng thất bại!");
    }
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatId) ? prevSelected.filter((id) => id !== seatId) : [...prevSelected, seatId]
    );
  };

  const handleShowModal = (room = null) => {
    setSelectedRoom(room);
    const data = room || { room_name: "", room_type: 1, total_seats: "", room_status: "" };
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

  // Cấu hình options cho Bar Chart
  const barChartOptions = {
    maintainAspectRatio: false,
    animation: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: Math.max(...barChartData.datasets[0].data, 5),
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="container-room">
      <Accordion defaultActiveKey={["1"]} alwaysOpen>
        <Accordion.Item eventKey="0" className="mb-2">
          <Accordion.Header>Thống kê phòng</Accordion.Header>
          <Accordion.Body>
            <div className="stats-section">
              <div className="filters mb-4 d-flex gap-4">
                <Form.Group className="w-25">
                  <Form.Label>Chọn ngày</Form.Label>
                  <Form.Control
                    type="date"
                    value={filter.date}
                    onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="w-25">
                  <Form.Label>Khoảng thời gian</Form.Label>
                  <Form.Select
                    value={filter.period}
                    onChange={(e) => setFilter({ ...filter, period: e.target.value })}
                  >
                    <option value="day">Ngày</option>
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="w-25">
                  <Form.Label>Phòng</Form.Label>
                  <Form.Select
                    value={filter.roomId}
                    onChange={(e) => setFilter({ ...filter, roomId: e.target.value })}
                  >
                    <option value="">Tất cả phòng</option>
                    {rooms.length > 0 ? (
                      rooms.map((room) => (
                        <option key={room.room_id} value={room.room_id}>
                          {room.room_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có phòng</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="dashboard-cards mb-4">
                <div className="card">
                  <h5>Số suất chiếu</h5>
                  <p>{calculateStats.screeningsCount}</p>
                </div>
                <div className="card">
                  <h5>Số ghế đã đặt</h5>
                  <p>{calculateStats.seatsBooked}</p>
                </div>
                <div className="card">
                  <h5>Doanh thu</h5>
                  <p>{calculateStats.revenue.toLocaleString("vi-VN")} VNĐ</p>
                </div>
                <div className="card">
                  <h5>Phim phổ biến nhất</h5>
                  <p className="fs-6">{calculateStats.mostPopularMovie}</p>
                </div>
              </div>

              <div className="charts mb-4">
                <div className="chart bar-chart-container">
                  <h5>
                    Suất chiếu theo {filter.period === "day" ? "giờ" : filter.period === "week" ? "ngày" : "tuần"}
                    {filter.roomId ? ` - ${rooms.find((r) => r.room_id === filter.roomId)?.room_name || ""}` : ""}
                  </h5>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
                <div className="details">
                  <h5>Thông tin chi tiết</h5>
                  <p>
                    Phòng: {filter.roomId ? rooms.find((r) => r.room_id === filter.roomId)?.room_name || "Tất cả" : "Tất cả"}
                    <br />
                    Tổng số suất chiếu: {calculateStats.screeningsCount}
                    <br />
                    Tổng số ghế đã đặt: {calculateStats.seatsBooked}
                    <br />
                    {filter.period === "day"
                      ? `Ngày: ${new Date(filter.date).toLocaleDateString("vi-VN")}`
                      : filter.period === "week"
                      ? `Tuần từ: ${new Date(filter.date)
                          .toLocaleDateString("vi-VN")} đến ${new Date(
                          new Date(filter.date).setDate(new Date(filter.date).getDate() + 6)
                        ).toLocaleDateString("vi-VN")}`
                      : `Tháng: ${new Date(filter.date).toLocaleString("vi-VN", { month: "long", year: "numeric" })}`}
                  </p>
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Danh sách phòng</Accordion.Header>
          <Accordion.Body>
            <div className="p-0">
              <div className="d-flex justify-content-between align-items-center gap-2 p-2 mb-2 rounded-2">
                <p className="m-0">
                  Total: <span className="rounded-1 p-1" style={{ backgroundColor: "rgba(168, 0, 0, 0.3)" }}>
                    {rooms.length} rooms
                  </span>
                </p>
                <div className="d-flex align-items-center gap-2">
                  <Button style={{ backgroundColor: "#A9141E", border: "none" }} size="sm" onClick={() => handleShowModal()}>
                    <i className="fas fa-plus"></i> Tạo phòng
                  </Button>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">Loại phòng</Dropdown.Toggle>
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
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatedRooms.map((room) => {
                      const styleStatus = room.room_status === 1 ? "showing" : "ready";
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
                          <td>{room.room_name}</td>
                          <td><span className={styleRoomType}>{roomTypeDisplay}</span></td>
                          <td>{room.total_seats}</td>
                          <td><span className={styleStatus}>{room.status_label}</span></td>
                          <td>
                            <Button
                              style={{ border: "1px solid #A9141E", backgroundColor: "transparent", color: "#A9141E" }}
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
                      <Form.Select size="sm" name="room_type" value={formData.room_type} onChange={handleInputChange}>
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
                          {seatData.filter((seat) => seat.id.startsWith(row)).map((seat) => (
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
                        {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                          <Button variant="secondary" size="sm">Đã đặt</Button>
                          <Button variant="info" className="text-light" size="sm">Đang chọn</Button>
                        </div>
                        <div className="d-flex gap-2">
                          <Button style={{ backgroundColor: "#d1d0d0", border: "none" }} size="sm">Ghế thường</Button>
                          <Button style={{ backgroundColor: "#ffcc00", border: "none" }} size="sm">Ghế Vip</Button>
                          <Button style={{ backgroundColor: "#ff6666", border: "none" }} size="sm">Ghế đôi</Button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                  <Button variant="success" onClick={handleSaveRoom}>Lưu</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Room;