import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { format, isBefore, isAfter, parse, toDate } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import vi from "date-fns/locale/vi";
import './showtimedetail.css'

const API_URL = process.env.REACT_APP_PORT;
const TIME_ZONE = "Asia/Ho_Chi_Minh";
export default function ShowtimeDetail() {
  const { showtime_id } = useParams();
  const [showtimeDetail, setShowtimeDetail] = useState({ screenings: [] });

  useEffect(() => {
    fetchShowtimebyID();
  }, []);

  const fetchShowtimebyID = async () => {
    try {
      const response = await axios.get(`${API_URL}/showtimes/${showtime_id}`);
      setShowtimeDetail(response.data);
      console.log(showtimeDetail);
      console.log(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu: ", err);
    }
  };

  const now = toZonedTime(new Date(), TIME_ZONE);
  const getStatusInfo = (screening) => {
    const screeningDateTime = `${screening.screening_date}T${screening.start_time}`;
    const screeningEndDateTime = `${screening.screening_date}T${screening.end_time}`;

    if (isAfter(now, screeningEndDateTime)) {
      return {
        label: "Đã chiếu",
        class: "completed",
      };
    } else if (isBefore(now, screeningDateTime)) {
      return {
        label: "Sắp chiếu",
        class: "commingsoon",
      };
    } else {
      return {
        label: "Đang chiếu",
        class: "nowshowing",
      };
    }
  };

    const getStatus = (showtime) => {
        const today = toZonedTime(new Date(), TIME_ZONE);

        let startDate, endDate;
        try {
            startDate = toZonedTime(parse(showtime.start_time, 'yyyy-MM-dd', new Date()), TIME_ZONE);
            endDate = toZonedTime(parse(showtime.end_time, 'yyyy-MM-dd', new Date()), TIME_ZONE);
        } catch (error) {
            console.error('Lỗi parse ngày:', error);
            return { label: 'Ngày không hợp lệ', class: '' };
        }

        if (isBefore(endDate, today)) {
            return { label: 'Hoàn thành', class: 'completed' };
        } else if (isAfter(startDate, today)) {
            return { label: 'Sắp chiếu', class: 'commingshow' };
        } else {
            return { label: 'Đang chiếu', class: 'nowshowing' };
        }
    };
  return (
    <div className="container-detail">
      <div>
        <div className="d-flex justify-content-between mb-2 p-2 border-bottom">
            <p className="m-0 fs-6 fw-bold">{showtimeDetail.movie_title || 'Chưa có dữ liệu'}</p>
            <p className="m-0 "> 
                Lịch chiếu: 
                <span className="styleimax fw-bold ms-2">
                    {showtimeDetail.start_time
                    ? format(toZonedTime(new Date(showtimeDetail.start_time), TIME_ZONE), 'dd/MM/yyyy', { locale: vi })
                    : 'Chưa có thời gian'} - 
                    {showtimeDetail.end_time
                    ? format(toZonedTime(new Date(showtimeDetail.end_time), TIME_ZONE), 'dd/MM/yyyy', { locale: vi })
                    : 'Chưa có thời gian'}
                </span>
            </p>
        </div>
        <div>
          <div className="d-flex justify-content-between align-item-center pt-4">
            <h5>Screenings List</h5> 
            <Button 
                variant="primary" 
                size="sx" 
                disabled={getStatus(showtimeDetail).label === 'Hoàn thành'} >
                Tạo suất chiếu
            </Button>
          </div>
          <div className="table-responsive rounded-2">
            <Table hover>
              <thead>
                <tr>
                  <th>Phim chiếu</th>
                  <th>Phòng chiếu</th>
                  <th>Hình thức chiếu</th>
                  <th>Hình thức dịch</th>
                  <th>Thời gian chiếu</th>
                  <th>Ngày chiếu</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {showtimeDetail.screenings?.map((screen) => {
                  const statusInfo = getStatusInfo(screen);
                  const formatStyle =
                    screen.screening_format === "2D"
                      ? "style2d"
                      : screen.screening_format === "3D"
                        ? "style3d"
                        : "styleimax";

                  return (
                    <tr key={screen.screening_id}>
                      <td className="movie-title-column">
                        {screen.movie_title}
                      </td>
                      <td>{screen.room_name}</td>
                      <td className="text-center">
                        <span className={formatStyle}>
                          {screen.screening_format}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="translator">
                          {screen.screening_translation}
                        </span>
                      </td>
                      <td>
                        <span className="screening">{`${screen.start_time} - ${screen.end_time}`}</span>
                      </td>
                      <td className="text-center">{screen.screening_date}</td>
                      <td className="text-center">
                        <span className={statusInfo.class}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="text-end">
                        <Button
                          style={{
                            border: "1px solid #A9141E",
                            backgroundColor: "#A9141E",
                            color: "white",
                          }}
                          size="sm"
                          // onClick={() => handleShowModalScreen(screen)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
