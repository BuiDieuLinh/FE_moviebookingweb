import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';


export const Account = () => {
  const [selectedTab, setSelectedTab] = useState('Tài khoản của tôi'); // Mặc định tab đầu tiên

  // Nội dung hiển thị theo tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'Tài khoản của tôi':
        return (
          <div className="content-account">🧑 Thông tin tài khoản
             <Form>
              <Row>
                <Col>
                  <Form.Control placeholder="First name" />
                </Col>
                <Col>
                  <Form.Control placeholder="Last name" />
                </Col>
                <Col>
                  <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="inputPassword5"
                    aria-describedby="passwordHelpBlock"
                  />
                  <Form.Text id="passwordHelpBlock" muted>
                    Your password must be 8-20 characters long, contain letters and numbers,
                    and must not contain spaces, special characters, or emoji.
                  </Form.Text>
                </Col>
              </Row>
            </Form>
          </div>
        );
      case 'Lịch sử giao dịch':
        return <div className="content-historyticket">📜 Lịch sử giao dịch</div>;
      case 'Quyền lợi':
        return <div className="content-3">🎁 Quyền lợi của bạn</div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ margin: '140px auto 30px', width: '70%' }}>
      <h4 className="fw-bold text-center text-light">Thông tin cá nhân</h4>
      
      {/* Thanh menu button */}
      <div className="menu d-flex justify-content-center align-items-center my-4 gap-3">
        {['Tài khoản của tôi', 'Lịch sử giao dịch', 'Quyền lợi'].map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? 'danger' : 'outline-danger'} // Nút nào được chọn sẽ có màu đỏ
            className="rounded-pill"
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Nội dung hiển thị */}
      <div className="container-content p-3 text-light bg-dark rounded mt-5">
        {renderContent()}
      </div>
    </div>
  );
};

export default Account;
