import React from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const movies = [
  {
    id: 1,
    title: "NHÀ GIA TIÊN",
    image: "nhagiatien_card.jpg",
    age_badge: "c-18.png",
    genre: "Gia đình, hài hước",
    duration: 117,
  },
  {
    id: 2,
    title: "QUỶ NHẬP TRÀNG",
    image: "quynhaptrang_card.png",
    age_badge: "c-18.png",
    genre: "Kinh dị",
    duration: 122,
  },
  {
    id: 3,
    title: "CƯỚI MA",
    image: "cuoima_card.png",
    age_badge: "c-18.png",
    genre: "Kinh dị",
    duration: 97,
  },
];
export const Hightlight = () => {
  return (
    <div style={{ margin: "20px 0px" }}>
      <Container fluid className="container">
        <Row className="justify-content-start g-4 d-flex flex-wrap ">
          {movies.map((movie) => (
            <Col
              xs={6}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              key={movie.id}
              className=" border-0"
            >
              <Card className="movie-card bg-black">
                <div className="badge-container">
                  <img src={movie.age_badge} alt="T18" className="age_badge" />
                </div>
                <div className="image-container">
                  <Card.Img variant="top" src={movie.image} alt={movie.title} />
                  <div className="overlay">
                    <Button variant="secondary" className="btn-hover">
                      Chi tiết
                    </Button>
                    <Button variant="danger" className="btn-hover">
                      Đặt vé
                    </Button>
                  </div>
                </div>
                <Card.Body className="card-body">
                  <Card.Title className="movie-title text-white">
                    {movie.title}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
export default Hightlight;
