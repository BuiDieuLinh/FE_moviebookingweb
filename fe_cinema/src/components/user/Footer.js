import React from "react";
import "./footer.css"

const Footer = () => {
  return (
    <footer className="bg-dark py-4 text-light w-100">
      <div className="container">
        <div className="row">
          {/* Cột 1: Logo & Menu */}
          <div className="col-md-2">
            <img src="/logo-removebg-preview.png" alt="Star Cinemas" className="mb-3" width="100" height="60" style={{objectFit: 'cover'}}/>
            <ul className="list-unstyled">
              <li><a href="#"><i class="fa-solid fa-angle-right"></i> Giới thiệu</a></li>
              <li><a href="#"><i class="fa-solid fa-angle-right"></i> Tuyển dụng</a></li>
              <li><a href="#"><i class="fa-solid fa-angle-right"></i> Liên hệ</a></li>
              <li><a href="#"><i class="fa-solid fa-angle-right"></i> F.A.Q</a></li>
              <li><a href="#"><i class="fa-solid fa-angle-right"></i> Điều khoản sử dụng</a></li>
              <li><a href="#"><i class="fa-solid fa-angle-right"></i> Chính sách hoàn vé</a></li>
            </ul>
          </div>

          {/* Cột 2: Cụm rạp */}
          <div className="col-md-4">
            <h5 className="fw-bold d-inline-block border-bottom border-3 pb-1 border-danger">CỤM RẠP STAR</h5>
            <ul className="list-unstyled">
              <li><i class="fa-solid fa-angle-right"></i> Star Cinemas Xuân Thủy - Hotline 0333 023 183</li>
              <li><i class="fa-solid fa-angle-right"></i> Star Cinemas Tây Sơn - Hotline 0976 894 773</li>
              <li><i class="fa-solid fa-angle-right"></i> Star Cinemas Vĩnh Yên - Hotline 0977 632 215</li>
              <li><i class="fa-solid fa-angle-right"></i> Star Cinemas HCM - Hotline 0969 874 873</li>
              <li><i class="fa-solid fa-angle-right"></i> Star Cinemas Lào Cai - Hotline 0358 968 970</li>
              <li><i class="fa-solid fa-angle-right"></i> Star Cinemas Trần Quang Khải - Hotline 1900 638 362</li>
            </ul>
          </div>

          {/* Cột 3: Kết nối MXH */}
          <div className="col-md-3">
            <h5 className="fw-bold d-inline-block border-bottom border-3 pb-1 border-danger text-nowrap">KẾT NỐI VỚI CHÚNG TÔI</h5>
            <div className="d-flex gap-2">
              <a href="#"><img src="/facebook.png"  alt="Facebook" /></a>
              <a href="#"><img src="/tiktok.png"  alt="Tiktok" /></a>
              <a href="#"><img src="/instagram.png" alt="Instagram" /></a>
            </div>
            <img src="/dathongbao.png" className="mt-3" width="120" alt="Bộ Công Thương" />
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="col-md-3 ">
            <h5 className="fw-bold d-inline-block border-bottom border-3 pb-1 border-danger">LIÊN HỆ</h5>
            <p className="mb-1">CÔNG TY CỔ PHẦN STAR MEDIA</p>
            <p className="mb-1">Hotline: <strong>1900 636807 / 0934632682</strong></p>
            <p>Email: <a href="mailto:mkt@starcinemas.vn">mkt@starcinemas.vn</a></p>
            <h6 className="fw-bold mt-3">Liên hệ hợp tác kinh doanh:</h6>
            <p>Hotline: <strong>1800 646 420</strong></p>
            <p>Email: <a href="mailto:bachtx@betagroup.vn">bachtx@betagroup.vn</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
