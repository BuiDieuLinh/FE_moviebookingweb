import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import { Line} from "react-chartjs-2";
import "./home.css"
import axios from "axios";

const API_URL = process.env.REACT_APP_PORT;
const Home = () => {
  const [report, setReport] = useState({});
  const [historybooking, setHistoryBooking] = useState([]);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [topmovie, setTopMovie] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${API_URL}/reports/report`);
        setReport(response.data.data);
        const responseHB = await axios.get(`${API_URL}/reports/historybooking`);
        setHistoryBooking(responseHB.data)
        // Lấy doanh thu 7 ngày gần nhất
        const revenueResponse = await axios.get(`${API_URL}/reports/revenue-daily`);
        setDailyRevenueData(revenueResponse.data);

        const topmovieResponse = await axios.get(`${API_URL}/reports/topmovie`);
        setTopMovie(topmovieResponse.data);
      } catch (err) {
        console.error("Lỗi lấy báo cáo:", err);
      }
    };
  
    fetchReport();
  }, []);
  
  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    if (!value) return "0đ";
    return `${parseFloat(value).toLocaleString("vi-VN")}đ`;
  };

  // Hàm định dạng ngày (tùy chọn, nếu bạn muốn định dạng khác)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
};
// Dữ liệu cho biểu đồ doanh thu theo ngày (Line Chart)
const revenueChartData = {
  labels: dailyRevenueData.map((item) => formatDate(item.date)),
  datasets: [
    {
      label: "Doanh thu (VNĐ)",
      data: dailyRevenueData.map((item) => item.revenue),
      borderColor: "#007bff", // Xanh dương sáng nổi bật (màu Bootstrap primary)
      backgroundColor: "rgba(0, 123, 255, 0.3)",
      fill: true,
      tension: 0.3,
    },
  ],
};
  return (
    <div style={{marginTop: '70px'}}>
      <Container fluid>
        {/* Hàng hiển thị tổng quan */}
        <Row className="mb-4">
          <Col md={3}>
            <Card border="info"  className="p-3 text-start shadow-sm border-2">
              <span>Doanh thu trong ngày</span>
              <h5 className="fw-normal">{formatCurrency(report.revenue_today)}</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card border="success" className="p-3 text-start shadow-sm border-2">
              <span>Khách hàng mới</span>
              <h5 className="fw-normal">{report.new_customers_today}</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card border="warning" className="p-3 text-start shadow-sm border-2">
              <span>Tổng vé bán ra </span>
              <h5 className="fw-normal">{report.tickets_sold_today}</h5>
            </Card>
          </Col>
          <Col md={3}>
            <Card border="danger" className="p-3 text-start shadow-sm border-2">
              <span>Tổng doanh thu</span>
              <h5 className="fw-normal">{formatCurrency(report.total_revenue)}</h5>
            </Card>
          </Col>
        </Row>

        {/* Hàng hiển thị biểu đồ */}
        <Row className="mb-2">
          <Col md={7}>
            <Card className="p-3 shadow-sm">
              <span className="fs-5 mb-2 fw-bold">Doanh thu trong 7 ngày qua</span>
              <div style={{ height: "300px", borderRadius: "5px" }}>
                <Line
                  data={revenueChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.parsed.y.toLocaleString("vi-VN")}đ`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: (value) => `${value.toLocaleString("vi-VN")}đ`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="p-3 shadow-sm history-card">
              <span className="fs-5 mb-2 fw-bold text-start history-title">Lịch sử đặt vé</span>
              <div className="history-table-container">
                <Table hover className="history-table">
                  <thead>
                    <tr >
                      <th></th>
                      <th>Khách hàng</th>
                      {/* <th>Số tiền</th> */}
                      <th>Thời gian</th>
                      <th>Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historybooking && historybooking.length > 0 ? (
                      historybooking.map((hb, index) => (
                        <tr key={hb.id || hb.created_at}>
                          <td>{index +1}</td>
                          <td>{hb.username}</td>
                          {/* <td className="total-price">{formatCurrency(hb.total_price)}</td> */}
                          <td>{formatDate(hb.created_at)}</td>
                          <td>
                            <Badge pill bg={hb.status === "paid" ? "success" : "danger"}>
                              {hb.status === "paid" ? "Đã thanh toán" : "Huỷ vé"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card>
            <span className="fs-5 mb-2 fw-bold text-start history-title">Top 5 phim </span>
              <div className="history-table-container">
                <Table hover className="history-table">
                  <thead>
                    <tr>
                      <th>Phim</th>
                      <th>Số vé đã đặt</th>
                      <th>Lượt chiếu</th>
                      <th>Tỷ lệ lấp kín</th>
                      <th>Tổng doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topmovie && topmovie.length > 0 ? (
                      topmovie.map((top) => (
                        <tr key={top.id }>
                          <td className="text-start">{top.title}</td>
                          <td>{top.tickets_sold}</td>
                          <td>{top.view_count}</td>
                          <td><span className="seat_occupancy_rate">{parseFloat(top.seat_occupancy_rate).toFixed(1)}%</span></td>
                          <td className="total-price text-success">{formatCurrency(top.total_revenue)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    
  );
};

export default Home;
