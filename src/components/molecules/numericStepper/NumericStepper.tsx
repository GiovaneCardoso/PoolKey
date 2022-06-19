import React, { useEffect, useRef, useState } from "react";
import { QuantitySelector } from "@faststore/ui";
import { HStack, Icon } from "@chakra-ui/react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import "./numeric.module.scss";

interface NumericStepperProps {
  sendScore: (score: number, name: string) => void;
  user: any;
  disabled: boolean;
}

const NumericStepper = ({
  sendScore,
  user,
  disabled = true,
}: NumericStepperProps) => {
  const quantity: number = user.score || 0;
  const MAX_QUANTITY = 10;
  const MIN_QUANTITY = 0;
  const decrease = () => {
    sendScore(quantity - 1, user.name);
  };
  const increase = () => {
    sendScore(quantity + 1, user.name);
  };
  function isLeftDisabled() {
    return quantity === MIN_QUANTITY;
  }

  function isRightDisabled() {
    return quantity === MAX_QUANTITY;
  }

  return (
    <HStack maxW="320px">
      <QuantitySelector
        quantity={quantity}
        leftButtonProps={{
          onClick: decrease,
          disabled: isLeftDisabled() || disabled,
          icon: <Icon as={RiSubtractLine} />,
          style: {
            height: "30px",
            border: "none",
            margin: "0",
            marginRight: "5px",
            padding: "0 10px",
          },
        }}
        rightButtonProps={{
          onClick: increase,
          disabled: isRightDisabled() || disabled,
          icon: <Icon as={RiAddLine} />,
          style: {
            height: "30px",
            border: "none",
            margin: "0",
            marginLeft: "5px",
            padding: "0 10px",
          },
        }}
        inputProps={{
          readOnly: disabled,
          style: {
            maxWidth: "30px",
            padding: "5px",
            textAlign: "center",
            height: "30px",
            color: "#27272b",
          },
        }}
      />
    </HStack>
  );
};

export default NumericStepper;
