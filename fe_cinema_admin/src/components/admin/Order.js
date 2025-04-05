import React, { useEffect, useState } from 'react';
import { Button, Table, Badge, Pagination, Form, Dropdown, Modal, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './order.css';

// Placeholder QR code image
const defaultQrCode = 'https://via.placeholder.com/150x150.png?text=QR+Code';

const API_URL = process.env.REACT_APP_PORT || 'http://localhost:5000';

const Order = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [payments, setPayments] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDate, setSelectedDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
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
    const screening = screenings.find((s) => s.screening_id === booking.screening_id) || {};
    const payment = payments.find((p) => p.booking_id === booking.booking_id) || {};
    return {
      ...booking,
      movie_title: screening.movie_title || 'N/A',
      showtime: screening.start_time && screening.end_time ? `${screening.start_time} - ${screening.end_time}` : 'N/A',
      room_name: screening.room_name || 'N/A',
      payment_method: payment.payment_method || 'N/A',
      payment_status: payment.payment_status || 'N/A',
      display_status: booking.status === 'pending' ? 'Chờ thanh toán' : booking.status,
      qr_code: booking.qr_code || defaultQrCode,
    };
  });

  // Calculate statistics
  const stats = {
    paid: enrichedBookings.filter((b) => b.display_status.toLowerCase() === 'đã thanh toán').length,
    pending: enrichedBookings.filter((b) => b.display_status.toLowerCase() === 'chờ thanh toán').length,
    canceled: enrichedBookings.filter((b) => b.display_status.toLowerCase() === 'hủy').length,
  };

  const filteredBookings = enrichedBookings.filter((booking) => {
    const bookingDate = new Date(booking.created_at).toISOString().split('T')[0];
    const byDate = !selectedDate || bookingDate === selectedDate;
    const byStatus = filterStatus === 'Tất cả' || booking.display_status.toLowerCase() === filterStatus.toLowerCase();
    return byDate && byStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'đã thanh toán':
        return <Badge bg="success" className="status-badge">Đã thanh toán</Badge>;
      case 'chờ thanh toán':
        return <Badge bg="warning" text="dark" className="status-badge">Chờ thanh toán</Badge>;
      case 'hủy':
        return <Badge bg="danger" className="status-badge">Hủy</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">{status}</Badge>;
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
            <i className="fas fa-times-circle me-1"></i>
            <span>Hủy: {stats.canceled}</span>
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
            <Dropdown.Toggle size="sm" variant="outline-secondary" className="filter-dropdown">
              {filterStatus}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {['Tất cả', 'Đã thanh toán', 'Chờ thanh toán', 'Hủy'].map((status, i) => (
                <Dropdown.Item eventKey={status} key={i}>
                  {status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="info" size="sm" onClick={fetchData} className="refresh-btn">
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
                  className={`table-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
                >
                  {/* <td className="text-primary font-weight-bold">{booking.booking_id.slice(0, 8)}</td> */}
                  <td>{booking.movie_title}</td>
                  <td>{booking.showtime}</td>
                  <td>{booking.room_name}</td>
                  <td>{getStatusBadge(booking.display_status)}</td>
                  <td className="text-success">{formatCurrency(booking.total_price)}</td>
                  <td>{new Date(booking.created_at).toLocaleDateString('vi-VN')}</td>
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
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            {totalPages > 5 && <Pagination.Ellipsis />}
            <Pagination.Item>{totalPages}</Pagination.Item>
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
                        <span className="info-value">{selectedBooking.booking_id}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tên phim:</span>
                        <span className="info-value text-uppercase">{selectedBooking.movie_title}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Suất chiếu:</span>
                        <span className="info-value">{selectedBooking.showtime}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phòng chiếu:</span>
                        <span className="info-value">{selectedBooking.room_name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Ngày đặt:</span>
                        <span className="info-value">{new Date(selectedBooking.created_at).toLocaleString('vi-VN')}</span>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card className="info-card mb-3">
                    <Card.Body>
                      <h5 className="section-title">Thông tin thanh toán</h5>
                      <div className="info-row">
                        <span className="info-label">Trạng thái:</span>
                        <span className="info-value">{getStatusBadge(selectedBooking.display_status)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Tổng tiền:</span>
                        <span className="info-value text-success">{formatCurrency(selectedBooking.total_price)}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phương thức:</span>
                        <span className="info-value">{selectedBooking.payment_method}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="text-center">
                  <Card className="qr-card">
                    <Card.Body>
                      <img src={selectedBooking.qr_code} alt="QR Code" className="qr-code" />
                      <p className="qr-label">Quét mã QR để kiểm tra</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="info-card">
                <Card.Body>
                  <h5 className="section-title">Danh sách ghế</h5>
                    <Table hover >
                      <thead >
                        <tr>
                          <th>Ghế</th>
                          <th>Giá</th>
                          <th>Loại Ghế</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookingDetails
                          .filter((detail) => detail.booking_id === selectedBooking.booking_id)
                          .map((detail) => {
                            let seatType = '';
                            if (detail.price === 65000) {
                              seatType = 'VIP';
                            } else if (detail.price === 60000) {
                              seatType = 'Thường';
                            } else if (detail.price === 150000) {
                              seatType = 'Đôi';
                            }

                            return (
                              <tr key={detail.detail_id}>
                                <td>{detail.seat_id}</td>
                                <td>{formatCurrency(detail.price)}</td>
                                <td>{seatType}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={handleCloseModal} className="close-btn">
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;