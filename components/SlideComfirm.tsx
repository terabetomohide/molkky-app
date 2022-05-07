import React from "react";

import { Button, Slide, Box, Flex } from "@chakra-ui/react";

import { t } from "utils/text";
import { ConfirmProps } from "./Comfirm";

export default function SlideConfirm({
  open,
  onSubmit,
  onCancel,
  submitLabel = t("ok"),
  cancelLabel = t("cancel"),
  title,
  children,
}: ConfirmProps) {
  return (
    <>
      <Slide direction="bottom" in={open} style={{ zIndex: 10 }}>
        <Box color="white" minH={"250px"} bg="green.500">
          <Flex direction={"column"} minH={"250px"} p={3} height={"100%"}>
            <Box fontSize="lg" fontWeight="bold" p={3}>
              {title}
            </Box>
            {children && <Box>{children}</Box>}
            <Flex
              py={3}
              width={"100%"}
              justifyContent={"space-between"}
              mt={"auto"}
            >
              <Button onClick={onCancel} w={"50%"} py={8} color={"black"}>
                {cancelLabel}
              </Button>
              <Button
                colorScheme="red"
                w={"50%"}
                py={8}
                onClick={onSubmit}
                ml={3}
              >
                {submitLabel}
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Slide>
    </>
  );
}
