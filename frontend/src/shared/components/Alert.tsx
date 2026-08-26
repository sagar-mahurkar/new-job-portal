import { useAlert } from "@/context/AlertContext";

export const Alert = () => {
  const { alert, clearAlert } = useAlert();

  if (!alert) return null;

  return (
    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
      {alert.message}
      <button
        type="button"
        className="btn-close"
        onClick={clearAlert}
      ></button>
    </div>
  );
};