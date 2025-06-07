import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Snackbar,
  Alert,
  Paper,
  Box,
  Avatar,
  Tooltip,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Person as PersonIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Transgender as TransgenderIcon
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { getUsers, deleteUser } from "../services/api";

// Custom theme with enhanced typography and colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f8f9fa",
    },
  },
  typography: {
    fontFamily: "'Prompt', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: "success", message: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      // res.data ควรเป็น array
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setAlert({ open: true, type: "error", message: "Failed to fetch users" });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setAlert({ open: true, type: "success", message: "User deleted successfully!" });
      fetchUsers();
    } catch {
      setAlert({ open: true, type: "error", message: "Failed to delete user" });
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  const openDeleteDialog = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null });
  };

  const renderGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <MaleIcon color="primary" fontSize="small" />;
      case "female":
        return <FemaleIcon color="secondary" fontSize="small" />;
      default:
        return <TransgenderIcon color="action" fontSize="small" />;
    }
  };

  const renderInterests = (interests) => {
    if (!interests) return "-";
    const interestList = interests.split(",").map(i => i.trim());

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
        {interestList.map((interest, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              px: 0.5,
              color: "text.primary",
              fontSize: "0.95em",
              whiteSpace: "nowrap"
            }}
          >
            {interest}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 }, mb: 6 }}>
        <Paper
          elevation={isMobile ? 2 : 6}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: { xs: 3, md: 5 },
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)"
          }}
        >
          <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"} spacing={2} sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 } }}>
                <PersonIcon fontSize={isMobile ? "medium" : "large"} />
              </Avatar>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} color="primary">
                User Management
              </Typography>
            </Stack>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                fontWeight: 700,
                borderRadius: 3,
                px: 3,
                boxShadow: "0 4px 20px 0 rgba(63, 81, 181, 0.15)",
                width: isMobile ? "100%" : "auto"
              }}
            >
              {isMobile ? "Add User" : "Register New User"}
            </Button>
          </Stack>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto", borderRadius: 2 }}>
              <Table sx={{ minWidth: isMobile ? 600 : 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.lighter" }}>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Name</TableCell>
                    {!isMobile && <TableCell align="center" sx={{ fontWeight: 700 }}>Last Name</TableCell>}
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Age</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Gender</TableCell>
                    {!isTablet && <TableCell align="center" sx={{ fontWeight: 700 }}>Phone</TableCell>}
                    {!isMobile && <TableCell align="center" sx={{ fontWeight: 700 }}>Interests</TableCell>}
                    {!isMobile && <TableCell align="center" sx={{ fontWeight: 700 }}>Description</TableCell>} {/* เพิ่ม Description */}
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 5 : 7} align="center" sx={{ py: 5 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <InfoIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                          <Typography color="text.secondary">No users found</Typography>
                          <Button component={Link} to="/register" variant="text" color="primary" sx={{ mt: 2 }}>
                            Add your first user
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow
                        key={u.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "action.hover" },
                          transition: "background 0.2s"
                        }}
                      >
                        <TableCell align="center" sx={{ fontWeight: 500 }}>{u.firstname}</TableCell>
                        {!isMobile && <TableCell align="center">{u.lastname}</TableCell>}
                        <TableCell align="center">{u.age}</TableCell>
                        <TableCell align="center">{u.gender || "-"}</TableCell> {/* เปลี่ยนเป็น text */}
                        {!isTablet && (
                          <TableCell align="center">
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                              <PhoneIcon color="action" fontSize="small" />
                              <Typography variant="body2">{u.phone}</Typography>
                            </Stack>
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell align="center" sx={{ maxWidth: 200 }}>
                            {renderInterests(u.interests)}
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell align="center" sx={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            <Tooltip title={u.description || "-"} arrow>
                              <span style={{ display: "inline-block", maxWidth: 180, verticalAlign: "middle", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {u.description || "-"}
                              </span>
                            </Tooltip>
                          </TableCell>
                        )}
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                component={Link}
                                to={`/edit/${u.id}`}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                  bgcolor: "primary.lightest",
                                  "&:hover": { bgcolor: "primary.lighter" }
                                }}
                              >
                                <EditIcon fontSize={isMobile ? "small" : "medium"} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                color="error"
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                  bgcolor: "error.lightest",
                                  "&:hover": { bgcolor: "error.lighter" }
                                }}
                                onClick={() => openDeleteDialog(u.id)}
                              >
                                <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(deleteDialog.id)}
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.type}
            variant="filled"
            sx={{ width: "100%", alignItems: "center" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}