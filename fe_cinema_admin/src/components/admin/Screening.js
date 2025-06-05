import React, { useEffect, useState, useMemo } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Accordion,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { format, isBefore, isAfter, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import vi from "date-fns/locale/vi";
import "./showtimes.css";

const API_URL = process.env.REACT_APP_PORT;
const TIME_ZONE = "Asia/Ho_Chi_Minh";

export const Screening = () => {
  const { showToast } = useToast();
  const [screenings, setScreenings] = useState([]);
  const [showtime, setShowtime] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showModalScreen, setShowModalScreen] = useState(false);
  const [formDataScreen, setFormDataScreen] = useState({
    showtime_id: "",
    room_id: "",
    screening_date: "",
    start_time: "",
    end_time: "",
    screening_format: "",
    screening_translation: "",
  });
  const [searchRoom, setSearchRoom] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseScreenings = await axios.get(`${API_URL}/screenings`);
      setScreenings(responseScreenings.data);
      const responseShowtimes = await axios.get(`${API_URL}/showtimes?page=1&limit=10&status=`);
      setShowtime(responseShowtimes.data.data);
      const responseRooms = await axios.get(`${API_URL}/rooms`);
      setRooms(responseRooms.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setScreenings([]);
    }
  };

  const handleShowModalScreen = (screening = null) => {
    setSelectedScreen(screening);
    setFormDataScreen(
      screening
        ? {
            showtime_id: screening.showtime_id || "",
            room_id: screening.room_id || "",
            screening_date: screening.screening_date
              ? format(
                  toZonedTime(new Date(screening.screening_date), TIME_ZONE),
                  "yyyy-MM-dd",
                )
              : "",
            start_time: screening.start_time
              ? screening.start_time.slice(0, 5)
              : "",
            end_time: screening.end_time ? screening.end_time.slice(0, 5) : "",
            screening_format: screening.screening_format || "",
            screening_translation: screening.screening_translation || "",
          }
        : {
            showtime_id: "",
            room_id: "",
            screening_date: "",
            start_time: "",
            end_time: "",
            screening_format: "",
            screening_translation: "",
          },
    );
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

  // Kiểm tra phòng sẵn sàng
  const availableRooms = useMemo(() => {
    if (
      !formDataScreen.screening_date ||
      !formDataScreen.start_time ||
      !formDataScreen.end_time
    ) {
      return [];
    }

    if (
      !isValidDate(formDataScreen.screening_date) ||
      !isValidTime(formDataScreen.start_time) ||
      !isValidTime(formDataScreen.end_time)
    ) {
      return [];
    }

    const screeningDate = formDataScreen.screening_date;

    const startDateTime = toZonedTime(
      new Date(`${screeningDate}T${formDataScreen.start_time}:00`),
      TIME_ZONE,
    );
    const endDateTime = toZonedTime(
      new Date(`${screeningDate}T${formDataScreen.end_time}:00`),
      TIME_ZONE,
    );

    return rooms.filter((room) => {
      const isBusy = screenings.some((screening) => {
        if (screening.room_id !== room.room_id) return false;
        if (screening.screening_date !== screeningDate) return false;

        const screenStart = toZonedTime(
          new Date(`${screening.screening_date}T${screening.start_time}`),
          TIME_ZONE,
        );
        const screenEnd = toZonedTime(
          new Date(`${screening.screening_date}T${screening.end_time}`),
          TIME_ZONE,
        );

        return (
          (isBefore(startDateTime, screenEnd) &&
            isAfter(endDateTime, screenStart)) ||
          (isBefore(screenStart, endDateTime) &&
            isAfter(screenEnd, startDateTime))
        );
      });

      return !isBusy;
    });
  }, [
    rooms,
    screenings,
    formDataScreen.screening_date,
    formDataScreen.start_time,
    formDataScreen.end_time,
  ]);

  const handleSaveScreening = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!Object.values(formDataScreen).every((val) => val)) {
        showToast("Vui lòng nhập đầy đủ thông tin suất chiếu!", "danger");
        return;
      }

      // Kiểm tra định dạng ngày và giờ
      if (
        !isValidDate(formDataScreen.screening_date) ||
        !isValidTime(formDataScreen.start_time) ||
        !isValidTime(formDataScreen.end_time)
      ) {
        showToast("Định dạng ngày hoặc giờ không hợp lệ!", "danger");
        return;
      }

      // Kiểm tra start_time < end_time
      const startDateTime = toZonedTime(
        new Date(`${formDataScreen.screening_date}T${formDataScreen.start_time}:00`),
        TIME_ZONE
      );
      const endDateTime = toZonedTime(
        new Date(`${formDataScreen.screening_date}T${formDataScreen.end_time}:00`),
        TIME_ZONE
      );
      if (!isBefore(startDateTime, endDateTime)) {
        showToast("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!", "danger");
        return;
      }

      // Kiểm tra screening_date trong khoảng start_time và end_time của showtime
      const selectedShowtime = showtime.find(
        (show) => show.showtime_id === formDataScreen.showtime_id
      );
      if (!selectedShowtime) {
        showToast("Lịch chiếu không hợp lệ!", "danger");
        return;
      }

      const showtimeStart = toZonedTime(new Date(selectedShowtime.start_time), TIME_ZONE);
      const showtimeEnd = toZonedTime(new Date(selectedShowtime.end_time), TIME_ZONE);
      const screeningDate = toZonedTime(new Date(formDataScreen.screening_date), TIME_ZONE);

      if (
        isBefore(screeningDate, showtimeStart) ||
        isAfter(screeningDate, showtimeEnd)
      ) {
        showToast(
          `Ngày chiếu phải nằm trong khoảng từ ${format(showtimeStart, "dd/MM/yyyy")} đến ${format(showtimeEnd, "dd/MM/yyyy")}!`,
          "danger"
        );
        return;
      }

      // Định dạng dữ liệu trước khi gửi
      const formattedData = {
        ...formDataScreen,
        screening_date: format(
          new Date(formDataScreen.screening_date),
          "yyyy-MM-dd",
        ),
        start_time: formatTimeInput(formDataScreen.start_time),
        end_time: formatTimeInput(formDataScreen.end_time),
      };

      // Gửi yêu cầu API
      const response = selectedScreen
        ? await axios.put(
            `${API_URL}/screenings/${selectedScreen.screening_id}`,
            formattedData,
          )
        : await axios.post(`${API_URL}/screenings`, formattedData);

      showToast(
        selectedScreen
          ? "Cập nhật suất chiếu thành công!"
          : "Thêm suất chiếu thành công!",
        "success"
      );
      fetchData();
      handleCloseModalScreen();
    } catch (error) {
      console.error("Lỗi khi lưu suất chiếu:", error);
      showToast( "Lưu suất chiếu thất bại!", "danger");
    }
  };

  const formatDate = (dateString) => {
    return format( toZonedTime(new Date(dateString), TIME_ZONE), "dd/MM/yyyy", {
      locale: vi,
    });
  };

  const filteredScreenings = screenings.filter((screen) => {
    const roomMatch = searchRoom ? screen.room_id === searchRoom : true;
    const formattedScreenDate = format(
      toZonedTime(new Date(screen.screening_date), TIME_ZONE),
      "yyyy-MM-dd",
    );
    const dateMatch = searchDate ? formattedScreenDate === searchDate : true;
    return roomMatch && dateMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentScreenings = filteredScreenings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredScreenings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const selectedName = rooms.find((room) => room.room_id === searchRoom);

  const now = toZonedTime(new Date(), TIME_ZONE);
  const upcomingShowtimes = showtime.filter((show) => {
    const startDate = toZonedTime(new Date(show.start_time), TIME_ZONE);
    const endDate = toZonedTime(new Date(show.end_time), TIME_ZONE);
    return isAfter(now, startDate) && isBefore(now, endDate);
  });

  const getStatusInfo = (screening) => {
    const screeningDateTime = toZonedTime(
      new Date(`${screening.screening_date}T${screening.start_time}`),
      TIME_ZONE,
    );
    const screeningEndDateTime = toZonedTime(
      new Date(`${screening.screening_date}T${screening.end_time}`),
      TIME_ZONE,
    );

    if (isAfter(now, screeningEndDateTime)) {
      return {
        label: "Đã chiếu",
        class: "completed",
      };
    } else if (isBefore(now, screeningDateTime)) {
      return {
        label: "Sắp chiếu",
        class: "commingsoon",
      };
    } else {
      return {
        label: "Đang chiếu",
        class: "nowshowing",
      };
    }
  };

  const handleRoomSelect = (roomId) => {
    setFormDataScreen({ ...formDataScreen, room_id: roomId });
  };

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>Suất chiếu</Accordion.Header>
      <Accordion.Body>
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-4">
            <Form.Group as={Row}>
              <Form.Label column sm="5">
                Phòng chiếu:
              </Form.Label>
              <Col sm="7">
                <Form.Select
                  size="sm"
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                >
                  <option value="">Tất cả phòng</option>
                  {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.room_name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="5">
                Ngày chiếu:
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  type="date"
                  size="sm"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </Col>
            </Form.Group>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleShowModalScreen(null)}
          >
            Tạo suất chiếu
          </Button>
        </div>

        <div>
          {!searchDate && !searchRoom ? (
            ""
          ) : (
            <p className="fw-bold text-center text-success">
              Lịch chiếu ngày:{" "}
              <span>{searchDate ? formatDate(searchDate) : "Tất cả"}</span> -
              <span> {selectedName?.room_name || "Tất cả phòng"}</span>
            </p>
          )}
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
                const statusInfo = getStatusInfo(screen);
                const formatStyle =
                  screen.screening_format === "2D"
                    ? "style2d"
                    : screen.screening_format === "3D"
                      ? "style3d"
                      : "styleimax";

                return (
                  <tr key={screen.screening_id}>
                    <td className="movie-title-column">{screen.movie_title}</td>
                    <td>{screen.room_name}</td>
                    <td className="text-center">
                      <span className={formatStyle}>
                        {screen.screening_format}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="translator">
                        {screen.screening_translation}
                      </span>
                    </td>
                    <td>
                      <span className="screening">{`${screen.start_time} - ${screen.end_time}`}</span>
                    </td>
                    <td className="text-center">
                      {formatDate(screen.screening_date)}
                    </td>
                    <td className="text-center">
                      <span className={statusInfo.class}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        style={{
                          border: "1px solid #A9141E",
                          backgroundColor: "#A9141E",
                          color: "white",
                        }}
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
          <Pagination className="justify-content-end mt-3">
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
            <Modal.Title>
              {selectedScreen ? "Chỉnh Sửa Suất Chiếu" : "Thêm Suất Chiếu"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Phim chiếu <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Select
                  name="showtime_id"
                  value={formDataScreen.showtime_id}
                  onChange={handleInputChangeScreen}
                >
                  <option value="">Chọn suất chiếu</option>
                  {upcomingShowtimes.map((show) => (
                    <option key={show.showtime_id} value={show.showtime_id}>
                      {show.movie_title} -{" "}
                      {format(
                        toZonedTime(new Date(show.start_time), TIME_ZONE),
                        "dd/MM/yyyy",
                      )}{" "}
                      →{" "}
                      {format(
                        toZonedTime(new Date(show.end_time), TIME_ZONE),
                        "dd/MM/yyyy",
                      )}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày chiếu <span style={{ color: "red" }}>*</span></Form.Label>
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
                  <Form.Label>Giờ bắt đầu <span style={{ color: "red" }}>*</span></Form.Label>
                  <Form.Control
                    type="time"
                    name="start_time"
                    value={formDataScreen.start_time}
                    onChange={handleInputChangeScreen}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label>Giờ kết thúc <span style={{ color: "red" }}>*</span></Form.Label>
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
                <Form.Label>Phòng chiếu <span style={{ color: "red" }}>*</span></Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {availableRooms.length > 0 ? (
                    availableRooms.map((room) => (
                      <Button
                        size="sm"
                        key={room.room_id}
                        variant={
                          formDataScreen.room_id === room.room_id
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => handleRoomSelect(room.room_id)}
                      >
                        {room.room_name}
                      </Button>
                    ))
                  ) : (
                    <p className="text-muted">
                      Không có phòng sẵn sàng trong khoảng thời gian này.
                    </p>
                  )}
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hình thức chiếu <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Select
                  name="screening_format"
                  value={formDataScreen.screening_format}
                  onChange={handleInputChangeScreen}
                >
                  <option value="">Chọn hình thức</option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hình thức dịch <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Select
                  name="screening_translation"
                  value={formDataScreen.screening_translation}
                  onChange={handleInputChangeScreen}
                >
                  <option value="">Chọn hình thức</option>
                  <option value="Phụ đề">Phụ đề</option>
                  <option value="Thuyết minh">Thuyết minh</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalScreen}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSaveScreening}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Screening;
