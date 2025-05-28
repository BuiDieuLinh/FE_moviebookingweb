import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import { jwtDecode } from "jwt-decode";
import "./login.css";

const API_URL = process.env.REACT_APP_PORT;

const CinemaAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({}); // Sử dụng object thay vì null
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setErrors({}); // Xóa lỗi khi chuyển tab
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset lỗi trước khi gửi request

    try {
      if (!isLogin) {
        try {
          const response = await axios.post(`${API_URL}/users`, {
            email,
            username,
            password
          });
          console.log(response.data);
          showToast("Thành công", "Đăng nhập thành công",);
          setIsLogin(true); // Chuyển sang login sau khi đăng ký thành công
        } catch (err) {
          console.error("Lỗi khi đăng ký tài khoản: ", err);
          if (err.response && err.response.status === 400) {
            const { field, message } = err.response.data;
            setErrors({ [field]: message }); // Lưu lỗi theo field
          } else {
            setErrors({ general: "Đăng ký thất bại! Vui lòng thử lại." });
          }
          return; // Dừng lại nếu đăng ký thất bại
        }
      }

      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password,
      });

      const { token } = response.data;
      const decoded = jwtDecode(token);
      const user_id = decoded.user_id;
      const role = decoded.role;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      if(role === 'admin'){
        showToast("Thông báo", "Đăng nhập thành công!", "success")
        fetchUserInfo(user_id, token);
      }else{
        showToast("Warning", "Bạn không có quyền truy cập vào hệ thống này!","secondary")
      }
    } catch (error) {
      setErrors({ general: "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản." });
    }
  };

  const fetchUserInfo = async (user_id, token) => {
    try {
      const response = await axios.get(`${API_URL}/users/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data[0];
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      setErrors({ general: "Không thể lấy thông tin người dùng!" });
    }
  };

  return (
    <div className="cinema-auth-bg">
      <Container className="h-100">
        <Row className="justify-content-center flex-column align-items-center h-100">
          <Col xs={11} sm={10} md={8} lg={6} className='d-inline text-center mb-5'>
            <img src='logo-removebg-preview.png' width={100} height={50} style={{ objectFit: 'cover' }} alt="logo" />
          </Col>

          <Col xs={11} sm={10} md={8} lg={6}>
            <div className="auth-card animate-fade-in">
              <div className="auth-header">
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
                      <Form.Control
                        type="email" // Đổi thành type="email" để validate email tốt hơn
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email} // Kiểm tra lỗi email
                        className="auth-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      className="auth-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      isInvalid={!!errors.username} // Kiểm tra lỗi username
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
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

                  {errors.general && (
                    <p className="text-danger text-center">{errors.general}</p>
                  )}

                  <Button type="submit" variant='danger' className="w-100 auth-button animate-button">
                    {isLogin ? 'Login' : 'Get Started'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="auth-switch-text">
                    <span className='text-light'>{isLogin ? "Don't have an account? " : 'Already have an account? '}</span>
                    <span className="switch-text animate-switch" onClick={handleSwitch}>
                      {isLogin ? 'Register' : 'Login'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CinemaAuth;
