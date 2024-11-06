/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/input/input.component";
import Notification from "../../components/notification/notification.component";
import { useApp } from "../../providers/app.provider";

type FormLogin = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { setToken } = useApp();
  const notificationRef = useRef<React.ElementRef<typeof Notification>>(null);

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<FormLogin>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => {
      return axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, data);
    },
    onSuccess: (data) => {
      const token = data.data.token;

      setToken(token);
      // notificationRef.current?.onOpen("success", data.data.message);
    },
    onError: (data: any) => {
      notificationRef.current?.onOpen("error", data.response.data.message);
    },
  });

  const onSubmit = (data: any) => mutate(data);

  return (
    <>
      <div className="w-full">
        <div className="mb-7">
          <img src="/images/logo.png" className="mb-2" />
          <span className="text-slate-600 font-medium text-sm">
            The First and The Biggest Toll Road Operator in Indonesia
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            placeholder="Masukkan username"
            className="mb-3"
            {...register("username", { required: true })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            className="mb-5"
            {...register("password", { required: true })}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!isDirty || !isValid || isPending}
              style={{ marginTop: "10px" }}
            >
              {isPending ? "Loading..." : "Login"}
            </Button>
          </div>
        </form>
      </div>

      <Notification ref={notificationRef} />
    </>
  );
};

export default LoginPage;
