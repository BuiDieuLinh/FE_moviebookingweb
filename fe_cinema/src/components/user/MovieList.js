import React, { useEffect, useState } from 'react'
import {Button, Card, Container, Row, Col} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./movielist.css"

const API_URL = process.env.REACT_APP_API_URL;

export const MovieList = ({status}) => {
    const [movies, setMoive] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() =>{
        fetchMovies();
    },[]);

    const fetchMovies = async () =>{
        try{
            const response = await axios.get(`${API_URL}/movies`)
            const listmovies = response.data;
            const today = new Date();
            const filterMovies = listmovies.filter(movie => {
                const releaseDate = new Date(movie.release_date);
                if (status === 'now_showing') {
                    return releaseDate <= today;
                } else if (status === 'coming_soon') {
                return releaseDate > today;
                } else {
                return true;
                }
            })
            setMoive(filterMovies);
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
                    <Card className="movie-card bg-black" onClick={() => navigate(`/movie/${movie.movie_id}`)}>
                        <div className="badge-container">
                        <img 
                            src={movie.age_restriction === 0 ? "c-p.png" : movie.age_restriction === 16 ? "c-16.png" : "c-18.png"} 
                            alt={movie.age_restriction} 
                            className="age_badge" 
                        />
                        </div>
                        <div className="image-container">
                            <Card.Img style={{maxHeight: '270px'}} variant="top" src={`${API_URL}${movie.poster_url}`} alt={movie.title} />
                            
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
