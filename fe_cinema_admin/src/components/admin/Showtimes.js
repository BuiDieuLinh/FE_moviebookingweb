import React from "react";
import { Accordion } from "react-bootstrap";
import { Showtime } from "./Showtime";
import { Screening } from "./Screening";

const Showtimes = () => {
  return (
    <div style={{ marginTop: "70px" }}>
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        <Showtime />
        <Screening />
      </Accordion>
    </div>
  );
};

export default Showtimes;
