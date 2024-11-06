/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Snackbar } from "@mui/material";
import React, { forwardRef, useImperativeHandle, useState } from "react";

interface FuncProps {
  onOpen: (
    type: "error" | "success" | "warning",
    message: string,
    payload?: any
  ) => void;
  onClose: () => void;
}

interface IProps {
  callback?: (payload: any) => void;
}

const Notification: React.ForwardRefRenderFunction<FuncProps, IProps> = (
  { callback },
  ref
) => {
  const [payload, setPayload] = useState<any>();
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<"error" | "success" | "warning">(
    "success"
  );

  useImperativeHandle(ref, () => ({
    onOpen(type, msg, payload) {
      setOpen(true);

      setMessage(msg);
      setStatus(type);
      setPayload(payload);
    },

    onClose() {
      setOpen(false);
      setMessage("");
      setStatus("success");
      setPayload(null);
    },
  }));

  return status !== "warning" ? (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={() => setOpen(false)}
      message={message}
      key={message}
      autoHideDuration={4000}
    >
      <Alert
        severity={status === "success" ? "success" : "error"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  ) : (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={() => setOpen(false)}
      message={message}
      key={message}
      action={
        <div className="flex gap-1">
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => callback && callback(payload)}
          >
            Hapus
          </Button>
        </div>
      }
    />
  );
};

export default forwardRef(Notification);
