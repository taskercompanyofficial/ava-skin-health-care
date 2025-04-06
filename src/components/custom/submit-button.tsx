import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface SubmitBtnProps extends ButtonProps {
  processing: boolean; // Adds a processing state
  children?: React.ReactNode;
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({
  processing,
  children,
  ...props
}) => {
  return (
    <Button {...props} disabled={processing || props.disabled}>
      {processing ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitBtn;
