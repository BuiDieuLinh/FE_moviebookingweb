import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const Event = () => {
  return (
    <div style={{ marginTop: "140px", marginBottom: "30px" }}>
      <h4 className="fw-bold text-center text-light">Khuyến mãi</h4>
      <Row xs={1} md={4} className="g-4 w-75 m-auto">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src="event1.jpg" />
              <Card.Body className="p-2 bg-dark">
                <Card.Text>05/03/2025</Card.Text>
                <Card.Title className="fs-6 fw-bold text-light">
                  Chương trình tặng quà nhân dịp mùng 8 tháng 3
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default Event;
