import { useState } from "react";
import axios from "axios";
import { Stack, TextField, MenuItem, Button } from "@mui/material";

export default function UserForm({ setAlert }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    age: "",
    gender: "",
    interests: "",
    description: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

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
      const dataToSend = { ...form, age: Number(form.age) };
      await axios.post("http://localhost:8000/users", dataToSend);
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

  return (
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
    </form>
  );
}