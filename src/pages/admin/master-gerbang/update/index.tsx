/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FormMasterGerbang } from "@pages/create";
import Input from "@components/input/input.component";
import Notification from "@components/notification/notification.component";
import { Button } from "@mui/material";
import { paramsToObject } from "@helper/utils";

const MasterGerbangUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const notificationRef = useRef<React.ElementRef<typeof Notification>>(null);
  const [searchParams] = useSearchParams();
  const params = paramsToObject(searchParams);

  const { data } = useQuery({
    queryKey: ["master-gerbang", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/gerbangs`
      );

      const { rows } = data.data.rows;
      const filterData = rows.find(
        (row: any) => row.id === +params.id && row.IdCabang === +params.idCabang
      );

      return filterData;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
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
    mutationFn: async (data: any) => {
      return await axios.put(`${import.meta.env.VITE_API_URL}/gerbangs`, data);
    },
    onSuccess: (data: any) => {
      reset();
      notificationRef.current?.onOpen("success", data.data.message);

      setTimeout(() => {
        navigate("/master-gerbang", { replace: true });
      }, 1000);
    },
    onError: (data: any) => {
      notificationRef.current?.onOpen("error", data.response.data.message);
    },
  });

  const onSubmit = (data: any) => mutate(data);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("NamaGerbang", data.NamaGerbang);
      setValue("IdCabang", data.IdCabang);
      setValue("NamaCabang", data.NamaCabang);
    }
  }, [data]);

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Edit Master Gerbang</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="ID Gerbang"
          placeholder="Masukkan ID gerbang"
          className="mb-3"
          disabled
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
          disabled
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
            {isPending ? "Loading..." : "Edit"}
          </Button>
        </div>
      </form>

      <Notification ref={notificationRef} />
    </div>
  );
};

export default MasterGerbangUpdatePage;
