import React from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

import { t } from "utils/text";

export type ConfirmProps = {
  open: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
};

export default function Confirm({
  open,
  onSubmit,
  onCancel,
  submitLabel = t("ok"),
  cancelLabel = t("cancel"),
  title,
  children,
}: ConfirmProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={onCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            {children && <AlertDialogBody>{children}</AlertDialogBody>}
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button colorScheme="red" onClick={onSubmit} ml={3}>
                {submitLabel}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
