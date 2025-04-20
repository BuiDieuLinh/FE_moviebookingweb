import React, { useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import { Table, Button, Modal, Form, Row, Col, Pagination } from "react-bootstrap";

const API_URL = process.env.REACT_APP_PORT; // Đổi URL này thành API backend của bạn

const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    role: "",
    phone: "",
    created_at: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8); // Số user hiển thị trên mỗi trang

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  const handleShowModal = (user = null) => {
    setSelectedUser(user);
    setFormData(user || { username: "", fullname: "", email: "", role: "", phone: "", created_at: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async () => {
    try {
      console.log("Dữ liệu gửi đi:", formData);
      const { created_at, ...updateData } = formData; // Loại bỏ created_at
      if (selectedUser) {
        await axios.put(`${API_URL}/users/${selectedUser.user_id}`, updateData);
        showToast('Cập nhật', "Cập nhật người dùng thành công")
      } 
      setCurrentPage(1); // Đặt lại về trang đầu tiên
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu user:", error.response);
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

  // Tính toán các user hiển thị trên trang hiện tại
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Tính tổng số trang
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Tạo danh sách các số trang
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ marginTop: "70px" }}>
      <div className="p-0">
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.phone}</td>
                  <td>{new Date(user.created_at).toISOString().split("T")[0]}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(user)}>
                      <i className="fas fa-edit"></i> Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Phân trang */}
        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => paginate(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </Pagination>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? "Chỉnh Sửa User" : "Thêm User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Tên đầy đủ (nếu có)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
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