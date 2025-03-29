import React from 'react'

export const Seat = () => {
  const seats = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    isSelected: false,
    isBooked: Math.random() < 0.2, // Giả lập một số ghế đã được đặt
  }));
  
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  
  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };
  
  return (
    <div className="grid grid-cols-8 gap-2">
      {seats.map((seat) => (
        <button
          key={seat.id}
          className={`w-10 h-10 text-white rounded-md ${
            seat.isBooked ? "bg-gray-500 cursor-not-allowed" : 
            selectedSeats.includes(seat.id) ? "bg-green-500" : "bg-blue-500"
          }`}
          onClick={() => !seat.isBooked && toggleSeat(seat.id)}
        >
          {seat.id}
        </button>
      ))}
    </div>
  );
  
}
export default Seat;