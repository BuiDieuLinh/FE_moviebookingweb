import { createContext, useContext, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Hàm hiển thị Toast từ component khác
  const showToast = ( message, backgroundColor) => {
    const newToast = { id: Date.now(), message, backgroundColor };
    setToasts([...toasts, newToast]);

    // Xóa toast sau 3 giây
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== newToast.id));
    }, 3000);
  };
  // Hàm đóng Toast thủ công
  const closeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Hiển thị danh sách Toast */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} bg={toast.backgroundColor}>
            <Toast.Body className="text-light d-flex justify-content-between align-items-center">
              <span>{toast.message}</span>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={() => closeToast(toast.id)}
              ></button>
            </Toast.Body>
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
