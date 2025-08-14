"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Link as MLink,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t, ready } = useTranslation("common");
  if (!ready) return null;

  const year = new Date().getFullYear();

  return (
    <Box component="footer" className={styles.footerBox}>
      <Container maxWidth="lg" className={styles.container}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          className={styles.row}
        >
          <Link href="/" className={styles.brandLink}>
            <Box className={styles.brand}>
              <Image
                src="/logo.png"
                alt={t("appName")}
                width={56}
                height={56}
                className={styles.brandImg}
                priority
              />
            </Box>
          </Link>

          <Stack direction="row" className={styles.footerLinks}>
            <MLink component={Link} href="/" className={styles.footerLink}>
              {t("footer.links.home")}
            </MLink>
            <MLink component={Link} href="/quem-somos" className={styles.footerLink}>
              {t("footer.links.about")}
            </MLink>
          </Stack>

          <Stack direction="row" className={styles.social}>
            <IconButton aria-label={t("footer.social.instagram")} href="#" target="_blank" rel="noopener noreferrer" className={styles.iconButton}>
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label={t("footer.social.facebook")} href="#" target="_blank" rel="noopener noreferrer" className={styles.iconButton}>
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label={t("footer.social.linkedin")} href="#" target="_blank" rel="noopener noreferrer" className={styles.iconButton}>
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Divider className={styles.footerDivider} sx={{ my: { xs: 4, sm: 5 }, height: 1, bgcolor: "rgba(0,0,0,0.10)" }} />

        <Typography variant="body2" className={styles.footerTextBottom}>
          {t("footer.copyright", { year })}
        </Typography>
      </Container>
    </Box>
  );
}
