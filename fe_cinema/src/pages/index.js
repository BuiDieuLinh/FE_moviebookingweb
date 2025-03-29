import React from "react";
import Section from "../components/user/Section"
import MovieList from "../components/user/MovieList"
import Slideshow from "../components/user/Slideshow"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Slideshow />
      <Section/>
      <MovieList/>
    </div>
  );
}
