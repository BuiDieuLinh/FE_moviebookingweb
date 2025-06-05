import React from 'react';
import './ticketprice.css';

export default function TicketPrice() {
  
  return (
    <div className='container-prices'>
      <h4>Bảng quy định giá vé - Star Cinema</h4>

      <h5 className='mb-4'>Giá vé theo ngày áp dụng (VND)</h5>
      <table className="price-table">
        <thead>
          <tr>
            <th>Loại ghế</th>
            <th>Ngày thường</th>
            <th>Cuối tuần</th>
            <th>Ngày lễ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Regular</td>
            <td>50.000</td>
            <td>60.000</td>
            <td>80.000</td>
          </tr>
          <tr>
            <td>VIP</td>
            <td>65.000</td>
            <td>75.000</td>
            <td>80.000</td>
          </tr>
          <tr>
            <td>Couple</td>
            <td>120.000</td>
            <td>130.000</td>
            <td>180.000</td>
          </tr>
        </tbody>
      </table>

      <div className="notes">
        <h4><i class="fa-solid fa-star-of-life"></i> Ghi chú</h4>

        <h5>Ngày áp dụng:</h5>
        <ul>
          <li><strong>Ngày thường:</strong> Thứ 2 đến Thứ 6 .</li>
          <li><strong>Cuối tuần:</strong> Thứ 7 và Chủ nhật .</li>
          <li><strong>Ngày lễ:</strong> Áp dụng cho các ngày lễ lớn như Tết, 30/4, 2/9.</li>
        </ul>

        <h5>Tăng giá:</h5>
        <ul>
          <li><strong>Cuối tuần:</strong> Regular tăng 10.000 VND, VIP tăng 10.000 VND, Couple tăng 10.000 VND.</li>
          <li><strong>Ngày lễ:</strong> Regular tăng 30.000 VND, VIP tăng 15.000 VND, Couple tăng 60.000 VND.</li>
        </ul>

        <h5>Phụ thu:</h5>
        <ul>
          <li><strong>Ghế VIP:</strong> Thêm 20.000 VND cho tất cả ngày (đã gộp vào giá cơ bản).</li>
          <li><strong>Ghế Couple:</strong> Thêm 50.000 VND cho tất cả ngày (đã gộp vào giá cơ bản).</li>
        </ul>

        <h5>Kiểm tra tuổi và loại khách hàng:</h5>
        <p className=''>
          Để sau, bạn có thể thêm logic xác minh độ tuổi (ví dụ: trẻ em dưới 1m3, người cao tuổi trên 55 tuổi) 
          trong bước thanh toán hoặc giao diện người dùng.
        </p>
      </div>
    </div>
  );
}
