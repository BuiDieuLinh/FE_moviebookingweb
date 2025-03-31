import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
// import "./usermanagement.css";

const API_URL = "http://localhost:5000/users"; // Đổi URL này thành API backend của bạn

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  const handleShowModal = (user = null) => {
    setSelectedUser(user);
    setFormData(user || { username: "",fullname: "", email: "", role: "", phone: "" , created_at: ""});
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        await axios.put(`${API_URL}/${selectedUser.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
    }
  };

  return (
    <div style={{ marginTop: "70px" }}>
      <div className="container p-0">
        <div className="d-flex justify-content-between align-items-center p-2 mb-2 bg-white rounded-2">
          <p className="m-0">
            Total: <span className="badge bg-danger">{users.length} users</span>
          </p>
          <Button variant="danger" size="sm" onClick={() => handleShowModal()}>
            <i className="fas fa-plus"></i> Thêm User
          </Button>
        </div>

        <div className="table-responsive rounded-2">
          <Table hover>
            <thead>
              <tr>
                <th></th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Điện thoại</th>
                <th>Ngày đăng ký</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phone}</td>
                  <td>{new Date(user.created_at).toISOString().split("T")[0]}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(user)}>
                      <i className="fas fa-edit"></i> Xem
                    </Button>
                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDeleteUser(user.id)}>
                      <i className="fas fa-trash"></i> Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? "Chỉnh Sửa User" : "Thêm User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Tên đầy đủ (nếu có)</Form.Label>
                  <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleInputChange} required />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Control type="text" name="role" value={formData.role} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Điện thoại</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
            <Button variant="success" onClick={handleSaveUser}>Lưu</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;
