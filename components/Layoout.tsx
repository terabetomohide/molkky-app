import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  HStack,
  Box,
  Container,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import QRCode from "qrcode";
import Image from "next/image";
import { t } from "utils/text";

export default function Layout({
  children,
  host,
}: {
  children: React.ReactNode;
  host?: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>();
  const router = useRouter();
  useEffect(() => {
    QRCode.toDataURL(`${host}${router.asPath}`)
      .then(setQrCodeDataUrl)
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <Container p={0}>
      <HStack p={3} justifyContent={"space-between"}>
        <Box>
          <Link href={"/"}>
            <a>
              <ArrowBackIcon /> {t("home")}
            </a>
          </Link>
        </Box>
        <Box>
          <Button onClick={onOpen}>{t("qrCode")}</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{t("currentPagesQrCode")}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box
                  justifyContent="center"
                  alignItems="center"
                  textAlign={"center"}
                >
                  {qrCodeDataUrl && (
                    <Image
                      width={"250px"}
                      height={"250px"}
                      src={qrCodeDataUrl}
                    />
                  )}
                </Box>
              </ModalBody>
              <ModalFooter justifyContent="center" alignItems="center">
                <Button m={3} onClick={onClose}>
                  {t("close")}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </HStack>
      <Box>{children}</Box>
    </Container>
  );
}
