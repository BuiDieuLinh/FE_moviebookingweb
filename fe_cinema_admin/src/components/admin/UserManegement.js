import React, { useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Pagination,
  Badge,
} from "react-bootstrap";

const API_URL = process.env.REACT_APP_PORT;

const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showRevokeConfirmModal, setShowRevokeConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    role: "",
    phone: "",
    created_at: "",
  });

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_URL}/users?page=${page}&limit=${pagination.limit}`
      );
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Không thể tải danh sách người dùng", "error");
    }
  };

  const handleShowModal = (user = null) => {
    setSelectedUser(user);
    setFormData(
      user || {
        username: "",
        fullname: "",
        email: "",
        role: "",
        phone: "",
        created_at: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async () => {
    if (!formData.username || !formData.email || !formData.role) {
      showToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      const { created_at, ...updateData } = formData;
      if (selectedUser) {
        await axios.put(`${API_URL}/users/${selectedUser.user_id}`, updateData);
        showToast("Cập nhật người dùng thành công", "success");
      } 
      fetchUsers(pagination.currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error.response || error);
      showToast("Không thể lưu người dùng", "error");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${API_URL}/users/${actionUserId}`);
      showToast("Xóa người dùng thành công", "success");
      fetchUsers(pagination.currentPage);
      setShowDeleteConfirmModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Không thể xóa người dùng", "error");
    }
  };

  const handleSharePermission = async () => {
    try {
      await axios.patch(`${API_URL}/users/${actionUserId}`, { role: "admin" });
      showToast("Chia sẻ quyền admin thành công", "success");
      fetchUsers(pagination.currentPage);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error share permission:", error);
      showToast("Không thể chia sẻ quyền", "error");
    }
  };

  const handleRevokePermission = async () => {
    try {
      await axios.patch(`${API_URL}/users/${actionUserId}`, { role: "customer" });
      showToast("Thu hồi quyền admin thành công", "success");
      fetchUsers(pagination.currentPage);
      setShowRevokeConfirmModal(false);
    } catch (error) {
      console.error("Error revoke permission:", error);
      showToast("Không thể thu hồi quyền", "error");
    }
  };

  const openConfirmModal = (id) => {
    setActionUserId(id);
    setShowConfirmModal(true);
  };

  const openDeleteConfirmModal = (id) => {
    setActionUserId(id);
    setShowDeleteConfirmModal(true);
  };

  const openRevokeConfirmModal = (id) => {
    setActionUserId(id);
    setShowRevokeConfirmModal(true);
  };

  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
    }
  };

  return (
    <div style={{ marginTop: "70px" }}>
      <div className="p-0">
        <div className="table-responsive rounded-2">
          <Table hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.user_id}>
                  <td>
                    {(pagination.currentPage - 1) * pagination.limit + index + 1}
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge pill bg={user.role === "admin" ? "success" : "primary"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>{user.phone || "N/A"}</td>
                  <td>{new Date(user.created_at).toISOString().split("T")[0]}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => openDeleteConfirmModal(user.user_id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    {user.role === "admin" ? (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => openRevokeConfirmModal(user.user_id)}
                      >
                        <i className="fas fa-undo"></i>
                      </Button>
                    ) : (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openConfirmModal(user.user_id)}
                      >
                        <i className="fas fa-share"></i>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => paginate(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          />
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === pagination.currentPage}
              onClick={() => paginate(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          />
        </Pagination>

        {/* Modal for Add/Edit User */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={formData.fullname || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
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
                  <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="success" onClick={handleSaveUser}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Confirm Share Permission */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận gán quyền</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn gán vai trò admin cho người dùng này không?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSharePermission}>
              Xác nhận
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Confirm Revoke Permission */}
        <Modal
          show={showRevokeConfirmModal}
          onHide={() => setShowRevokeConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận thu hồi quyền</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn thu hồi vai trò admin của người dùng này không?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRevokeConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button variant="warning" onClick={handleRevokePermission}>
              Thu hồi
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Confirm Delete */}
        <Modal
          show={showDeleteConfirmModal}
          onHide={() => setShowDeleteConfirmModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa người dùng này không?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;