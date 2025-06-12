import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import "./login.css";

const API_URL = process.env.REACT_APP_API_URL;

const CinemaAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 

    try {
      if (!isLogin) {
        try {
          const response = await axios.post(`${API_URL}/users`, {
            email,
            username,
            password,
          });
          console.log(response.data);
          Swal.fire({
            title: "Signup Successful!",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          setIsLogin(true);
        } catch (err) {
          console.error("Lỗi khi đăng ký tài khoản: ", err);
          if (err.response && err.response.status === 400) {
            const { field, message } = err.response.data;
            setErrors({ [field]: message }); 
          } else {
            setErrors({ general: "Đăng ký thất bại! Vui lòng thử lại." });
          }
          return;
        }
      }

      const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      const { token } = response.data;
      const decoded = jwtDecode(token);
      const user_id = decoded.user_id;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);

      fetchUserInfo(user_id, token);
    } catch (error) {
      setErrors({
        general: "Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.",
      });
    }
  };

  const fetchUserInfo = async (user_id, token) => {
    try {
      const response = await axios.get(`${API_URL}/users/${user_id}`);

      const userData = response.data[0];
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      setErrors({ general: "Không thể lấy thông tin người dùng!" });
    }
  };

  const handleLoginWithGoogle = async (credentialResponse) => {
  console.log("credentialResponse:", credentialResponse);
  try {
    if (!credentialResponse || !credentialResponse.credential) {
      throw new Error("Không tìm thấy token Google trong phản hồi");
    }
    console.log("Google token:", credentialResponse.credential);
    const response = await axios.post(`${API_URL}/users/google-auth`, {
      token: credentialResponse.credential
    });
    const { user_id, username, email, name, role } = response.data;

    localStorage.setItem("user_id", user_id); 
      fetchUserInfo(user_id);
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    const errorMessage = error.response?.data?.message || "Đăng nhập Google thất bại!";
    setErrors({ general: errorMessage });
  }
};

  return (
    <div className="cinema-auth-bg">
      <Container className="h-100">
        <Row className="justify-content-center flex-column align-items-center h-100">
          <Col
            xs={11}
            sm={10}
            md={8}
            lg={6}
            className="d-inline text-center mb-5"
          >
            <img
              src="logo-removebg-preview.png"
              width={100}
              height={50}
              style={{ objectFit: "cover" }}
              alt="logo"
            />
          </Col>

          <Col xs={11} sm={10} md={8} lg={6}>
            <div className="auth-card animate-fade-in">
              <div className="auth-header">
                <h2 className="auth-title animate-title">
                  {isLogin ? "Welcome Back!" : "Welcome New Guest!"}
                </h2>
                <p className="auth-subtitle">
                  {isLogin ? "Sign in to continue" : "Register now, it’s free!"}
                </p>
              </div>

              <div className="auth-form">
                <Form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <Form.Group className="mb-3 animate-slide-in">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email} 
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
                      isInvalid={!!errors.username} 
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
                      autoComplete="off"
                    />
                  </Form.Group>

                  {errors.general && (
                    <p className="text-danger text-center">{errors.general}</p>
                  )}

                  <Button
                    type="submit"
                    variant="danger"
                    className="w-100 auth-button animate-button"
                  >
                    {isLogin ? "Login" : "Get Started"}
                  </Button>

                  <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1 border-top"></div>
                    <span
                      style={{color: '#fff', margin: '0 10px', width: 'fit-content' }}
                    >
                      hoặc
                    </span>
                    <div className="flex-grow-1 border-top"></div>
                  </div>
                  <GoogleLogin
                    onSuccess={handleLoginWithGoogle}
                    onError={() => {
                      console.error("Google OAuth error");
                      setErrors({ general: "Lỗi xác thực Google! Vui lòng thử lại." });
                    }}
                    text="signin_with"
                    width="100%"
                  />
                </Form>

                <div className="text-center mt-3">
                  <p className="auth-switch-text">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <span
                      className="switch-text animate-switch"
                      onClick={handleSwitch}
                    >
                      {isLogin ? "Register" : "Login"}
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
