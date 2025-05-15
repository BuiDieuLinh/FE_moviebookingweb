
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarContextType = {
  show: (
    message: string,
    severity?: "success" | "error" | "info" | "warning",
    duration?: number
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [duration, setDuration] = useState(5000);

  const show = (
    msg: string,
    sev: "success" | "error" | "info" | "warning" = "success",
    dur: number = 3000
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setDuration(dur);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};