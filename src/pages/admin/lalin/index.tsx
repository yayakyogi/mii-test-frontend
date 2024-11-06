/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { groupBy, debounce } from "lodash-es";
import { time } from "../../../libraries/time";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { paramsToObject } from "../../../helper/utils";
import { forEach } from "lodash-es";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Column {
  id:
    | "day"
    | "date"
    | "paymentMethod"
    | "golI"
    | "golII"
    | "golIII"
    | "golIV"
    | "golV"
    | "total";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "day",
    label: "Hari",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "date",
    label: "Tanggal",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "paymentMethod",
    label: "Pembayaran",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "golI",
    label: "Gol I",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "golII",
    label: "Gol II",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "golIII",
    label: "Gol III",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "golIV",
    label: "Gol IV",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "golV",
    label: "Gol V",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "total",
    label: "Total",
    minWidth: 100,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
];

const LalinPage: React.FC = () => {
  const [filters, setFilters] = useState<any>({ limit: 100 });
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupPayment, setGroupPayment] = useState<string>("Tunai");
  const [countData, setCountData] = useState<number>(0);
  const [search, setSearch] = useState<string>(filters?.search || "");

  const onFilter = (values: any) => {
    const newVal = { ...filters, ...values };

    setFilters((old: any) => {
      return { ...old, ...newVal };
    });
  };

  const { data, refetch, isPending } = useQuery({
    queryKey: ["lalin", filters],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/lalins`,
        { params: filters }
      );

      setCountData(data.data.count);

      const response: any[] = data.data.rows.rows;
      const results: any = [];

      const groupByDate = groupBy(response, (res) => {
        return time(res.Tanggal).format("DD/MM/YYYY");
      });

      const filterGol = (arr: any[], gol: number) => {
        const newArr = arr.filter((val) => val.Golongan === gol);

        return newArr.length;
      };

      Object.entries(groupByDate).forEach(([date, rows]) => {
        const result = {
          date,
          day: time(date).format("dddd"),
          total: 0,
          paymentMethod: groupPayment,
          golI: filterGol(rows, 1),
          golII: filterGol(rows, 2),
          golIII: filterGol(rows, 3),
          golIV: filterGol(rows, 4),
          golV: filterGol(rows, 5),
        };

        let total;

        const reduceData = (field: string) => {
          const result = (total = rows.reduce((prev, current) => {
            return prev + current[field];
          }, 0));

          return result;
        };

        if (groupPayment === "Tunai") {
          total = reduceData("Tunai");
        }

        if (groupPayment === "flo") {
          total = reduceData("eFlo");
        }

        if (groupPayment === "KTP") {
          const dinasOpr = reduceData("DinasOpr");
          const dinasMitra = reduceData("DinasMitra");
          const dinasKary = reduceData("DinasKary");

          total = dinasOpr + dinasMitra + dinasKary;
        }

        if (groupPayment === "eTol") {
          const eBca = reduceData("eBca");
          const eBni = reduceData("eBni");
          const eBri = reduceData("eBri");
          const eMandiri = reduceData("eMandiri");
          const eDki = reduceData("eDKI");
          const eMega = reduceData("eMega");
          const eNobu = reduceData("eNobu");

          total = eBca + eBni + eBri + eMandiri + eDki + eMega + eNobu;
        }

        if (groupPayment === "E-Tol+Tunai+Flo") {
          const eBca = reduceData("eBca");
          const eBni = reduceData("eBni");
          const eBri = reduceData("eBri");
          const eMandiri = reduceData("eMandiri");
          const eDki = reduceData("eDKI");
          const eMega = reduceData("eMega");
          const eNobu = reduceData("eNobu");
          const tunai = reduceData("Tunai");
          const flo = reduceData("eFlo");

          total =
            eBca + eBni + eBri + eMandiri + eDki + eMega + eNobu + tunai + flo;
        }

        if (groupPayment === "all") {
          const eBca = reduceData("eBca");
          const eBni = reduceData("eBni");
          const eBri = reduceData("eBri");
          const eMandiri = reduceData("eMandiri");
          const eDki = reduceData("eDKI");
          const eMega = reduceData("eMega");
          const eNobu = reduceData("eNobu");
          const tunai = reduceData("Tunai");
          const flo = reduceData("eFlo");
          const dinasOpr = reduceData("DinasOpr");
          const dinasMitra = reduceData("DinasMitra");
          const dinasKary = reduceData("DinasKary");

          total =
            eBca +
            eBni +
            eBri +
            eMandiri +
            eDki +
            eMega +
            eNobu +
            tunai +
            flo +
            dinasOpr +
            dinasMitra +
            dinasKary;
        }

        result.total = total;

        results.push(result);
      });

      return results;
    },
  });

  const changePaymentGroup = (value: string) => {
    setGroupPayment(value);
  };

  const paymentMethodList = [
    {
      label: "Total Tunai",
      value: "Tunai",
    },
    {
      label: "Total E-Tol",
      value: "eTol",
    },
    {
      label: "Total Flo",
      value: "flo",
    },
    {
      label: "Total KTP",
      value: "KTP",
    },
    {
      label: "Total E-Tol+Tunai+Flow",
      value: "E-Tol+Tunai+Flo",
    },
    {
      label: "Total Keseluruhan",
      value: "all",
    },
  ];

  const handleChangePage = (_: any, newPage: number) => {
    onFilter({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilter({ limit: +event.target.value, page: 1 });
  };

  const debouncedSearch = useRef(
    debounce((query) => {
      if (query.length >= 3 || query === "") {
        onFilter({ search: query });
      }
    }, 300)
  ).current;

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

    onFilter({ ...params });
  }, [searchParams]);

  useEffect(() => {
    refetch();
  }, [groupPayment]);

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Laporan Lalin per Hari</h1>
      <div className="mb-4 flex gap-2">
        <DatePicker
          format="DD/MM/YYYY"
          value={filters?.tanggal ? time(filters.tanggal) : null}
          onChange={(value: any) => {
            onFilter({ tanggal: time(value).format("DD-MM-YYYY").toString() });
          }}
          className="datepicker"
        />
        <input
          placeholder="Search"
          value={search}
          className="pl-3 border border-slate-300 outline-none focus:border-primary rounded"
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
        <Button
          variant="outlined"
          onClick={() => {
            setSearch("");
            setFilters({ ...filters, tanggal: null, search: "" });
            // searchParams.delete("tanggal");
            // searchParams.delete("search");

            // setSearchParams(searchParams);
          }}
        >
          Reset
        </Button>
      </div>
      <div className="flex items-center mb-3">
        {paymentMethodList.map((payment) => {
          return (
            <Button
              key={payment.value}
              variant={
                groupPayment === payment.value ? "contained" : "outlined"
              }
              onClick={() => changePaymentGroup(payment.value)}
            >
              {payment.label}
            </Button>
          );
        })}
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <p>Loading...</p>
                  </TableCell>
                </TableRow>
              ) : data?.length ? (
                data.map((row: any) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <p className="text-center">No data found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 20, 50, 100]}
          component="div"
          count={countData}
          rowsPerPage={filters?.limit || 20}
          page={filters?.page - 1 || 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default LalinPage;
