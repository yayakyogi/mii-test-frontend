/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { time } from "../../../libraries/time";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSearchParams } from "react-router-dom";
// import { paramsToObject } from "../../../helper/utils";
import { forEach } from "lodash-es";
import { paramsToObject } from "../../../helper/utils";

const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [barData, setBarData] = useState<number[]>([]);
  const [barGerbang, setBarGerbang] = useState<any[]>([]);
  const [pieShift, setPieShift] = useState<any[]>([]);
  const [pieRuas, setPieRuas] = useState<any>([]);

  const onFilter = (values: any) => {
    const newVal = { ...filters, ...values };

    setFilters((old: any) => {
      return { ...old, ...newVal };
    });
  };

  const sumData = (data: any, field: string) => {
    const result = data.reduce(
      (total: any, item: any) => total + item[field],
      0
    );

    return result || 0;
  };

  const groupingdData = (arr: any, field: string) => {
    const groupData = arr.reduce((acc: any, item: any) => {
      acc[item[field]] = (acc[item[field]] || 0) + 1;
      return acc;
    }, {});

    const convertToArray = Object.keys(groupData).map((key) => ({
      label: key,
      value: groupData[key],
    }));

    return convertToArray;
  };

  const { refetch } = useQuery({
    queryKey: ["lalins", filters],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/lalins`,
        {
          params: filters,
        }
      );

      const response = data.data.rows.rows;

      const sumBca = sumData(response, "eBca");
      const sumBri = sumData(response, "eBri");
      const sumBni = sumData(response, "eBni");
      const sumDki = sumData(response, "eDki");
      const sumMandiri = sumData(response, "eMandiri");
      const sumMega = sumData(response, "eMega");
      const sumFlo = sumData(response, "eFlo");

      const groupByIdGerbang = groupingdData(response, "IdGerbang");
      const groupByShift = groupingdData(response, "Shift");
      const groupByIdCabang = groupingdData(response, "IdCabang");

      setBarData([sumBca, sumBri, sumBni, sumDki, sumMandiri, sumMega, sumFlo]);

      setBarGerbang(groupByIdGerbang);
      setPieShift(groupByShift);
      setPieRuas(groupByIdCabang);

      return data;
    },
  });

  useEffect(() => {
    if (filters) {
      forEach(Object.keys(filters), (key) => {
        if (
          !filters[key] ||
          typeof filters[key] === "undefined" ||
          filters[key] === ""
        ) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, filters[key] || "");
        }
      });

      setSearchParams(searchParams, { replace: true });
      refetch();
    }
  }, [filters]);

  useEffect(() => {
    const params = paramsToObject(searchParams);

    if (params) {
      onFilter({ ...params });
    } else {
      onFilter({ tanggal: time().format("DD-MM-YYYY").toString() });
    }
  }, [searchParams]);

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-2">
        <DatePicker
          format="DD/MM/YYYY"
          onChange={(value: any) => {
            onFilter({ tanggal: time(value).format("DD-MM-YYYY").toString() });
          }}
          className="datepicker"
        />
      </div>

      <div className="flex justify-between items-center">
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: ["BCA", "BRI", "BNI", "DKI", "Mandiri", "Mega", "Flo"],
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: barData,
            },
          ]}
          width={500}
          height={300}
        />

        <PieChart
          series={[
            {
              data: pieShift.map((shift: any, index: number) => ({
                id: index,
                label: `Shift ${shift.label}`,
                value: shift.value,
              })),
            },
          ]}
          width={400}
          height={200}
        />
      </div>

      <div className="flex justify-between items-center">
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: barGerbang.map((bar) => {
                return bar.label;
              }),
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: barGerbang.map((bar) => {
                return bar.value;
              }),
            },
          ]}
          width={500}
          height={300}
        />

        <PieChart
          series={[
            {
              data: pieRuas.map((ruas: any, index: number) => ({
                id: index,
                label: `Ruas ${ruas.label}`,
                value: ruas.value,
              })),
            },
          ]}
          width={400}
          height={200}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
