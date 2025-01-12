"use client";
import * as React from "react";
import Navbar from "@/components/Nav";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Snackbar,
  SnackbarCloseReason,
  SnackbarOrigin,
  TextField,
} from "@mui/material";
import Button from "@/components/Button";
import {
  SignupFormData,
  SignupValidationErrors,
  UserType,
} from "@/@types/global";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { validateEmail, validatePassword } from "@/utils/validation";
import { handleToken } from "@/utils/auth";

const env = process.env.NEXT_PUBLIC_TRENDAI_API


export interface State extends SnackbarOrigin {
  open: boolean;
}

const userTypes = [
  {
    value: "influencer",
    label: "Influencer",
  },
  {
    value: "brand",
    label: "Brand",
  },
];

const handleMouseDownPassword = (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
};

const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};
const RegisterPage = () => {

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [message, setmessage] = React.useState("");

  const { open, vertical, horizontal } = state;

  const [formData, setFormData] = React.useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "" as UserType,
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const [errors, setErrors] = React.useState<SignupValidationErrors>({});

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors: SignupValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.type) {
      newErrors.type = "Please select a user type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setState({ ...state, open: false });
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleSubmit = async () => {
    if (validateForm()) {
      const register_api = `${env}/auth/signup`;

      const response = await fetch(register_api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setState({ ...state, open: true });
        setmessage(data.message);
      } else {
        handleClearForm();
        await handleToken("register", data.token);
        if (data.type.toLowerCase() === "brand") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/dashboard/influencer";
        }
      }
    } else {
      console.log("Form has errors", errors);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      type: "" as UserType,
    });
    setErrors({});
  };

  return (
    <div>
      <Navbar isDashboard={false} />

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
        key={vertical + horizontal}
      />

      <form
        noValidate
        autoComplete="off"
        className="flex flex-col gap-4 p-4 max-w-[500px] mx-auto"
      >
        <header className="text-center font-semibold text-xl">Signup</header>
        <TextField
          helperText={errors.name || ""}
          error={!!errors.name}
          label="Name"
          variant="outlined"
          type="text"
          name="name"
          value={formData.name}
          required
          onChange={handleChange}
        />
        <TextField
          helperText={errors.email || ""}
          error={!!errors.email}
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          helperText={errors.type || ""}
          error={!!errors.type}
          label="User Type"
          variant="outlined"
          select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          {userTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <FormControl variant="outlined" error={!!errors.password}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            label="Password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <small className="text-[#d3302f]">{errors.password}</small>
        </FormControl>

        <FormControl variant="outlined" error={!!errors.confirmPassword}>
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <OutlinedInput
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            required
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <small className="text-[#d3302f]">{errors.confirmPassword}</small>
        </FormControl>

        <Button
          text="Signup"
          type="button"
          className="bg-[#89e81d] rounded-md p-2 h-12"
          onClick={handleSubmit}
        />
        <Button
          text="Clear"
          type="button"
          className="bg-white border  rounded-md p-2 h-12"
          onClick={handleClearForm}
        />
      </form>
    </div>
  );
};

export default RegisterPage;
