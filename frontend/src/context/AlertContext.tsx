import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AlertType = "success" | "danger" | "warning" | "info";

type Alert = {
  type: AlertType;
  message: string;
};

type AlertContextType = {
  alert: Alert | null;
  showAlert: (type: AlertType, message: string) => void;
  clearAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ type, message });
  };

  const clearAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};