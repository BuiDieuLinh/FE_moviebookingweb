import React, { use, useEffect, useState } from 'react';
import { Button, Form, Row, Col, Table } from 'react-bootstrap';
import './account.css'
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
export const Account = () => {
  const [selectedTab, setSelectedTab] = useState('Tài khoản của tôi'); // Mặc định tab đầu tiên
  const [user, setUser] = useState(null);
  const user_id = localStorage.getItem('user_id')
  useEffect(() => {
    fetchUser();
  },[])

  const fetchUser = async () =>{
    const response = await axios.get(`${API_URL}/users/${user_id}`)
    setUser(response.data[0])
    console.log(response.data)
  }
  // Nội dung hiển thị theo tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'Tài khoản của tôi':
        return (
          <div className="content-account">
            <Form>
            <Row className="mb-3">
              <Col>
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    className="custom-input custom-input-disabled"
                    aria-label="Disabled input example"
                    disabled
                    readOnly
                    value={user?.username || ''} // Gán giá trị username
                  />
                </Col>
                <Col>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-input custom-input-disabled"
                    aria-label="Disabled input example"
                    disabled
                    readOnly
                    value={user?.email || ''}
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control className="custom-input" value={user?.phone || ""}/>
                </Col>
                <Col>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control className="custom-input" placeholder="Địa chỉ" />
                </Col>
              </Row>
            </Form>
            <div className='d-flex gap-2 justify-content-end mt-5'>
              <Button variant='outline-secondary' size='sm'>Đổi mật khẩu</Button>
              <Button variant='danger' size='sm'>Lưu thông tin</Button>
            </div>
          </div>
        );
      case 'Lịch sử giao dịch':
        return <div className="content-historyticket">
             <Table hover className='custom-table'>
                <thead>
                  <tr>
                    <th>Ngày giao dịch</th>
                    <th>Tên phim</th>
                    <th>Số vé</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  
                </tbody>
              </Table>
        </div>;
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
      <div className="container-content p-3 text-light rounded ">
        {renderContent()}
      </div>
    </div>
  );
};

export default Account;
