// Order.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const API_URL = process.env.REACT_APP_API_URL;

const Order = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Lấy dữ liệu từ state
  const { screening_id, selectedSeats, totalPrice } = state || {};

  // Lấy user_id từ localStorage
  const user_id = localStorage.getItem('user_id');

  // Kiểm tra dữ liệu
  useEffect(() => {
    if (!screening_id || !selectedSeats || !totalPrice || !user_id) {
      setError('Thiếu thông tin để thực hiện thanh toán. Vui lòng quay lại và thử lại.');
    }
  }, [screening_id, selectedSeats, totalPrice, user_id]);

  const handlePayment = async () => {
    if (!user_id) {
      setError('Bạn cần đăng nhập để thực hiện thanh toán.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Bước 1: Tạo bản ghi trong bảng Bookings
      const bookingResponse = await axios.post(`${API_URL}/bookings`, {
        user_id: user_id,
        screening_id: screening_id,
        total_price: totalPrice,
        status: 'pending'
      });

      const booking_id = bookingResponse.data.booking_id;

      // Bước 2: Tạo các bản ghi trong bảng BookingDetails
      const bookingDetailsPromises = selectedSeats.map(seat =>
        axios.post(`${API_URL}/booking-details`, {
          booking_id: booking_id,
          seat_id: seat.seat_name, // Sử dụng seat_name trực tiếp (giả định seat_name chính là seat_id trong bảng Seats)
          price: seat.price
        })
      );
      await Promise.all(bookingDetailsPromises);

      // Bước 3: Tạo bản ghi trong bảng Payments
      const paymentResponse = await axios.post(`${API_URL}/payments`, {
        booking_id: booking_id,
        amount: totalPrice,
        payment_method: paymentMethod,
        payment_status: 'pending'
      });

      // Giả lập thanh toán thành công
      const paymentStatus = 'success';
      if (paymentStatus === 'success') {
        await axios.put(`${API_URL}/bookings/${booking_id}`, {
          status: 'paid'
        });
        await axios.put(`${API_URL}/payments/${paymentResponse.data.payment_id}`, {
          payment_status: 'success'
        });

        alert('Thanh toán thành công!');
        navigate('/booking-success', { state: { booking_id } });
      } else {
        throw new Error('Thanh toán thất bại.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className='text-light text-center my-4'>
        <p>{error}</p>
        <Button variant='dark' onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className='w-75 m-auto text-light' style={{marginTop:'70px'}}>
        <div>
            <h5>Thông tin phim</h5>
            
        </div>
      <h3>Thanh Toán Đặt Vé</h3>
      <div className='my-4'>
        <p><strong>Suất chiếu:</strong> {screening_id}</p>
        <p><strong>Ghế đã chọn:</strong> {selectedSeats.map(seat => seat.seat_name).join(", ")}</p>
        <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString('vi-VN')} VNĐ</p>
      </div>

      <div className='my-4'>
        <label><strong>Phương thức thanh toán:</strong></label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className='form-select bg-dark text-light'
        >
          <option value='momo'>MoMo</option>
          <option value='credit_card'>Thẻ tín dụng</option>
          <option value='bank_transfer'>Chuyển khoản ngân hàng</option>
        </select>
      </div>

      <div className='d-flex justify-content-end'>
        <Button
          variant='dark'
          className='rounded-pill mx-2 p-2'
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Button
          variant='danger'
          className='rounded-pill p-2'
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
        </Button>
      </div>
    </div>
  );
};

export default Order;