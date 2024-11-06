/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Notification from "../../../../components/notification/notification.component";
import axios from "axios";
import Input from "../../../../components/input/input.component";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type FormMasterGerbang = {
  id: string;
  NamaGerbang: string;
  IdCabang: string;
  NamaCabang: string;
};

const MasterGerbangCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const notificationRef = useRef<React.ElementRef<typeof Notification>>(null);

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = useForm<FormMasterGerbang>({
    mode: "onChange",
    defaultValues: {
      id: "",
      NamaGerbang: "",
      IdCabang: "",
      NamaCabang: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => {
      return axios.post(`${import.meta.env.VITE_API_URL}/gerbangs`, data);
    },
    onSuccess: (data: any) => {
      notificationRef.current?.onOpen("success", data.data.message);
      reset();

      setTimeout(() => {
        navigate("/master-gerbang", { replace: true });
      }, 1000);
    },
    onError: (data: any) => {
      notificationRef.current?.onOpen("error", data.response.data.message);
    },
  });

  const onSubmit = (data: any) => mutate(data);

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Tambah Master Gerbang</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="ID Gerbang"
          placeholder="Masukkan ID gerbang"
          className="mb-3"
          {...register("id", { required: true })}
        />
        <Input
          label="Nama Gerbang"
          placeholder="Masukkan nama gerbang"
          className="mb-5"
          {...register("NamaGerbang", { required: true })}
        />
        <Input
          label="ID Cabang"
          placeholder="Masukkan ID cabang"
          className="mb-3"
          {...register("IdCabang", { required: true })}
        />
        <Input
          label="Nama Cabang"
          placeholder="Masukkan nama cabang"
          className="mb-5"
          {...register("NamaCabang", { required: true })}
        />
        <div className="flex justify-start gap-2 mt-5">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/master-gerbang")}
          >
            Kembali
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isDirty || !isValid || isPending}
          >
            {isPending ? "Loading..." : "Simpan"}
          </Button>
        </div>
      </form>

      <Notification ref={notificationRef} />
    </div>
  );
};

export default MasterGerbangCreatePage;
