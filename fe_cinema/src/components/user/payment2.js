import axios from 'axios';
import { useState } from 'react';

function Payment() {
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      const bookingId = 'e41e79ff-1cdc-4e1c-be42-105178a3e9b0'; // Đảm bảo booking_id thực tế
      const amount = 150000; // 150.000 VND

      const response = await axios.post('http://localhost:5000/payments/create-payment', {
        booking_id: bookingId,
        amount: amount,
      });

      const { paymentUrl } = response.data;
      console.log('Redirecting to:', paymentUrl);
      window.location.href = paymentUrl;
    } catch (err) {
      console.error('Payment error:', err);
      setError('Có lỗi khi tạo URL thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{marginTop: '100px'}}>
      <button onClick={handlePayment}>Thanh toán</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Payment;