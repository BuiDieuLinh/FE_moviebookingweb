import React from "react";
import Section from "../components/user/Section";
import MovieList from "../components/user/MovieList";
export const movie = () => {
  return (
    <div style={{ margin: "100px auto" }}>
      <Section title="Phim đang chiếu" />
      <MovieList status="now_showing" page={1} limit={14}/>
      <Section title="Phim sắp chiếu" />
      <MovieList status="coming_soon" page={1}/>
    </div>
  );
};
export default movie;
