import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './payment.css'; // File CSS tùy chỉnh

const API_URL = process.env.REACT_APP_API_URL;

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { booking_id, totalPrice } = state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra dữ liệu đầu vào
  useEffect(() => {
    if (!booking_id || !totalPrice) {
      setError('Thiếu thông tin thanh toán. Vui lòng quay lại.');
    }
  }, [booking_id, totalPrice]);

  // Hàm xử lý thanh toán (giả lập hoặc gọi API thực tế)
  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Gọi API thanh toán MoMo (thay bằng API thực tế của bạn)
      const response = await axios.post(`${API_URL}/payments/payment_momo`, {
        booking_id,
        amount: totalPrice,
        payment_method: 'momo',
      });

      if (response.data.payUrl) {
        // Chuyển hướng đến URL thanh toán của MoMo
        window.location.href = response.data.payUrl;
      } else {
        // Giả lập thanh toán thành công
        setTimeout(() => {
          setPaymentSuccess(true);
          setIsProcessing(false);
        }, 2000); // 2 giây giả lập
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
      setIsProcessing(false);
      console.error(err);
    }
  };

  // Quay lại trang chính sau khi thành công
  const handleBackToHome = () => {
    navigate('/');
  };

  if (error) {
    return (
      <Container className="text-center my-5 text-light">
        <h4>{error}</h4>
        <Button variant="dark" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container className="payment-container my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="bg-dark text-light p-4 rounded-4 shadow">
            <Card.Body>
              {!paymentSuccess ? (
                <>
                  <h3 className="text-center mb-4">Xác nhận thanh toán</h3>
                  <div className="mb-3">
                    <p>
                      <strong>Mã đặt vé:</strong> {booking_id}
                    </p>
                    <p>
                      <strong>Số tiền:</strong> {totalPrice.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    className="w-100 rounded-pill p-2"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      'Thanh toán ngay'
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center success-container">
                  <div className="checkmark-circle">
                    <div className="checkmark"></div>
                  </div>
                  <h2 className="text-success mt-3">Thanh toán thành công!</h2>
                  <p>Cảm ơn bạn đã đặt vé. Mã đặt vé của bạn là:</p>
                  <h4 className="text-warning">{booking_id}</h4>
                  <Button
                    variant="dark"
                    className="rounded-pill mt-3"
                    onClick={handleBackToHome}
                  >
                    Về trang chủ
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;