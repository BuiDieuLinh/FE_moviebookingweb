import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './roomDetail.css'
import { Button, Form } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const API_URL = process.env.REACT_APP_PORT;
// Hàm generateSeats giữ nguyên
const generateSeats = (type) => {
  let totalSeats = type === 1 ? 100 : type === 2 ? 90 : 80;
  let rows = totalSeats / 10;
  let seats = [];

  for (let i = 1; i <= rows; i++) {
    if (i < rows) {
      for (let j = 1; j <= 10; j++) {
        let seatId = `${String.fromCharCode(64 + i)}${j}`;
        let seatType = i <= 4 ? "regular" : "vip";
        seats.push({ id: seatId, type: seatType });
      }
    } else {
      for (let j = 1; j <= 5; j++) {
        let seatId = `${String.fromCharCode(64 + i)}${j * 2 - 1}-${j * 2}`;
        seats.push({ id: seatId, type: "couple" });
      }
    }
  }
  return seats;
};

export default function RoomDetail() {
  const { room_id } = useParams();
  const [roomDetail, setRoomDetail] = useState({});
  const [seatData, setSeatData] = useState(generateSeats("1"));
  const [reportRoom, setReportRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState('2025-05-29'); 
  const [duration, setDuration] = useState('day'); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy thông tin phòng
        const roomResponse = await axios.get(`${API_URL}/rooms/${room_id}`);
        setRoomDetail(roomResponse.data);

        // Lấy dữ liệu thống kê
        const reportResponse = await axios.get(
          `${API_URL}/reports/${room_id}/statistics`,
          { params: { date, duration } }
        );
        if (reportResponse.data.error) {
          throw new Error(reportResponse.data.error);
        }
        setReportRoom(reportResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        setError(err.message || 'Không thể tải dữ liệu');
        setReportRoom(null);
        setLoading(false);
      }
    };
    fetchData();
  }, [room_id, date, duration]);

  useEffect(() => {
    if (roomDetail.room_type) {
      setSeatData(generateSeats(roomDetail.room_type));
    }
  }, [roomDetail.room_type]);

  // Xử lý thay đổi ngày
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Xử lý click nút duration
  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số suất chiếu",
        },
        ticks: {
          stepSize: 1,
          precision: 0, 
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  };
  if (error) return <div>{error}</div>;
  
  const getType = () => {
    if (!roomDetail) return { styleRoomType: "", roomTypeDisplay: "Không xác định", styleStatus: "unknown", statusDisplay: "Không xác định" };

    const type = roomDetail.room_type;
    const types = {
      1: { roomTypeDisplay: "Normal", styleRoomType: "normal" },
      2: { roomTypeDisplay: "Standard", styleRoomType: "standard" },
      3: { roomTypeDisplay: "Vip", styleRoomType: "roomvip" },
    };

    return {
      styleRoomType: types[type]?.styleRoomType || "",
      roomTypeDisplay: types[type]?.roomTypeDisplay || "Không xác định",
      styleStatus: roomDetail.room_status === 1 ? "showing" : "ready",
      statusDisplay: roomDetail.room_status === 1 ? "Đang chiếu" : "Sẵn sàng",
    };
  };
  return (
    <div className='roomdetail-container'>
      <div className='roomdetail'>
        <div className='box roominfo'>
          {(() => {
            const { styleRoomType, roomTypeDisplay, styleStatus, statusDisplay } = getType();
            return (
              <div className="d-flex align-items-center flex-wrap gap-2 mb-3 pb-2 border-bottom">
                <h5 className="fw-bold mb-0 me-2 text-dark"> 
                  <i class="fas fa-door-open"></i> {roomDetail?.room_name?.at(-1)} - {roomTypeDisplay}
                </h5>
                <span className="badge bg-warning text-dark">
                  <i className="fas fa-users me-1"></i>{roomDetail?.total_seats || 0} ghế
                </span>
                <span className={`badge ${styleStatus}`}>
                  <i className="fas fa-circle me-1"></i>{statusDisplay}
                </span>
              </div>
            );
          })()}
          <div className='d-flex justify-content-center align-items-center'>
            <div className='list-seats px-2 mt-3'>
              {Array.from(
                new Set(seatData.map((seat) => seat.id[0])),
              ).map((row) => (
                <div key={row} className="seatdetail-row">
                  {seatData
                    .filter((seat) => seat.id.startsWith(row))
                    .map((seat) => (
                      <Button
                        key={seat.id}
                        className={`seatdetail ${seat.type} `}
                      >
                        {seat.id}
                      </Button>
                    ))}
                </div>
              ))}
              <div className="text-center mt-3">
                <strong>Ghế đã chọn:</strong>{" "}
                {/* {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "Chưa chọn"} */}
              </div>
              <div className="d-flex justify-content-center">
                <div className="d-flex gap-2">
                  <Button variant="secondary" size="sm">
                    Đã đặt
                  </Button>
                  <Button
                    variant="info"
                    className="text-light"
                    size="sm"
                  >
                    Đang chọn
                  </Button>
                  <Button
                    style={{
                      backgroundColor: " rgb(128, 128, 128)",
                      border: "none",
                    }}
                    size="sm"
                  >
                    Ghế thường
                  </Button>
                  <Button
                    style={{
                      backgroundColor: " rgb(255, 132, 19)",
                      border: "none",
                    }}
                    size="sm"
                  >
                    Ghế Vip
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "rgb(255, 55, 65)",
                      border: "none",
                    }}
                    size="sm"
                  >
                    Ghế đôi
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="box report-room">
          <div className="mb-4 d-flex gap-4">
            {/* Trường chọn ngày */}
            <Form.Group className="d-flex gap-2 align-items-center">
              <Form.Label className="mb-0">Date:</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={date}
                onChange={handleDateChange}
              />
            </Form.Group>
            {/* Nút chọn duration */}
            <Form.Group className="d-flex gap-2 align-items-center">
              <Form.Label className="mb-0">Duration:</Form.Label>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={duration === 'day' ? 'primary' : 'outline-primary'}
                  onClick={() => handleDurationChange('day')}
                >
                  Ngày
                </Button>
                <Button
                  size="sm"
                  variant={duration === 'week' ? 'primary' : 'outline-primary'}
                  onClick={() => handleDurationChange('week')}
                >
                  Tuần
                </Button>
                <Button
                  size="sm"
                  variant={duration === 'month' ? 'primary' : 'outline-primary'}
                  onClick={() => handleDurationChange('month')}
                >
                  Tháng
                </Button>
              </div>
            </Form.Group>
          </div>
          <div className="dashboard-cards mb-4">
            <div className="card border-2" style={{ borderColor: "#005670" }}>
              <h5 className="fw-normal">
                <i className="fas fa-ticket-alt me-2"></i>Số suất chiếu
              </h5>
              <p className="m-0">{reportRoom?.screenings}</p> 
            </div>
            <div className="card border-2" style={{ borderColor: "#146c43" }}>
              <h5 className="fw-normal">
                <i className="fas fa-chair me-2"></i>Số ghế đã đặt
              </h5>
              <p className="m-0">{reportRoom?.bookedSeats}</p> 
            </div>
            <div className="card border-2" style={{ borderColor: "#856404" }}>
              <h5 className="fw-normal">
                <i className="fas fa-money-bill me-2"></i>Doanh thu
              </h5>
              <p className="m-0">{reportRoom?.revenue} VNĐ</p> 
            </div>
          </div>
          <div className="chart bar-chart-container">
            {loading ? (
              <div className="text-center">Đang tải biểu đồ...</div>
            ) : !reportRoom || !reportRoom.chartData || !Array.isArray(reportRoom.chartData.labels) ? (
              <div>Không có dữ liệu thống kê</div>
            ) : (
              <>
                <h5>
                  Suất chiếu theo {duration} - Phòng {roomDetail?.room_name?.at(-1) || room_id}
                </h5>
                <Bar
                  data={{
                    labels: reportRoom.chartData.labels,
                    datasets: reportRoom.chartData.datasets.map((dataset) => ({
                      ...dataset,
                      backgroundColor: '#005670',
                      borderColor: '#005670',
                      borderWidth: 1,
                    })),
                  }}
                  options={barChartOptions}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
