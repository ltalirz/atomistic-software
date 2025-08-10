/**
 * Overview table with all codes using Material React Table v3.
 */
import React from "react";
import packageJson from "../../package.json";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { YEARS, getData } from "./Config";
import { getColumns } from "./Columns";

const lastYear = YEARS[YEARS.length - 1];

function Table() {
  const [year, setYear] = React.useState(lastYear);
  const [data, setData] = React.useState(() => getData(lastYear));

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    setData(getData(newYear));
  };

  // Map legacy column definitions to MRT column shape
  // getColumns relies on data for custom renders; keep using it for label and cell content
  const legacyColumns = React.useMemo(
    () => getColumns(data, year),
    [data, year]
  );
  const columns = React.useMemo(
    () =>
      legacyColumns.map((col) => {
        const isMultiSelect = ["types", "tags", "cost", "source"].includes(
          col.name
        );
        const isName = col.name === "name";

        // Build select options from current data for multi-select filters
        const filterSelectOptions = (() => {
          if (!isMultiSelect) return undefined;
          const vals = new Set();
          data.forEach((row) => {
            const v = row[col.name];
            if (Array.isArray(v)) v.forEach((x) => vals.add(x));
            else if (v !== undefined && v !== null && v !== "") vals.add(v);
          });
          return Array.from(vals).sort();
        })();

        // Custom filterFns: treat empty selections as no-op
        const filterFn = isMultiSelect
          ? col.name === "types" || col.name === "tags"
            ? (row, id, filterValues) => {
                if (!Array.isArray(filterValues) || filterValues.length === 0)
                  return true;
                const cellVal = row.getValue(id);
                if (Array.isArray(cellVal))
                  return cellVal.some((v) => filterValues.includes(v));
                return false;
              }
            : (row, id, filterValues) => {
                if (!Array.isArray(filterValues) || filterValues.length === 0)
                  return true;
                const cellVal = row.getValue(id);
                return filterValues.includes(cellVal);
              }
          : undefined;

        return {
          header: col.label || col.name,
          accessorKey: col.name,
          enableSorting: !!col.options?.sort,
          enableColumnFilter: isName ? true : !!col.options?.filter,
          filterVariant: isMultiSelect
            ? "multi-select"
            : isName
            ? "text"
            : undefined,
          filterFn,
          filterSelectOptions,
          // Use MRT's Cell to delegate rendering back to mui-datatables-style renderer
          Cell: col.options?.customBodyRenderLite
            ? ({ row }) => col.options.customBodyRenderLite(row.index)
            : undefined,
          // Hide columns marked display: false
          enableHiding: true,
          size: 120,
        };
      }),
    [legacyColumns]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      //density: "compact",
      showColumnFilters: true,
      pagination: { pageIndex: 0, pageSize: 100 },
      sorting: [{ id: "citations", desc: true }],
      columnVisibility: Object.fromEntries(
        legacyColumns.map((c) => [c.name, c.options?.display !== false])
      ),
    },
    enableColumnActions: false,
    enableRowSelection: false,
    enableDensityToggle: false,
    muiTableBodyProps: { sx: { "& td": { py: 0.5 } } },
  });

  return (
    <div className="App">
      <header className="App-header">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Typography component="h2" variant="h5">
            Citation Data
          </Typography>
          <FormControl size="small">
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={year}
              label="Year"
              onChange={handleYearChange}
            >
              {YEARS.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <MaterialReactTable table={table} />

        <Box mt={2}>
          <Typography variant="subtitle1" align="center" noWrap>
            Further engines are tracked on the{" "}
            <a href={packageJson.repository.url + "/wiki/Watchlist"}>
              Watchlist
            </a>
            .
          </Typography>
        </Box>
      </header>
    </div>
  );
}

export default Table;
