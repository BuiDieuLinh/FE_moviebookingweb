import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./home.css"
const Home = () => {
  return (
    <div style={{marginTop: '70px'}}>
      <Container fluid>
        {/* Hàng hiển thị tổng quan */}
        <Row className="mb-4">
          <Col md={3}>
            <Card border="info"  className="p-3 text-start shadow-sm border-2">
              <span>Doanh thu trong ngày</span>
              <h5 className="fw-normal">8.600.000đ</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card border="success" className="p-3 text-start shadow-sm border-2">
              <span>Khách hàng mới</span>
              <h5 className="fw-normal">12</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card border="warning" className="p-3 text-start shadow-sm border-2">
              <span>Tổng vé bán ra </span>
              <h5 className="fw-normal">999</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card border="danger" className="p-3 text-start shadow-sm border-2">
              <span>Tổng doanh thu</span>
              <h5 className="fw-normal">12.000.000đ</h5>
            </Card>
          </Col>
        </Row>

        {/* Hàng hiển thị biểu đồ */}
        <Row>
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Sales Overview</h5>
              <div style={{ height: "300px", background: "#f8f9fc", borderRadius: "5px" }}></div>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm">
              <h5>Monthly Statistics</h5>
              <div style={{ height: "300px", background: "#f8f9fc", borderRadius: "5px" }}></div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    
  );
};

export default Home;
