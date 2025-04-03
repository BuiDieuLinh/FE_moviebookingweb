// Order.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {Row, Col, Table, Button, Card, Form} from 'react-bootstrap'
import axios from 'axios';
import './order.css'

const API_URL = process.env.REACT_APP_API_URL;

const Order = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('VietQR'); // Mặc định chọn VietQR

  const paymentMethods = [
    { id: 'VietQR', name: 'VietQR', logo: 'vietqr.png' },
    { id: 'vnpay', name: 'VNPAY', logo: 'vnpay.png' },
    { id: 'ViettelMoney', name: 'Viettel Money', logo: 'viettel1.png' },
  ];

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };
  // Lấy dữ liệu từ state
  const { screening_id, selectedSeats, totalPrice, title, screening_date, time, screening_format, room_name } = state || {};

  // Lấy user_id từ localStorage
  const user_id = localStorage.getItem('user_id');

  // Kiểm tra dữ liệu
  useEffect(() => {
    if (!screening_id || !selectedSeats || !totalPrice || !user_id) {
      setError('Thiếu thông tin để thực hiện thanh toán. Vui lòng quay lại và thử lại.');
    }
  }, [screening_id, selectedSeats, totalPrice, user_id]);

  const handlePayment = async () => {
    if (!user_id) {
      setError("Bạn cần đăng nhập để thực hiện thanh toán.");
      return;
    }
  
    setIsProcessing(true);
    setError(null);
  
    try {
      // Chuẩn bị dữ liệu booking
      const bookingData = {
        user_id: user_id,
        screening_id: screening_id,
        total_price: totalPrice,
        status: "pending",
        qr_code: ''
      };
  
      // Chuẩn bị dữ liệu booking details từ selectedSeats
      const bookingDetails = selectedSeats.map((seat) => ({
        seat_id: seat.seat_id, // Giả định seat_name từ FE tương ứng với seat_number ở BE
        price: seat.price,
      }));
  
      // Gửi request tạo booking và details cùng lúc
      const response = await axios.post(`${API_URL}/bookings`, {
        bookings: bookingData,
        details: bookingDetails,
      });
  
  
      // Tạo bản ghi trong bảng Payments
      const paymentResponse = await axios.post(`${API_URL}/payments`, {
        booking_id: booking_id,
        amount: totalPrice,
        payment_method: paymentMethod,
        payment_status: "pending",
        created_at: new Date(),
      });
  
      // Giả lập thanh toán (có thể thay bằng API thanh toán thực tế)
      const paymentStatus = "success"; // Thay bằng logic thanh toán thực tế nếu có
      if (paymentStatus === "success") {
        // Cập nhật trạng thái booking và payment
        await Promise.all([
          axios.put(`${API_URL}/bookings/${booking_id}`, { status: "paid" }),
          axios.put(`${API_URL}/payments/${paymentResponse.data.payment_id}`, {
            payment_status: "success",
          }),
        ]);
  
        alert("Thanh toán thành công!");
        navigate("/booking-success", { state: { booking_id } });
      } else {
        throw new Error("Thanh toán thất bại.");
      }
    } catch (err) {
      setError("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  if (error) {
    return (
      <div className='text-light text-center my-4'>
        <p>{error}</p>
        <Button variant='dark' onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className='container-order' >
      <div className='info-detail'>
        <div className='rounded-4 bg-dark p-4'>
          <div>
              <h5 className='fw-bold'>Thông tin phim</h5>
              <span className='fs-6'>Phim</span>
              <p className='fw-bold text-uppercase'>{title}</p>
          </div>
          <Row>
            <Col >
              <span>Ngày giờ chiếu:</span>
              <p className='fw-bold'> <span className='text-warning'>{time}</span> - {screening_date}</p>
            </Col>
            <Col>
              <span>Ghế đã chọn:</span>
              <p className='fw-bold'>{selectedSeats.map(seat => seat.seat_name).join(", ")}</p>
            </Col>
          </Row>
          <Row>
            <Col >
              <span>Định dạng:</span>
              <p className='fw-bold'> <span className='rounded border p-1'>{screening_format}</span></p>
            </Col>
            <Col>
              <span>Phòng chiếu:</span>
              <p className='fw-bold'>{room_name}</p>
            </Col>
          </Row>
        </div>
        
        <div className='rounded-4 bg-dark p-4 my-4' >
          <h5 className='fw-bold'>Thông tin thanh toán</h5>
          <Table bordered hover variant="dark" className='rounded-4'>
            <thead>
              <tr>
                <th>Danh mục</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ghế <span>{selectedSeats.map(seat => seat.seat_name).join(", ")}</span></td>
                <td>{selectedSeats.length}</td>
                <td>{totalPrice.toLocaleString('vi-VN')} đ</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      
      <div className='payment rounded-4 bg-dark p-4'>
        <h5 className='fw-bold mb-4'>Phương thức thanh toán</h5>
        {paymentMethods.map((method) => (
        <Card
          key={method.id}
          className={`payment-card mb-2 ${selectedMethod === method.id ? 'selected' : ''}`}
          onClick={() => handleSelect(method.id)}
        >
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={2}>
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method.id}
                  onChange={() => handleSelect(method.id)}
                />
              </Col>
              <Col xs={4}>
                <img src={method.logo} alt={method.name} className="payment-logo" />
              </Col>
              <Col xs={6}>
                <span className="payment-name">{method.name}</span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <h5 className='fw-bold my-4'>Chi phí</h5>
      <div className='d-flex justify-content-between'>
        <span>Thanh toán</span>
        <p>{totalPrice.toLocaleString('vi-VN')} đ</p>
      </div>
      <div className='d-flex justify-content-between'>
        <span>Phí</span>
        <p>0 đ</p>
      </div>
      <div className='d-flex justify-content-between'>
        <span>Tổng cộng</span>
        <p>{totalPrice.toLocaleString('vi-VN')} đ</p>
      </div>
      <div className='d-flex justify-content-end'>
        <Button
          variant='dark'
          className='rounded-pill mx-2 p-2'
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Button
          variant='danger'
          className='rounded-pill p-2'
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
        </Button>
      </div>
      </div>

    
    </div>
  );
};

export default Order;