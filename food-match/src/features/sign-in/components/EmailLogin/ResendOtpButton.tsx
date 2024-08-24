import { Text, Button, type ButtonProps } from '@chakra-ui/react'

export interface ResendOtpButtonProps extends ButtonProps {
  timer: number
}

export const ResendOtpButton = ({
  timer,
  ...buttonProps
}: ResendOtpButtonProps): JSX.Element => {
  return (
    <Button type="button" variant="link" size="xs" {...buttonProps}>
      Resend OTP
      <Text as="span" data-chromatic="ignore">
        {timer > 0 && ` in ${timer}s `}
      </Text>
    </Button>
  )
}
