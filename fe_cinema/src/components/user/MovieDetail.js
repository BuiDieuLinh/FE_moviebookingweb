import React from 'react'
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "./moviedetail.css"

const moviedetail = {
  title: "Nhà gia tiên",
  image: "nhagiatien_card.png"
}
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className='bg-dark text-light'>
        <Modal.Title id="contained-modal-title-vcenter">
          Chi tiết nội dung
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark text-light rounded-bottom'>
        <p>
          Nhà Gia Tiên xoay quanh câu chuyện đa góc nhìn về các thế hệ khác nhau trong một gia đình, 
          có hai nhân vật chính là Gia Minh (Huỳnh Lập) và Mỹ Tiên (Phương Mỹ Chi). 
          Trở về căn nhà gia tiên để quay các video “triệu view” trên mạng xã hội, 
          Mỹ Tiên - một nhà sáng tạo nội dung thuộc thế hệ Z vốn không tin vào chuyện tâm linh, 
          hoàn toàn mất kết nối với gia đình, bất ngờ nhìn thấy Gia Minh - người anh trai đã mất từ lâu. 
          Để hồn ma của Gia Minh có thể siêu thoát và không tiếp tục làm phiền mình, 
          Mỹ Tiên bắt tay cùng Gia Minh lên kế hoạch giữ lấy căn nhà gia tiên đang bị họ hàng tranh chấp, 
          đòi ông nội chia tài sản. Đứng trước hàng loạt bí mật động trời trong căn nhà gia tiên, 
          liệu Mỹ Tiên có vượt qua được tất cả để hoàn thành di nguyện của Gia Minh?
        </p>
      </Modal.Body>
    </Modal>
  );
}

export const MovieDetail = () => {
  {/** Ngày xem */}
  const [selectedDate, setSelectedDate] = useState(1); // Mặc định chọn ngày 10

  const dates = Array.from({ length: 7 }, (_, i) => ({
    day: "Th.03",
    date: i + 1,
    weekDay: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"][(i + 1) % 7],
  }));
  {/** xem chi tiết*/}
  const [modalShow, setModalShow] = React.useState(false);

    return (
      <div className='container-details'>
        {/* Thông tin chi tiết */}
        <Card className="bg-dark text-light rounded-0 position-relative min-h-auto">
          {/* Ảnh nền */}
          <Card.Img src="nhagiatien_poster.jpg" className='rounded-0' alt="Poster" style={{ opacity: '0.2' }} />
          
          {/* Overlay nội dung */}
          <Card.ImgOverlay className='d-flex flex-column w-75 m-auto p-3'>
            <div className="row align-items-start container-overlay">
              {/* Ảnh nhỏ - chiếm 40% trên màn lớn, 100% trên màn nhỏ */}
              <div className="text-center card-logo">
                <img src='nhagiatien_card.jpg' alt='Card' className='rounded-4 '/>
              </div>

              {/* Nội dung - chiếm 60% trên màn lớn, 100% trên màn nhỏ */}
              
                <div className='title-rep title-movie'>
                  <Card.Title className="fs-3 fw-bold text-uppercase">{moviedetail.title}</Card.Title>
                  <Card.Text className=''>
                    Hài, Tâm lý, tình cảm, Hài, Tâm lý <span>Viet Nam</span><span>117 phút</span>
                  </Card.Text>
                </div>
                <div className="text-md-start mt-3 info-detail">
                  <Card.Text className='m-0 '> Đạo diễn: <span>Huỳnh Lập</span></Card.Text>
                  <Card.Text className='m-0 '> Diễn viên: <span>Huỳnh Lập</span></Card.Text>
                  <Card.Text className=''> Khởi chiếu: <span>21/02/2025</span></Card.Text>
                  <Card.Text className='text-truncate-multiline '> 
                    Nhà Gia Tiên xoay quanh câu chuyện đa góc nhìn về các thế hệ khác nhau trong một gia đình, 
                    có hai nhân vật chính là Gia Minh (Huỳnh Lập) và Mỹ Tiên (Phương Mỹ Chi). 
                    Trở về căn nhà gia tiên để quay các video “triệu view” trên mạng xã hội, 
                    Mỹ Tiên - một nhà sáng tạo nội dung thuộc thế hệ Z vốn không tin vào chuyện tâm linh, 
                    hoàn toàn mất kết nối với gia đình, bất ngờ nhìn thấy Gia Minh - người anh trai đã mất từ lâu. 
                    Để hồn ma của Gia Minh có thể siêu thoát và không tiếp tục làm phiền mình, 
                    Mỹ Tiên bắt tay cùng Gia Minh lên kế hoạch giữ lấy căn nhà gia tiên đang bị họ hàng tranh chấp, 
                    đòi ông nội chia tài sản. Đứng trước hàng loạt bí mật động trời trong căn nhà gia tiên, 
                    liệu Mỹ Tiên có vượt qua được tất cả để hoàn thành di nguyện của Gia Minh?
                  </Card.Text>
                  <Card.Text className='text-danger'>Kiểm duyệt: T18 - Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên (18+)</Card.Text>
                  
                  {/* chi tiết  */}
                  <div className='d-flex gap-4 align-items-center '>
                    <a className='text-decoration-underline text-light' onClick={() => setModalShow(true)}>chi tiết nội dung</a>
                    <Button className='rounded-pill border-2 border-warning px-4 bg-transparent text-warning' onClick={() => setModalShow(true)}>
                      Trailer
                    </Button>
                  </div>

                  <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)} />
                </div>
              
            </div>
          </Card.ImgOverlay>
        </Card>

        {/* Ngày chiếu */}
        <div className='container-date text-light bg-dark'>
            {/* {dates.map((item) => (
              <div
                key={item.date}
                className={`date ${selectedDate === item.date ? "selected" : ""}`}
                onClick={() => setSelectedDate(item.date)}
              >
                <p>{item.day}</p>
                <p className="fs-5 fw-bold">{item.date}</p>
                <p>{item.weekDay}</p>
              </div>
            ))} */}
          <div className="date-list">
            {dates.map((item) => (
              <div
                key={item.date}
                className={`date ${selectedDate === item.date ? "selected" : ""}`}
                onClick={() => setSelectedDate(item.date)}
              >
                <p>{item.day}</p>
                <p className="fs-5 fw-bold">{item.date}</p>
                <p>{item.weekDay}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Nơi chiếu */}
        <div className=''>
            
        </div>

        {/* Giờ chiếu */}
        <div className='container-showtime'>
          <p className='text-center text-warning'>Lưu ý: Khán giả dưới 13 tuổi chỉ chọn suất chiếu kết thúc trước 22h và Khán giả dưới 16 tuổi chỉ chọn suất chiếu kết thúc trước 23h.</p>
          <div className='showtime'>
            <button> 9:00 </button>
            <button> 9:00 </button>
            <button> 9:00 </button>
            <button> 9:00 </button>
            <button> 9:00 </button>
            <button> 9:00 </button>
            <button> 9:00 </button>
            <button> 9:00 </button>
          </div>
        
        </div>
      </div>
    )
  }

export default MovieDetail;
