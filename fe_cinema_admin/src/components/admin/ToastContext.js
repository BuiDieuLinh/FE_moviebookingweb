import { createContext, useContext, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Hàm hiển thị Toast từ component khác
  const showToast = (title, message) => {
    const newToast = { id: Date.now(), title, message };
    setToasts([...toasts, newToast]);

    // Xóa toast sau 3 giây
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== newToast.id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Hiển thị danh sách Toast */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} bg="success">
            <Toast.Header>
              <strong className="me-auto">{toast.title}</strong>
              <small className="text-muted">Vừa xong</small>
            </Toast.Header>
            <Toast.Body className="text-light">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

// Hook để gọi showToast() từ component khác
export function useToast() {
  return useContext(ToastContext);
}
// export default useToast;
