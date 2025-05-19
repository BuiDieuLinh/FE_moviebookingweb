import React, { useEffect, useState } from 'react';
import { useToast } from './ToastContext';
import axios from 'axios';
import { Table, Button, Modal, Form, Accordion, Pagination } from 'react-bootstrap';
import { format, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import vi from 'date-fns/locale/vi';
import './showtimes.css';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_PORT;
const TIME_ZONE = 'Asia/Ho_Chi_Minh';

export const Showtime = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showtime, setShowtime] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [selectedST, setSelectedST] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formDataShowtime, setFormDataShowtime] = useState({
    movie_id: '',
    start_time: '',
    end_time: '',
  });
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    fetchShowtime(pagination.currentPage, pagination.limit, searchStatus);
    fetchMovies();
  }, [searchStatus]);

  const fetchShowtime = async (page = 1, limit = 10, status = '') => {
    try {
      const response = await axios.get(
        `${API_URL}/showtimes?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`
      );
      setShowtime(response.data.data);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        limit: response.data.pagination.limit,
        totalRecords: response.data.pagination.totalRecords,
        totalPages: response.data.pagination.totalPages,
      });
      console.log('Showtime data:', response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch chiếu:', error);
      setShowtime([]);
      setPagination({ currentPage: 1, limit: 10, totalRecords: 0, totalPages: 1 });
      showToast('Lỗi', 'Không thể tải danh sách lịch chiếu!');
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies`);
      const data = Array.isArray(response.data) ? response.data : [];
      setMovies(data);
      console.log('Movies data:', data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim:', error);
      setMovies([]);
      showToast('Lỗi', 'Không thể tải danh sách phim!');
    }
  };

  const handleShowModal = (showtime = null) => {
    setSelectedST(showtime);
    setFormDataShowtime(
      showtime
        ? {
            movie_id: showtime.movie_id || '',
            start_time: showtime.start_time
              ? format(toZonedTime(new Date(showtime.start_time), TIME_ZONE), 'yyyy-MM-dd')
              : '',
            end_time: showtime.end_time
              ? format(toZonedTime(new Date(showtime.end_time), TIME_ZONE), 'yyyy-MM-dd')
              : '',
          }
        : { movie_id: '', start_time: '', end_time: '' },
    );
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    setFormDataShowtime({ ...formDataShowtime, [e.target.name]: e.target.value });
  };

  const handleSaveShowTime = async () => {
    try {
      if (!formDataShowtime.movie_id || !formDataShowtime.start_time || !formDataShowtime.end_time) {
        showToast('Cảnh báo', 'Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      const formattedData = {
        ...formDataShowtime,
        start_time: format(new Date(formDataShowtime.start_time), 'yyyy-MM-dd'),
        end_time: format(new Date(formDataShowtime.end_time), 'yyyy-MM-dd'),
      };

      const response = selectedST
        ? await axios.put(`${API_URL}/showtimes/${selectedST.showtime_id}`, formattedData)
        : await axios.post(`${API_URL}/showtimes`, formattedData);

      showToast('Lịch chiếu', selectedST ? 'Cập nhật lịch chiếu thành công!' : 'Thêm lịch chiếu thành công!');
      fetchShowtime(pagination.currentPage, pagination.limit, searchStatus);
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi lưu lịch chiếu:', error);
      showToast('Lỗi', 'Lưu lịch chiếu thất bại!');
    }
  };

  const formatDate = (dateString) => {
    return format(toZonedTime(new Date(dateString), TIME_ZONE), 'dd/MM/yyyy', { locale: vi });
  };

  const getStatusInfo = (startDate, endDate) => {
    const today = toZonedTime(new Date(), TIME_ZONE);
    const parsedStartDate = toZonedTime(parse(startDate, 'yyyy-MM-dd', new Date()), TIME_ZONE);
    const parsedEndDate = toZonedTime(parse(endDate, 'yyyy-MM-dd', new Date()), TIME_ZONE);

    if (parsedEndDate < today) {
      return { label: 'Hoàn thành', class: 'completed' };
    } else if (parsedStartDate > today) {
      return { label: 'Sắp chiếu', class: 'commingshow' };
    } else {
      return { label: 'Đang chiếu', class: 'nowshowing' };
    }
  };

  const handlePageChange = (page) => {
    fetchShowtime(page, pagination.limit, searchStatus);
  };

  return (
    <Accordion.Item eventKey="0" className="mb-2">
      <Accordion.Header>Lịch chiếu</Accordion.Header>
      <Accordion.Body>
        <div className="d-flex justify-content-between mb-3">
          <Button variant="danger" size="sm" onClick={() => handleShowModal(null)}>
            <i className="fas fa-plus"></i> Tạo lịch chiếu
          </Button>
          <Form className="d-flex gap-3">
            <Form.Check
              type="radio"
              id="status-finished"
              label="Hoàn thành"
              name="screening-status"
              value="Hoàn thành"
              checked={searchStatus === 'Hoàn thành'}
              onChange={(e) => setSearchStatus(e.target.value)}
            />
            <Form.Check
              type="radio"
              id="status-playing"
              label="Đang chiếu"
              name="screening-status"
              value="Đang chiếu"
              checked={searchStatus === 'Đang chiếu'}
              onChange={(e) => setSearchStatus(e.target.value)}
            />
            <Form.Check
              type="radio"
              id="status-upcoming"
              label="Sắp chiếu"
              name="screening-status"
              value="Sắp chiếu"
              checked={searchStatus === 'Sắp chiếu'}
              onChange={(e) => setSearchStatus(e.target.value)}
            />
            <Button variant="outline-secondary" size="sm" onClick={() => setSearchStatus('')}>
              <i className="fas fa-undo-alt"></i>
            </Button>
          </Form>
        </div>

        <div className="table-responsive rounded-2">
          <Table hover>
            <thead>
              <tr>
                <th>Phim chiếu</th>
                <th>Thời gian chiếu</th>
                <th>Phân loại</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {showtime.length > 0 ? (
                showtime.map((st) => {
                  const { label: status, class: statusStyle } = getStatusInfo(st.start_time, st.end_time);
                  const movie = movies.find((m) => m.movie_id === st.movie_id) || { title: 'Không xác định' };

                  return (
                    <tr key={st.showtime_id}>
                      <td onClick={() => navigate(`/showtimes/${st.showtime_id}`)}>{movie.title}</td>
                      <td>
                        {formatDate(st.start_time)} - {formatDate(st.end_time)}
                      </td>
                      <td>
                        <span className={statusStyle}>{status}</span>
                      </td>
                      <td className="text-end">
                        <Button
                          style={{ border: '1px solid #A9141E', backgroundColor: '#A9141E', color: 'white' }}
                          size="sm"
                          onClick={() => handleShowModal(st)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>Không có lịch chiếu</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Phân trang */}
        <Pagination className="justify-content-center mt-3">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={pagination.currentPage === 1} />
          <Pagination.Prev
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          />
          {[...Array(pagination.totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === pagination.currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
          />
        </Pagination>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedST ? 'Chỉnh Sửa Lịch Chiếu' : 'Thêm Lịch Chiếu'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Phim chiếu</Form.Label>
                <Form.Select name="movie_id" value={formDataShowtime.movie_id} onChange={handleInputChange}>
                  <option value="">Chọn phim</option>
                  {movies.map((movie) => (
                    <option key={movie.movie_id} value={movie.movie_id}>
                      {movie.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="date"
                  name="start_time"
                  value={formDataShowtime.start_time}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control
                  type="date"
                  name="end_time"
                  value={formDataShowtime.end_time}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSaveShowTime}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Showtime;