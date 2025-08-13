"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LoginIcon from "@mui/icons-material/Login";

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const user = session?.user;

  return (
    <>
      <Tooltip title={user?.name ?? "Perfil"}>
        <IconButton
          onClick={handleOpen}
          size="large"
          color="inherit"
          aria-label="Abrir menu do usuário"
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {user?.image ? (
            <Avatar
              src={user.image}
              alt={user.name ?? "Usuário"}
              sx={{ width: 32, height: 32 }}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
          ) : (
            <AccountCircleIcon />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Minha Conta */}
        <MenuItem component={Link} href="/login/minha-conta">
          <ListItemIcon>
            {user?.image ? (
              <Avatar src={user.image} sx={{ width: 24, height: 24 }} />
            ) : (
              <AccountCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText primary="Minha Conta" />
        </MenuItem>

        {/* Criar Conta */}
        <MenuItem component={Link} href="/login/criar-conta">
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Criar Conta" />
        </MenuItem>

        {/* Minhas Turmas */}
        <MenuItem component={Link} href="/login/minhas-turmas">
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Minhas Turmas" />
        </MenuItem>

        {/* Meus Alunos */}
        <MenuItem component={Link} href="/login/meus-alunos">
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Meus Alunos" />
        </MenuItem>

        <Divider />

        {status === "authenticated" ? (
          <MenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </MenuItem>
        ) : (
         
          <MenuItem component={Link} href="/login">
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Entrar" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
