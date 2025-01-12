"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "next/link";
import { NavProps } from "@/@types/global";
import { Chip } from "@mui/material";
import { handleToken } from "@/utils/auth";

const pages = ["Register", "Login"];

const Navbar: React.FC<NavProps> = ({ isDashboard, names, type }) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = async () => {
    await handleToken("logout", "ok");
    window.location.href = "/";
  };

  return (
    <AppBar position="static" className="!bg-black">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            Trendai app
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {!isDashboard ? (
                pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Link href={`/${page.toLowerCase()}`}>
                      <Typography
                        sx={{ textAlign: "center", textDecoration: "none" }}
                      >
                        {page}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))
              ) : (
                <div>
                  <MenuItem key={names} onClick={handleCloseNavMenu}>
                    <Typography
                      sx={{ textAlign: "center", textDecoration: "none" }}
                    >
                      {names}
                    </Typography>
                  </MenuItem>
                  <MenuItem key={"logout"} onClick={handleCloseNavMenu}>
                    <Typography
                      onClick={handleLogout}
                      sx={{ textAlign: "center", textDecoration: "none" }}
                    >
                      {"Logout"}
                    </Typography>
                  </MenuItem>
                </div>
              )}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            Trendai app
          </Typography>

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className="flex justify-end"
          >
            {!isDashboard ? (
              pages.map((page) => (
                <Button
                  key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <Link href={`/${page.toLowerCase()}`}>
                    <Typography
                      sx={{ textAlign: "center", textTransform: "capitalize" }}
                      className="hover:underline"
                    >
                      {page}
                    </Typography>
                  </Link>
                </Button>
              ))
            ) : (
              <div className="flex items-center">
                <Chip label={type} color="success" />

                <Button
                  key={names}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textDecoration: "none",
                  }}
                >
                  <Typography
                    sx={{ textAlign: "center", textTransform: "capitalize" }}
                  >
                    {names}
                  </Typography>
                </Button>

                <Button
                  key={"logout1"}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textDecoration: "none",
                  }}
                  variant="outlined"
                  color="success"
                >
                  <Typography
                    onClick={handleLogout}
                    sx={{ textAlign: "center", textTransform: "capitalize" }}
                  >
                    {"Logout"}
                  </Typography>
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
