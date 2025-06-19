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
import ConfirmModal from "./ModalComfirm"; 

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
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    role: "",
    phone: "",
    created_at: "",
  });
  // State for reusable ConfirmModal
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    body: "",
    confirmText: "",
    confirmVariant: "primary",
    onConfirm: () => {},
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

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      showToast("Xóa người dùng thành công", "success");
      fetchUsers(pagination.currentPage);
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast("Không thể xóa người dùng", "error");
    }
  };

  const handleSharePermission = async (userId) => {
    try {
      await axios.patch(`${API_URL}/users/${userId}`, { role: "admin" });
      showToast("Chia sẻ quyền admin thành công", "success");
      fetchUsers(pagination.currentPage);
    } catch (error) {
      console.error("Error share permission:", error);
      showToast("Không thể chia sẻ quyền", "error");
    }
  };

  const handleRevokePermission = async (userId) => {
    try {
      await axios.patch(`${API_URL}/users/${userId}`, { role: "customer" });
      showToast("Thu hồi quyền admin thành công", "success");
      fetchUsers(pagination.currentPage);
    } catch (error) {
      console.error("Error revoke permission:", error);
      showToast("Không thể thu hồi quyền", "error");
    }
  };

  // Open ConfirmModal with specific configuration
  const openConfirmModal = (id, type) => {
    let config = {};
    if (type === "share") {
      config = {
        show: true,
        title: "Xác nhận gán quyền",
        body: "Bạn có chắc chắn muốn gán vai trò admin cho người dùng này không?",
        confirmText: "Xác nhận",
        confirmVariant: "primary",
        onConfirm: () => {
          handleSharePermission(id);
          setConfirmModal((prev) => ({ ...prev, show: false }));
        },
      };
    } else if (type === "revoke") {
      config = {
        show: true,
        title: "Xác nhận thu hồi quyền",
        body: "Bạn có chắc chắn muốn thu hồi vai trò admin của người dùng này không?",
        confirmText: "Thu hồi",
        confirmVariant: "warning",
        onConfirm: () => {
          handleRevokePermission(id);
          setConfirmModal((prev) => ({ ...prev, show: false }));
        },
      };
    } else if (type === "delete") {
      config = {
        show: true,
        title: "Xác nhận xóa",
        body: "Bạn có chắc chắn muốn xóa người dùng này không?",
        confirmText: "Xóa",
        confirmVariant: "danger",
        onConfirm: () => {
          handleDeleteUser(id);
          setConfirmModal((prev) => ({ ...prev, show: false }));
        },
      };
    }
    setConfirmModal(config);
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
                      onClick={() => openConfirmModal(user.user_id, "delete")}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    {user.role === "admin" ? (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => openConfirmModal(user.user_id, "revoke")}
                      >
                        <i className="fas fa-undo"></i>
                      </Button>
                    ) : (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openConfirmModal(user.user_id, "share")}
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

        {/* Reusable ConfirmModal */}
        <ConfirmModal
          show={confirmModal.show}
          onHide={() => setConfirmModal((prev) => ({ ...prev, show: false }))}
          title={confirmModal.title}
          body={confirmModal.body}
          confirmText={confirmModal.confirmText}
          confirmVariant={confirmModal.confirmVariant}
          onConfirm={confirmModal.onConfirm}
        />
      </div>
    </div>
  );
};

export default UserManagement;