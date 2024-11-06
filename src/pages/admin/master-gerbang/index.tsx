/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Notification from "@components/notification/notification.component";
import { forEach, debounce } from "lodash-es";
import { paramsToObject } from "@helper/utils";

interface Column {
  id: "id" | "NamaGerbang" | "IdCabang" | "NamaCabang" | "aksi";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "id",
    label: "ID Gerbang",
    minWidth: 50,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "NamaGerbang",
    label: "Nama Gerbang",
    minWidth: 170,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "IdCabang",
    label: "ID Cabang",
    minWidth: 50,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "NamaCabang",
    label: "Nama Cabang",
    minWidth: 170,
    align: "left",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "aksi",
    label: "Aksi",
    minWidth: 100,
    align: "left",
    format: () => "aksi",
  },
];

const MasterGerbangPage: React.FC = () => {
  const [filters, setFilters] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const notificationRef = useRef<React.ElementRef<typeof Notification>>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [countData, setCountData] = useState<number>(0);
  const [search, setSearch] = useState<string>(filters.search || "");

  const onFilter = (values: any) => {
    const newVal = { ...filters, ...values };

    setFilters((old: any) => {
      return { ...old, ...newVal };
    });
  };

  const { refetch } = useQuery({
    queryKey: ["master-gerbang", filters],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/gerbangs`,
        { params: { ...filters } }
      );

      const { rows } = data.data.rows;

      setRows(rows);
      setCountData(data.data.count);

      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await axios.delete(`${import.meta.env.VITE_API_URL}/gerbangs`, {
        data,
      });
    },
    onSuccess: (data: any) => {
      notificationRef.current?.onOpen("success", data.data.message);
      refetch();
    },
    onError: (data: any) => {
      notificationRef.current?.onOpen("error", data.response.data.message);
    },
  });

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

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Master Gerbang</h1>
      <div className="flex justify-between mb-5">
        <div className="flex gap-2">
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
            size="small"
            onClick={() => {
              debouncedSearch("");
              setSearch("");
            }}
          >
            Reset
          </Button>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => navigate("tambah")}
        >
          Tambah
        </Button>
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
              {rows.length ? (
                rows.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id !== "aksi" ? (
                              value
                            ) : (
                              <div className="flex items-center gap-1">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    navigate(
                                      `edit?id=${row.id}&idCabang=${row.IdCabang}`
                                    );
                                  }}
                                >
                                  <CreateIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    notificationRef.current?.onOpen(
                                      "warning",
                                      `Anda yakin ingin menghapus data gerbang ${row.NamaGerbang} ?`,
                                      row
                                    );
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
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

      <Notification
        ref={notificationRef}
        callback={(payload: any) => {
          const { id, IdCabang } = payload;

          mutate({ id, IdCabang });
        }}
      />
    </div>
  );
};

export default MasterGerbangPage;
