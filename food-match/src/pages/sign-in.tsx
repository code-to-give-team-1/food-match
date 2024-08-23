import { Icon, Button, Stack } from "@chakra-ui/react";
import { BiLeftArrowAlt } from "react-icons/bi";
import {
  EmailLoginForm,
  SignInContextProvider,
} from "~/features/sign-in/components";
import { useRouter } from "next/router";

export const SignIn = (): JSX.Element => {
  const router = useRouter();
  return (
    <SignInContextProvider>
      <Stack w="100%" gap="1rem">
        <Button
          leftIcon={<Icon as={BiLeftArrowAlt} fontSize="1rem" mr="-4px" />}
          variant="link"
          size="xs"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <EmailLoginForm />
      </Stack>
    </SignInContextProvider>
  );
};

export default SignIn;
