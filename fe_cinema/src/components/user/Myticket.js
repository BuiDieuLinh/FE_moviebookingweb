import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Modal, Image, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './mytickets.css'; // Updated CSS file for the new design
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const API_URL = process.env.REACT_APP_API_URL;

const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    if (!user_id) {
      setError('Bạn cần đăng nhập để xem vé của mình.');
      setLoading(false);
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings/user/${user_id}`);
        setTickets(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách vé. Vui lòng thử lại sau.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTickets();
  }, [user_id]);

  const formatDateTime = (date, time) => {
    return `${time} - ${new Date(date).toLocaleDateString('vi-VN')}`;
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <h4 className="text-light">Đang tải vé...</h4>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="dark" onClick={() => navigate('/login')}>
          Đăng nhập
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="mytickets-container py-5">
      <h4 className="text-danger mb-4 fw-bold">Danh sách vé của tôi</h4>
      {tickets.length === 0 ? (
        <Alert variant="info" className="text-center custom-alert">
          Bạn chưa có vé nào. Hãy đặt vé ngay!
          <Button
            variant="primary"
            className="ms-3 rounded-pill custom-button"
            onClick={() => navigate('/')}
          >
            Đặt vé
          </Button>
        </Alert>
      ) : (
        <>
          <Table hover variant="dark" className='custom-ticket-table rounded-4'>
            <thead>
              <tr>
                <th>Ngày giao dịch</th>
                <th>Tên phim</th>
                <th>Số vé</th>
                <th>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.booking_id}
                  onClick={() => handleViewDetails(ticket)}
                  className="ticket-row"
                >
                  <td>{new Date(ticket.screening_date).toISOString().split('T')[0]}</td>
                  <td>{ticket.movie_title}</td>
                  <td>{ticket.seats.length}</td>
                  <td>{ticket.total_price.toLocaleString('vi-VN')} đ</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered
            dialogClassName="custom-ticket-modal"
          >
            <Modal.Header closeButton className="bg-dark text-light border-0">
              <Modal.Title>Thông tin chi tiết vé</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
              {selectedTicket && (
                <div className="ticket-details">
                    <Row>
                        <Col md='4'>
                            <Image src={`${API_URL}${selectedTicket.movie_image}`} width={150} height={180} className='rounded'></Image>
                        </Col>
                        <Col className='d-flex flex-column'>
                            <h4 className="text-uppercase mb-3 text-danger fw-bold">
                                {selectedTicket.movie_title}
                            </h4>
                            <p className="text-light">
                                {formatDateTime(selectedTicket.screening_date, selectedTicket.time)}{' '}
                                ({selectedTicket.screening_format})
                            </p>
                            <p><strong>Phòng chiếu:</strong> {selectedTicket.room_name}</p>
                            <p><strong>Ghế:</strong>{' '}
                            {selectedTicket.seats.map((seat) => seat.seat_name).join(', ')}</p>
                        </Col>
                    </Row>
                    <div className="barcode-section text-center">
                        <p className="text-warning mb-1">Lấy ngay</p>
                        <Image
                        src="https://barcode.tec-it.com/barcode.ashx?data=354729141&code=Code128&dpi=96"
                        alt="Barcode"
                        fluid
                        className="barcode-image"
                        />
                    </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="bg-dark border-0">
              <Button
                variant="secondary" size='sm'
                className="rounded custom-button"
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default MyTickets;