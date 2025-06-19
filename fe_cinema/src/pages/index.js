import React from "react";
import Section from "../components/user/Section";
import MovieList from "../components/user/MovieList";
import Slideshow from "../components/user/Slideshow";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Slideshow />
      <Section title="Phim đang chiếu" />
      <MovieList status="now_showing" page={1} limit={10} />
      <Section title="Phim sắp chiếu" />
      <MovieList status="coming_soon" page={1} limit={10}/>
    </div>
  );
}
