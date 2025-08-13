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
import { useTranslation } from "react-i18next";

export default function ProfileMenu() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const user = session?.user;

  return (
    <>
      <Tooltip title={user?.name ?? t("profileMenu.tooltip_profile")}>
        <IconButton
          onClick={handleOpen}
          size="large"
          color="inherit"
          aria-label={t("profileMenu.aria_open_menu")}
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {user?.image ? (
            <Avatar
              src={user.image}
              alt={user.name ?? t("profileMenu.tooltip_profile")}
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
          <ListItemText primary={t("profileMenu.my_account")} />
        </MenuItem>

        {/* Criar Conta */}
        <MenuItem component={Link} href="/login/criar-conta">
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.create_account")} />
        </MenuItem>

        {/* Minhas Turmas */}
        <MenuItem component={Link} href="/login/minhas-turmas">
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.my_classes")} />
        </MenuItem>

        {/* Meus Alunos */}
        <MenuItem component={Link} href="/login/meus-alunos">
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.my_students")} />
        </MenuItem>

        {/* Notas e Avaliações */}
        <MenuItem component={Link} href="/login/notas-avaliacoes">
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.grades_assessments")} />
        </MenuItem>

        <Divider />

        {status === "authenticated" ? (
          <MenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("profileMenu.sign_out")} />
          </MenuItem>
        ) : (
          <MenuItem component={Link} href="/login">
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("profileMenu.sign_in")} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
