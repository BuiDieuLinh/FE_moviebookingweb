import React, { useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import axios from "axios";
import { Table, Button, Modal, Form, Dropdown, Row, Col } from "react-bootstrap";
import "./moviemanagement.css";

const API_URL = `${process.env.REACT_APP_PORT || "http://localhost:5000"}/movies`; // Đảm bảo có fallback URL

const MovieManagement = () => {
  const { showToast } = useToast();
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectStatus, setSelectStatus] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    director: "",
    duration: "",
    release_date: "",
    description: "",
    poster_url: null, // Chỉ lưu đường dẫn từ server, không lưu trực tiếp file
    created_at: "",
    cast: "",
    age_restriction: "",
    trailer_url: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      setMovies(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phim:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, poster_url: file }); // Lưu file tạm thời để gửi lên server
      setImagePreview(URL.createObjectURL(file)); // Xem trước ảnh
    }
  };

  const handleShowModal = (movie = null) => {
    setSelectedMovie(movie);
    if (movie) {
      setFormData({
        title: movie.title || "",
        genre: movie.genre || "",
        director: movie.director || "",
        duration: movie.duration || "",
        release_date: movie.release_date || "",
        description: movie.description || "",
        poster_url: movie.poster_url || "", // Đường dẫn từ server
        created_at: movie.created_at || "",
        cast: movie.cast || "",
        age_restriction: movie.age_restriction || "",
        trailer_url: movie.trailer_url || "",
      });
      setImagePreview(movie.poster_url ? `${process.env.REACT_APP_PORT || "http://localhost:5000"}/${movie.poster_url}` : null);
    } else {
      setFormData({
        title: "",
        genre: "",
        director: "",
        duration: "",
        release_date: "",
        description: "",
        poster_url: null,
        created_at: "",
        cast: "",
        age_restriction: "",
        trailer_url: "",
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveMovie = async () => {
    try {
      if (!formData.title || !formData.genre || !formData.director || !formData.duration || !formData.release_date) {
        showToast("Cảnh báo", "Vui lòng nhập đầy đủ thông tin bắt buộc!");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("director", formData.director);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("release_date", formData.release_date.split("T")[0]);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("cast", formData.cast);
      formDataToSend.append("age_restriction", formData.age_restriction);
      formDataToSend.append("trailer_url", formData.trailer_url);

      if (formData.poster_url instanceof File) {
        formDataToSend.append("poster", formData.poster_url); // Gửi file lên server
      } else if (typeof formData.poster_url === "string" && selectedMovie) {
        formDataToSend.append("poster_url", formData.poster_url); // Gửi đường dẫn cũ khi chỉnh sửa
      }

      console.log(formDataToSend)
      let response;
      if (selectedMovie) {
        response = await axios.put(`${API_URL}/${selectedMovie.movie_id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          showToast("Phim", "Cập nhật phim thành công!");
        }
      } else {
        formDataToSend.append("created_at", new Date().toISOString().slice(0, 19).replace("T", " "));
        response = await axios.post(API_URL, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 201) {
          showToast("Phim", "Thêm phim thành công!");
        }
      }

      fetchMovies();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu phim:", error.response?.data || error.message);
      showToast("Lỗi", "Lưu phim thất bại!");
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
    }
  };
  // lọc trạng thái
  const currentMovies = movies.filter((mv) => {
    const isNowShowing = new Date(mv.release_date) <= new Date();
    const status = isNowShowing ? "Đang chiếu" : "Sắp chiếu";

    return selectStatus ? status === selectStatus : true; // Nếu có searchStatus, lọc theo trạng thái
  })

  return (
    <div className="container-moviemng">
      <div className="p-0">
        <div className="w-full d-flex justify-content-between align-items-center gap-2 p-2 mb-2 rounded-2 border-b-2">
          <div>
            <p className="m-0">
              Total: <span className="rounded-1 p-1" style={{ backgroundColor: "rgba(168, 0, 0, 0.5)" }}>{movies.length} movies</span>
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form className="d-flex gap-3">
              <Form.Check 
                type="radio"
                id="status-playing"
                label="Đang chiếu"
                name="screening-status"
                value="Đang chiếu"
                checked={selectStatus === "Đang chiếu"}
                onChange={(e) => setSelectStatus(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="status-upcoming"
                label="Sắp chiếu"
                name="screening-status"
                value="Sắp chiếu"
                checked={selectStatus === "Sắp chiếu"}
                onChange={(e) => setSelectStatus(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setSelectStatus("")}
              >
                <i class="fas fa-undo-alt"></i>
              </Button>
            </Form>
            <Button style={{ backgroundColor: "#A9141E", border: "none" }} size="sm" onClick={() => handleShowModal()}>
              <i className="fas fa-plus"></i> Thêm Phim
            </Button>
          </div>
        </div>

        <div className="table-responsive rounded-2">
          <Table className="table-movie" hover>
            <thead>
              <tr className="p-4">
                <th>Tên phim</th>
                <th>Thể loại</th>
                <th>Đạo diễn</th>
                <th>Thời lượng</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentMovies.map((mv, index) => {
                const isNowShowing = new Date(mv.release_date) <= new Date();
                const status = isNowShowing ? "Đang chiếu" : "Sắp chiếu";
                const btnStatus = isNowShowing ? "nowshow" : "commingshow";

                return (
                  <tr key={mv.movie_id || index}>
                    <td className="movie-title">{mv.title}</td>
                    <td>{mv.genre}</td>
                    <td>{mv.director}</td>
                    <td className="text-center">{mv.duration}</td>
                    <td>
                      <span className={btnStatus}>{status}</span>
                    </td>
                    <td className="text-end">
                      <Button
                        style={{ border: "1px solid #A9141E", backgroundColor: "#A9141E", color: "white" }}
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(mv)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{selectedMovie ? "Chỉnh Sửa Phim" : "Thêm Phim"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="p-2">
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3" controlId="formGridTitle">
                    <Form.Label>Tên phim</Form.Label>
                    <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </Form.Group>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridGenre">
                      <Form.Label>Thể loại</Form.Label>
                      <Form.Control type="text" name="genre" value={formData.genre} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridDuration">
                      <Form.Label>Thời lượng (phút)</Form.Label>
                      <Form.Control type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridDirector">
                      <Form.Label>Đạo diễn</Form.Label>
                      <Form.Control type="text" name="director" value={formData.director} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCast">
                      <Form.Label>Cast</Form.Label>
                      <Form.Control type="text" name="cast" value={formData.cast} onChange={handleInputChange} required />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}  controlId="formGridReleaseDate">
                      <Form.Label>Ngày phát hành</Form.Label>
                      <Form.Control
                        type="date"
                        name="release_date"
                        value={formData.release_date ? new Date(formData.release_date).toISOString().split("T")[0] : ""}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formAge_restriction">
                      <Form.Label>Độ tuổi giới hạn</Form.Label>
                      <Form.Control 
                        type="text"  
                        name="age_restriction" 
                        value={formData.age_restriction} 
                        onChange={handleInputChange} 
                        required/>
                    </Form.Group>
                  </Row>
                  
                  <Form.Group className="mb-3" controlId="formGridDescription">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridTrailerUrl">
                    <Form.Label>Trailer URL</Form.Label>
                    <Form.Control type="text" name="trailer_url" value={formData.trailer_url} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={4} className="text-center">
                  <p><strong>Ảnh xem trước:</strong></p>
                  <div className="mb-3">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Poster Preview"
                        style={{
                          width: "100%",
                          maxWidth: "250px",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    ) : formData.poster_url && typeof formData.poster_url === "string" ? (
                      <img
                        src={`${process.env.REACT_APP_PORT || "http://localhost:5000"}/${formData.poster_url}`}
                        alt="Poster"
                        style={{
                          width: "100%",
                          maxWidth: "250px",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "350px",
                          border: "1px dashed #ccc",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#999",
                        }}
                      >
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Chọn ảnh poster</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
            <Button variant="success" onClick={handleSaveMovie}>Lưu</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default MovieManagement;