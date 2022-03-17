// import { Title } from "../../components";

// function PendingReviews() {
//   return (
//     <>
//       <Title title="Pending Reviews" />
//     </>
//   );
// }
// export default PendingReviews;

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Title } from "../../components";

const columns = [
  { field: "id", headerName: "Rating", width: 70 },
  { field: "firstName", headerName: "Album Name", width: 280 },
  { field: "lastName", headerName: "Comment", width: 600 },
  {
    field: "age",
    headerName: "Username",
    type: "number",
    width: 250,
  },
  {
    field: "fullName",
    headerName: "Date",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 200,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function PendingReviews() {
  return (
    <>
      <div>
        <Title title="Pending Reviews" />
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </>
  );
}
