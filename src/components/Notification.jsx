function Notification({ message, onClose }) {
  return (
    <div className="notification-bar">
      <span>
        <i className="bi bi-check-circle-fill me-2"></i>
        {message}
      </span>

      <button
        onClick={onClose}
        className="notification-close"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;