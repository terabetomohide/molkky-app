import React from "react";
import Link from "next/link";
import { VStack, Box, Container, Heading, Button } from "@chakra-ui/react";
import { t } from "utils/text";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container p={0}>
      <Box p={3}>
        <Link href={"/"}>
          <a>
            <ArrowBackIcon /> {t("home")}
          </a>
        </Link>
      </Box>

      <Box>{children}</Box>
    </Container>
  );
}
