import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Spinner,
  Button,
} from "react-bootstrap";
import axios from "axios";
// import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons"; // For icons
import "./payment.css"; // Custom CSS for additional styling

const API_URL = process.env.REACT_APP_API_URL;

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, fail
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const checkPayment = async () => {
      const resultCode = searchParams.get("resultCode");
      const orderIdParam = searchParams.get("orderId");
      setOrderId(orderIdParam);

      if (resultCode === "0") {
        setStatus("success");

        try {
          const response = await axios.patch(`${API_URL}/bookings/${orderIdParam}/qr`);
          console.log("Đã cập nhật đơn hàng:", response.data);
        } catch (err) {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng: ", err);
        }
      } else {
        setStatus("fail");
      }
    };

    checkPayment();
  }, [searchParams]);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 ">
      <Card className="payment-card shadow-lg">
        <CardBody className="text-center">
          {status === "loading" && (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
              <CardText className="mt-3 text-muted">
                Đang xử lý kết quả thanh toán...
              </CardText>
            </div>
          )}

          {status === "success" && (
            <div className="success-container">
              {/* <CheckCircleFill size={50} className="text-success mb-3" /> */}
              <CardTitle as="h4" className="text-success fw-bold">
                Thanh toán thành công!
              </CardTitle>
              <CardText className="text-muted">
                Cảm ơn bạn đã đặt vé. <br />
                
              </CardText>
              <Button variant="outline-danger" href="/" className="mt-3">
                Về trang chủ
              </Button>
            </div>
          )}

          {status === "fail" && (
            <div className="fail-container">
              {/* <XCircleFill size={50} className="text-danger mb-3" /> */}
              <CardTitle as="h4" className="text-danger">
                Thanh toán thất bại
              </CardTitle>
              <CardText className="text-muted">
                Mã đơn hàng: <strong>{orderId}</strong> <br />
                Vui lòng thử lại hoặc kiểm tra phương thức thanh toán.
              </CardText>
              <Button variant="outline-danger" href="/payment" className="mt-3">
                Thử lại
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default PaymentPage;