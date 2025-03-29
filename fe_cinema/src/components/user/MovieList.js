import React from 'react'
import {Button, Card, Container, Row, Col} from 'react-bootstrap'
import "./movielist.css"

const movies = [
    { id: 1, title: "NHÀ GIA TIÊN", image: "nhagiatien_card.jpg", age_badge: "c-18.png", genre: "Gia đình, hài hước", duration: 117},
    { id: 2, title: "QUỶ NHẬP TRÀNG", image: "quynhaptrang_card.png", age_badge: "c-18.png", genre: "Kinh dị", duration: 122 },
    { id: 3, title: "CƯỚI MA", image: "cuoima_card.png", age_badge: "c-18.png", genre: "Kinh dị", duration: 97 },
    { id: 4, title: "FLOW", image: "lactroi_card.jpg", age_badge: "c-p.png", genre: "Hoạt hình", duration: 89 },
    { id: 5, title: "gIAO HÀNG CHO MA", image: "giahangchoma_card.png", age_badge: "c-18.png", genre: "Hài hước, kinh dị", duration: 104 },
    { id: 6, title: "LẠC TRÔI", image: "lactroi_card.jpg", age_badge: "c-18.png", genre: "Gia đình, hài hước", duration: 117 },
  ];
export const MovieList = () => {
  return (
    <div style={{margin: '30px 0px'}}>
        <Container fluid  className='container'>
            <Row className="justify-content-start g-4 d-flex flex-wrap ">
                {movies.map((movie) => (
                <Col xs={8} sm={6} md={4} lg={3} xl={3} key={movie.id} className="mb-4 border-0">
                    <Card className="movie-card bg-black">
                        <div className="badge-container">
                            <img src={movie.age_badge} alt="T18" className="age_badge" />
                        </div>
                        <div className="image-container">
                            <Card.Img variant="top" src={movie.image} alt={movie.title} />
                            <div className="overlay">
                            <Button variant="secondary" className="btn-hover">Chi tiết</Button>
                            <Button variant="danger" className="btn-hover">Đặt vé</Button>
                            </div>
                        </div>
                        <Card.Body className='card-body'>
                            <Card.Title className="movie-title text-white">{movie.title}</Card.Title>
                            <p><strong>Thể loại:</strong> {movie.genre}</p>
                            <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
                        </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>
        </Container>
    </div>
  )
}
export default MovieList;
