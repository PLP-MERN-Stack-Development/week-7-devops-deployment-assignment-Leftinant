import { useEffect, useState } from "react";

const Toast = ({ message, type = "info", onClose }) => {
  const [visible, setVisible] = useState(false);

  const safeType = ["success", "error", "warning", "info"].includes(type)
    ? type
    : "info";

  useEffect(() => {
    setVisible(true);

    const hideTimeout = setTimeout(() => {
      setVisible(false);

      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(hideTimeout);
  }, []);

  return (
    <div
      className={`alert alert-${safeType} shadow-lg transition-all duration-300 ease-in-out 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      <span>{message}</span>
    </div>
  );
};

export default Toast;
