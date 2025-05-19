import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Badge,
  Pagination,
  Form,
  Dropdown,
  Modal,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import "./order.css";

const API_URL = process.env.REACT_APP_PORT;

const Order = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [payments, setPayments] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedDate, setSelectedDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingsRes = await axios.get(`${API_URL}/bookings`);
      setBookings(bookingsRes.data);

      const bookingDetailsRes = await axios.get(`${API_URL}/bookingdetails`);
      setBookingDetails(bookingDetailsRes.data);

      const paymentsRes = await axios.get(`${API_URL}/payments`);
      setPayments(paymentsRes.data);

      const screeningsRes = await axios.get(`${API_URL}/screenings`);
      setScreenings(screeningsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBookings([]);
      setBookingDetails([]);
      setPayments([]);
      setScreenings([]);
    }
  };

  const enrichedBookings = bookings.map((booking) => {
    const screening =
      screenings.find((s) => s.screening_id === booking.screening_id) || {};
    const payment =
      payments.find((p) => p.booking_id === booking.booking_id) || {};
    return {
      ...booking,
      movie_title: screening.movie_title || "N/A",
      showtime:
        screening.start_time && screening.end_time
          ? `${screening.start_time} - ${screening.end_time}`
          : "N/A",
      room_name: screening.room_name || "N/A",
      payment_method: payment.payment_method || "N/A",
      payment_status: payment.payment_status || "N/A",
      display_status:
        booking.status === "pending" ? "Chờ thanh toán" : booking.status,
      qr_code: booking.qr_code || "",
    };
  });

  // Calculate statistics
  const stats = {
    paid: enrichedBookings.filter((b) => b.display_status === "paid").length,
    pending: enrichedBookings.filter((b) => b.display_status === "pending")
      .length,
    canceled: enrichedBookings.filter((b) => b.display_status === "canceled")
      .length,
  };

  const filteredBookings = enrichedBookings.filter((booking) => {
    const bookingDate = new Date(booking.created_at)
      .toISOString()
      .split("T")[0];
    const byDate = !selectedDate || bookingDate === selectedDate;
    const byStatus =
      filterStatus === "all" ||
      booking.display_status.toLowerCase() === filterStatus.toLowerCase();
    return byDate && byStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge bg="success" className="status-badge">
            Đã thanh toán
          </Badge>
        );
      case "pending":
        return (
          <Badge bg="warning" text="dark" className="status-badge">
            Chờ thanh toán
          </Badge>
        );
      case "canceled":
        return (
          <Badge bg="danger" className="status-badge">
            Hủy
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="status-badge">
            {status}
          </Badge>
        );
    }
  };

  const handleShowDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "pending", label: "Chờ thanh toán" },
    { value: "canceled", label: "Huỷ" },
  ];

  return (
    <div className="order-wrapper">
      {/* Statistics and Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="stats-container d-flex gap-3">
          <div className="stat-item stat-paid">
            <i className="fas fa-check-circle me-1"></i>
            <span>Đã thanh toán: {stats.paid}</span>
          </div>
          <div className="stat-item stat-pending">
            <i className="fas fa-clock me-1"></i>
            <span>Chờ thanh toán: {stats.pending}</span>
          </div>
          <div className="stat-item stat-canceled">
            <i class="fas fa-window-close me-1"></i>
            <span>Đã huỷ: {stats.canceled}</span>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Form.Control
            size="sm"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-input"
            placeholder="dd/mm/yyyy"
          />
          <Dropdown onSelect={(e) => setFilterStatus(e)}>
            <Dropdown.Toggle
              size="sm"
              variant="outline-secondary"
              className="filter-dropdown"
            >
              {filterStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {statusOptions.map((status, i) => (
                <Dropdown.Item eventKey={status.value} key={i}>
                  {status.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="info"
            size="sm"
            onClick={fetchData}
            className="refresh-btn"
          >
            <i className="fas fa-sync-alt"></i>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <Table hover className="order-table">
          <thead className="table-dark">
            <tr>
              {/* <th>Mã đơn hàng</th> */}
              <th>Tên phim</th>
              <th>Suất chiếu</th>
              <th>Phòng chiếu</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((booking, index) => (
                <tr
                  key={booking.booking_id}
                  onClick={() => handleShowDetails(booking)}
                  className={`table-row ${index % 2 === 0 ? "even-row" : "odd-row"}`}
                >
                  <td>{booking.movie_title}</td>
                  <td>{booking.showtime}</td>
                  <td>{booking.room_name}</td>
                  <td>{getStatusBadge(booking.display_status)}</td>
                  <td className="text-success">
                    {formatCurrency(booking.total_price)}
                  </td>
                  <td>
                    {new Date(booking.created_at).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Không có đơn đặt vé nào.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-end mt-2">
          <Pagination className="mb-0">
            {/* Nút Previous */}
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {/* Hiển thị các số trang */}
            {[...Array(totalPages).keys()].map((number) => {
              const page = number + 1;
              // Hiển thị tối đa 5 số trang, với logic thông minh
              if (
                page === 1 || // Luôn hiển thị trang đầu
                page === totalPages || // Luôn hiển thị trang cuối
                (page >= currentPage - 2 && page <= currentPage + 2) // Hiển thị các trang gần trang hiện tại
              ) {
                return (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              }
              return null;
            })}

            {/* Thêm dấu chấm lửng nếu cần */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Pagination.Ellipsis />
            )}
            {totalPages > 5 && currentPage > 3 && <Pagination.Ellipsis />}

            {/* Nút Next */}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Modal for Booking Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {selectedBooking && (
            <div className="booking-details">
              <Row>
                <Col md={8}>
                  <Card className="info-card mb-3">
                    <Card.Body>
                      <h5 className="section-title">Thông tin đơn hàng</h5>
                      <div className="info-row">
                        <span className="info-label">Mã đơn hàng:</span>
                        <span className="info-value">
                          {selectedBooking.booking_id}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tên phim:</span>
                        <span className="info-value text-uppercase">
                          {selectedBooking.movie_title}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Suất chiếu:</span>
                        <span className="info-value">
                          {selectedBooking.showtime}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phòng chiếu:</span>
                        <span className="info-value">
                          {selectedBooking.room_name}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Ngày đặt:</span>
                        <span className="info-value">
                          {new Date(selectedBooking.created_at).toLocaleString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="text-center">
                  <Card className="qr-card">
                    <Card.Body>
                      <img
                        src={`${API_URL}${selectedBooking.qr_code}`}
                        alt="QR Code"
                        className="qr-code"
                      />
                      <p className="qr-label fs-6">Đã quét</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="px-2 gap-3">
                <Card className="info-card mb-3" as={Col}>
                  <Card.Body>
                    <h5 className="section-title">Thông tin thanh toán</h5>
                    <div className="info-row">
                      <span className="info-label">Trạng thái:</span>
                      <span className="info-value">
                        {getStatusBadge(selectedBooking.display_status)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tổng tiền:</span>
                      <span className="info-value text-success">
                        {formatCurrency(selectedBooking.total_price)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phương thức:</span>
                      <span className="info-value">
                        {selectedBooking.payment_method}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="info-card" as={Col}>
                  <Card.Body>
                    <h5 className="section-title">Danh sách ghế</h5>

                    <div className="seat-list-header">
                      <span>Ghế</span>
                      <span>Giá ghế</span>
                      <span>Loại</span>
                    </div>

                    <div className="seat-list-body">
                      {bookingDetails
                        .filter(
                          (detail) =>
                            detail.booking_id === selectedBooking.booking_id,
                        )
                        .map((detail) => {
                          return (
                            <div className="seat-item" key={detail.detail_id}>
                              <span>{detail.seat_number}</span>
                              <span>{formatCurrency(detail.price)}</span>
                              <span>{detail.seat_type}</span>
                            </div>
                          );
                        })}
                    </div>
                  </Card.Body>
                </Card>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="close-btn"
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
