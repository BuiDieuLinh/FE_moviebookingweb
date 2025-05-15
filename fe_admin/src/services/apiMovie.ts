import axios from "axios";

// Định nghĩa API_URL, có thể lấy từ .env
const API_URL = process.env.REACT_APP_PORT;

// Định nghĩa kiểu Movie dựa trên response từ backend
interface Movie {
  movie_id: string;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
}

// Lấy danh sách tất cả phim
export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    throw error;
  }
};

// Lấy phim theo ID
export const fetchMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await axios.get(`${API_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy phim với ID ${id}:`, error);
    throw error;
  }
};

// Tạo phim mới
export const createMovie = async (movie: Omit<Movie, "id">): Promise<Movie> => {
  try {
    const response = await axios.post(`${API_URL}/movies`, movie);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo phim:", error);
    throw error;
  }
};

// Cập nhật phim
export const updateMovie = async (id: string, movie: Partial<Movie>): Promise<Movie> => {
  try {
    const response = await axios.put(`${API_URL}/movies/${id}`, movie);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật phim với ID ${id}:`, error);
    throw error;
  }
};

// Xóa phim
export const deleteMovie = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/movies/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa phim với ID ${id}:`, error);
    throw error;
  }
};