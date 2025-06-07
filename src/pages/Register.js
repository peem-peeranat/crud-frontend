import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Avatar
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";

export default function App() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    age: "",
    gender: "",
    interests: "",
    description: "",
    phone: ""
  });
  const [alert, setAlert] = useState({ open: false, type: "success", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ถ้าเป็นช่อง phone ให้กรอกเฉพาะตัวเลขเท่านั้น
    if (name === "phone") {
      // ตรวจสอบว่าค่าที่กรอกเป็นตัวเลขเท่านั้น
      if (/^\d*$/.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };


  // ตรวจสอบข้อมูลก่อนส่ง
  const validateForm = () => {
    if (
      !form.firstname.trim() ||
      !form.lastname.trim() ||
      !form.age ||
      !form.gender ||
      !form.phone.trim()
    ) {
      setAlert({
        open: true,
        type: "error",
        message: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const dataToSend = {
        ...form,
        age: Number(form.age)
      };
      await createUser(dataToSend);
      setAlert({
        open: true,
        type: "success",
        message: "สมัครสมาชิกสำเร็จ!"
      });
      setForm({
        firstname: "",
        lastname: "",
        age: "",
        gender: "",
        interests: "",
        description: "",
        phone: ""
      });
    } catch {
      setAlert({
        open: true,
        type: "error",
        message: "เกิดข้อผิดพลาดในการสมัครสมาชิก"
      });
    }
  };

  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            px: 2,
            boxShadow: "0 2px 8px 0 rgba(25, 118, 210, 0.08)",
            bgcolor: "#fff",
            "&:hover": {
              bgcolor: "#e3f2fd"
            }
          }}
        >
          กลับหน้าหลัก
        </Button>
      </Stack>
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 5,
          bgcolor: "#f5f7fa",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 64, height: 64, mb: 1 }}>
            <PersonAddAlt1Icon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            ระบบจัดการผู้ใช้
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            ฟอร์มสมัครสมาชิก
          </Typography>
        </Stack>
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <Stack spacing={2}>
            <TextField
              label="ชื่อ (firstname)"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="นามสกุล (lastname)"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="อายุ (age)"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
              variant="outlined"
            />
            <TextField
              select
              label="เพศ (gender)"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">เลือกเพศ</MenuItem>
              <MenuItem value="ชาย">ชาย</MenuItem>
              <MenuItem value="หญิง">หญิง</MenuItem>
              <MenuItem value="lgbtqia2s+">lgbtqia2s+</MenuItem>
              <MenuItem value="ไม่ระบุ">ไม่ระบุ</MenuItem>
            </TextField>
            <TextField
              label="ความสนใจ (interests)"
              name="interests"
              value={form.interests}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="เบอร์โทร (phone)"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              type="tel"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="รายละเอียดเพิ่มเติม (description)"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 2,
                borderRadius: 3,
                fontWeight: 700,
                letterSpacing: 1,
                boxShadow: "0 4px 20px 0 rgba(25, 118, 210, 0.10)"
              }}
              fullWidth
            >
              สมัครสมาชิก
            </Button>
          </Stack>
        </Box>
      </Paper>
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
    </Container>
  );
}
