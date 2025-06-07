import { Snackbar, Alert } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

export default function CustomAlert({ alert, setAlert }) {
  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3500}
      onClose={handleCloseAlert}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleCloseAlert}
        severity={alert.type}
        variant="filled"
        iconMapping={{
          success: <PersonAddAlt1Icon fontSize="inherit" />,
          error: <span style={{ fontWeight: 900, fontSize: 22 }}>!</span>
        }}
        sx={{
          width: "100%",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 0.5,
          borderRadius: 2,
          boxShadow: "0 2px 12px 0 rgba(25, 118, 210, 0.18)",
          background: alert.type === "success"
            ? "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"
            : "linear-gradient(90deg, #ff5858 0%, #f09819 100%)",
          color: "#fff",
          alignItems: "center"
        }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
}