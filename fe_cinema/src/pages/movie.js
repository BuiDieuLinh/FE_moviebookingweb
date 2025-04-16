import React from 'react'
import Section from '../components/user/Section';
import MovieList from '../components/user/MovieList';
export const movie = () => {
  return (
    <div style={{margin: '100px auto'}}>
      <Section title="Phim đang chiếu" />
      <MovieList status="now_showing"/>
      <Section title="Phim sắp chiếu" />
      <MovieList status="coming_soon"/>
    </div>
  )
}
export default movie;