import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsersbyID, updateUser } from "../services/api";
import {
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Avatar,
  CircularProgress
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    age: "",
    gender: "",
    phone: "",
    interests: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: "success", message: "" });

  useEffect(() => {
    getUsersbyID(id)
      .then((res) => {
        setForm({
          firstname: res.data.firstname || "",
          lastname: res.data.lastname || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
          phone: res.data.phone || "",
          interests: res.data.interests || "",
          description: res.data.description || ""
        });
        setLoading(false);
      })
      .catch(() => {
        setAlert({ open: true, type: "error", message: "ไม่พบข้อมูลผู้ใช้" });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "age") {
      if (/^\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, { ...form, age: Number(form.age) });
      setAlert({ open: true, type: "success", message: "แก้ไขข้อมูลสำเร็จ!" });
      setTimeout(() => navigate("/"), 1200);
    } catch {
      setAlert({ open: true, type: "error", message: "เกิดข้อผิดพลาดในการแก้ไข" });
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

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
            แก้ไขข้อมูลผู้ใช้
          </Typography>
        </Stack>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off">
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
                label="ความสนใจ (interests)"
                name="interests"
                value={form.interests}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="รายละเอียด (description)"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
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
                บันทึก
              </Button>
            </Stack>
          </form>
        )}
      </Paper>
      <Snackbar open={alert.open} autoHideDuration={2000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.type} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}