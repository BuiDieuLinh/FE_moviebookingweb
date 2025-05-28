import React from "react";
import Hightlight from "./Hightlight";
import { Button } from "react-bootstrap";
import "./info-cinema.css";

export const InfomationCinemas = () => {
  return (
    <div className="container-info">
      <div className="detail-cinema">
        <h2 className="fw-bold mb-0 ">STAR CINEMA</h2>
        <div className="network">
          <Button variant="primary" className="px-1 py-0">
            <i class="fas fa-thumbs-up"></i> Like
          </Button>
          <Button variant="primary" className="px-1 py-0">
            Share
          </Button>
          7 people like this. Be the first of your friends.
        </div>
        <img src="thumbnail.jpeg" />

        <p>
          Star Cinema có vị trí trung tâm, tọa lạc tại Hưng Yên Rạp tự hào là
          rạp phim tư nhân duy nhất và đầu tiên sở hữu hệ thống phòng chiếu phim
          đạt chuẩn Hollywood tại Huyện Khoái Châu.
        </p>
        <p>
          Rạp được trang bị hệ thống máy chiếu, phòng chiếu hiện đại với 100%
          nhập khẩu từ nước ngoài, với 4 phòng chiếu tương được 535 ghế ngồi. Hệ
          thống âm thanh Dolby 7.1 và hệ thống cách âm chuẩn quốc tế đảm bảo
          chất lượng âm thanh sống động nhất cho từng thước phim bom tấn.
        </p>
        <p>
          Mức giá xem phim tại Star Cinema rất cạnh tranh: giá vé 2D chỉ từ
          60.000 VNĐ và giá vé 3D chỉ từ 70.000 VNĐ. Không chỉ có vậy, rạp còn
          có nhiều chương trình khuyến mại, ưu đãi hàng tuần như đồng giá vé
          40.000 vào các ngày Thứ 3 vui vẻ, Thứ 4 Beta's Day, đồng giá vé cho
          Học sinh sinh viên, người cao tuổi, trẻ em.....
        </p>
        <h5>Thông tin liên hệ</h5>
        <p>Rạp Star Cinemas Hưng Yên</p>
        <p>
          <strong>
            Địa chỉ: 123 ABC, xã Tân Dân, huyện Khoái Châu, tỉnh Hưng Yên
          </strong>
        </p>
        <p>
          <strong>Hotline: </strong> 0867 460 053
        </p>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14903.909815466128!2d106.05226195!3d20.95342055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a30555555555%3A0x39a8acd006ab8e69!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgUGjhuqFtIEvhu7kgVGh14bqtdCBIxrBuZyBZw6puLCBDxqEgc-G7nyAy!5e0!3m2!1svi!2s!4v1741945479942!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="movies-highlight">
        <h2 className="text-secondary">PHIM ĐANG HOT</h2>
        <Hightlight />
      </div>
    </div>
  );
};
export default InfomationCinemas;
