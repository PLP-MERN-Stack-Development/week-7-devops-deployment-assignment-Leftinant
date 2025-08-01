import { useState } from "react";
import Toast from "./Toast";

let toastId = 0;

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  window.showToast = addToast;

  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2'>
      {toasts.map(({ id, message, type }) => (
        <Toast
          key={id}
          message={message}
          type={type}
          onClose={() => removeToast(id)}
        />
      ))}
    </div>
  );
};
