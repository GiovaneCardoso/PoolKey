import { Button, HStack, Input, useNumberInput } from "@chakra-ui/react";
import React, { useEffect } from "react";

interface NumericStepperProps {
  sendScore: (score: string, name: string) => void;
  user: any;
}

const NumericStepper = ({ sendScore, user }: NumericStepperProps) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 0,
      min: 0,
    });
  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack maxW="320px">
      <Button {...dec} border="none" py="8" px="12" onClick={() => alert()}>
        -
      </Button>
      <Input {...input} maxWidth="50px" textAlign={"center"} p="7" />
      <Button
        {...inc}
        border="none"
        py="8"
        px="12"
        onClick={() => sendScore(4, user.name)}
      >
        +
      </Button>
    </HStack>
  );
};

export default NumericStepper;
