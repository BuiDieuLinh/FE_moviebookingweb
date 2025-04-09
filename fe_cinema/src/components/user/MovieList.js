import React, { useEffect, useState } from 'react'
import {Button, Card, Container, Row, Col} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./movielist.css"

const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL)

// const movies = [
//     { id: 1, title: "NHÀ GIA TIÊN", image: "nhagiatien_card.jpg", age_badge: "c-18.png", genre: "Gia đình, hài hước", duration: 117},
//     { id: 2, title: "QUỶ NHẬP TRÀNG", image: "quynhaptrang_card.png", age_badge: "c-18.png", genre: "Kinh dị", duration: 122 },
//     { id: 3, title: "CƯỚI MA", image: "cuoima_card.png", age_badge: "c-18.png", genre: "Kinh dị", duration: 97 },
//     { id: 4, title: "FLOW", image: "lactroi_card.jpg", age_badge: "c-p.png", genre: "Hoạt hình", duration: 89 },
//     { id: 5, title: "gIAO HÀNG CHO MA", image: "giahangchoma_card.png", age_badge: "c-18.png", genre: "Hài hước, kinh dị", duration: 104 },
//     { id: 6, title: "LẠC TRÔI", image: "lactroi_card.jpg", age_badge: "c-18.png", genre: "Gia đình, hài hước", duration: 117 },
//   ];
export const MovieList = () => {
    const [movies, setMoive] = useState([]);
    const navigate = useNavigate(); // Hook để điều hướng

    useEffect(() =>{
        fetchMovies();
    },[]);

    const fetchMovies = async () =>{
        try{
            const response = await axios.get(`${API_URL}/movies`)
            setMoive(response.data);
            console.log(response.data);
        }catch(error){
            console.error("Loi khi lay danh sach phim: ", error)
        }
        
    }
  return (
    <div >
        <Container fluid  className='container'>
            <Row className="justify-content-start g-4 d-flex flex-wrap ">
                {movies.map((movie) => (
                <Col xs={8} sm={6} md={4} lg={3} xl={3} key={movie.movie_id} className="mb-4 border-0">
                    <Card className="movie-card bg-black">
                        <div className="badge-container">
                        <img 
                            src={movie.age_restriction === 0 ? "c-p.png" : movie.age_restriction === 16 ? "c-16.png" : "c-18.png"} 
                            alt={movie.age_restriction} 
                            className="age_badge" 
                        />
                        </div>
                        <div className="image-container">
                            <Card.Img style={{maxHeight: '270px'}} variant="top" src={`${API_URL}${movie.poster_url}`} alt={movie.title} />
                            <div className="overlay">
                            <Button variant="secondary" 
                                    className="btn-hover" 
                                    onClick={() => navigate(`/movie/${movie.movie_id}`)}>Chi tiết
                            </Button>
                            <Button variant="danger" className="btn-hover">Đặt vé</Button>
                            </div>
                        </div>
                        <Card.Body className='card-body'>
                            <div className='d-flex justify-content-between my-2'>
                                 <p>{movie.genre}</p>
                                <p>{movie.duration} phút</p>
                            </div>
                            <Card.Title className="movie-title text-white">{movie.title}</Card.Title>
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
