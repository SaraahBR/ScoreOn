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
  const avatarSrc = typeof user?.image === "string" && user.image ? user.image : null;

  const ariaLabel =
    status === "loading"
      ? t("profileMenu.loading_profile", "Carregando perfil...")
      : user?.name
      ? t("profileMenu.aria_user_profile", { defaultValue: "Perfil de {{name}}", name: user.name })
      : t("profileMenu.tooltip_profile", "Perfil");

  return (
    <>
      <Tooltip title={user?.name ?? t("profileMenu.tooltip_profile", "Perfil")}>
        <IconButton
          onClick={handleOpen}
          size="large"
          color="inherit"
          aria-label={ariaLabel}
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disabled={status === "loading"}
        >
          {avatarSrc ? (
            <Avatar
              src={avatarSrc}
              alt={user?.name ?? t("profileMenu.tooltip_profile", "Usuário")}
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
        keepMounted
      >
        {/* Minha Conta */}
        <MenuItem component={Link} href="/login/minha-conta" prefetch={false}>
          <ListItemIcon>
            {avatarSrc ? (
              <Avatar
                src={avatarSrc}
                sx={{ width: 24, height: 24 }}
                imgProps={{ referrerPolicy: "no-referrer" }}
              />
            ) : (
              <AccountCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.my_account", "Minha Conta")} />
        </MenuItem>

        {/* Criar Conta */}
        <MenuItem component={Link} href="/login/criar-conta" prefetch={false}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.create_account", "Criar Conta")} />
        </MenuItem>

        {/* Minhas Turmas */}
        <MenuItem component={Link} href="/login/minhas-turmas" prefetch={false}>
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
            <ListItemText primary={t("profileMenu.my_classes", "Minhas Turmas")} />
        </MenuItem>

        {/* Meus Alunos */}
        <MenuItem component={Link} href="/login/meus-alunos" prefetch={false}>
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.my_students", "Meus Alunos")} />
        </MenuItem>

        {/* Notas e Avaliações */}
        <MenuItem component={Link} href="/login/notas-avaliacoes" prefetch={false}>
          <ListItemIcon>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("profileMenu.grades_assessments", "Notas e Avaliações")} />
        </MenuItem>

        <Divider />

        {status === "authenticated" ? (
          <MenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("profileMenu.sign_out", "Sair")} />
          </MenuItem>
        ) : (
          <MenuItem component={Link} href="/login" prefetch={false}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("profileMenu.sign_in", "Entrar")} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
