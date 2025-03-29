import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Dùng để chuyển hướng
import { jwtDecode } from "jwt-decode";
import "./login.css";

const CinemaAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook để điều hướng

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setError(null); // Xóa lỗi khi chuyển tab
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        username,
        password,
      });
  
      const { token } = response.data; // API chỉ trả về token
  
      // ✅ Giải mã token để lấy user_id
      const decoded = jwtDecode(token);
      const user_id = decoded.user_id; // Giả sử token chứa user_id
  
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
  
      // ✅ Gọi API lấy thông tin user
      fetchUserInfo(user_id, token);
    } catch (error) {
      setError("Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.");
    }
  };
  const fetchUserInfo = async (user_id, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userData = response.data[0]; // API trả về mảng
  
      localStorage.setItem("user", JSON.stringify(userData)); // Lưu user vào localStorage
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      setError("Không thể lấy thông tin người dùng.");
    }
  };
  

  return (
    <div className="cinema-auth-bg">
      <Container className="h-100">
        <Row className="justify-content-center flex-column align-items-center h-100">
          <Col xs={11} sm={10} md={8} lg={6} className='d-inline text-center mb-5'>
            <img src='logo-removebg-preview.png' width={100} height={50} style={{objectFit: 'cover'}}></img>
          </Col>
          
          <Col xs={11} sm={10} md={8} lg={6}>
            <div className="auth-card animate-fade-in">
              <div className="auth-header">
                <button className="close-btn">&times;</button>
                <h2 className="auth-title animate-title">
                  {isLogin ? 'Welcome Back!' : 'Welcome New Guest!'}
                </h2>
                <p className="auth-subtitle">
                  {isLogin ? 'Sign in to continue' : 'Register now, it’s free!'}
                </p>
              </div>

              <div className="auth-form">
                <Form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <Form.Group className="mb-3 animate-slide-in">
                      <Form.Control type="text" placeholder="Full Name" className="auth-input" />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      className="auth-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  {error && <p className="text-danger text-center">{error}</p>}

                  <Button variant="primary" type="submit" className="w-100 auth-button animate-button">
                    {isLogin ? 'Login' : 'Get Started'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="auth-switch-text">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <span className="switch-text animate-switch" onClick={handleSwitch}>
                      {isLogin ? 'Register' : 'Login'}
                    </span>
                  </p>
                </div>
              </div>
              {/* <div className="cinema-logo">
                <span>KING</span>
              </div> */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CinemaAuth;
