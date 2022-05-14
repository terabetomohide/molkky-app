import { VStack, Box, Button } from "@chakra-ui/react";
import { t } from "utils/text";

export default function Loading() {
  return (
    <VStack
      height={"calc(100vh - 64px)"}
      justifyContent="center"
      alignItems="center"
    >
      <Button isLoading fontSize={40} variant="ghost">
        {t("loading")}
      </Button>
    </VStack>
  );
}
