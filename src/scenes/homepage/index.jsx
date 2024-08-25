import { Box, useTheme, Select, MenuItem } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Homepage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [wildfireList, setWildfireList] = useState({
    fires: [],
  });
  const [selectedCounty, setSelectedCounty] = useState(""); // State for selected county

  const columns = [
    { field: "County", headerName: "County", flex: 1 },
    { field: "Name", headerName: "Name", cellClassName: "name-column--cell" },
    { field: "AcresBurned", headerName: "Acres Burned", flex: 1 },
    { field: "PercentContained", headerName: "Percent Contained", flex: 1 },
    { field: "IsActive", headerName: "Is Active", flex: 1 },
  ];

  useEffect(() => {
    const corsProxyUrl = "https://thingproxy.freeboard.io/fetch/";
    fetch(
      corsProxyUrl +
        "https://www.fire.ca.gov/umbraco/api/IncidentApi/List?inactive=true&amp;year=2022"
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setWildfireList({
          fires: [...res],
        });
      })
      .catch((error) => {
        console.log("error...." + error);
      });
  }, []);

  // Extract unique county values from the data
  const uniqueCounties = Array.from(
    new Set(wildfireList.fires.map((fire) => fire.County))
  );

  const handleCountyChange = (event) => {
    setSelectedCounty(event.target.value);
  };

  // Filter the data based on the selected county
  const filteredData = selectedCounty
    ? wildfireList.fires.filter((fire) => fire.County === selectedCounty)
    : wildfireList.fires;

  return (
    <Box m="20px">
      <Header
        title="Wildfire Data"
        subtitle="View All The Latest Wildfires Filtered By County"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .pol-column--cell": {
            color: colors.greenAccent[300],
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        Select County: 
        <Select
          value={selectedCounty}
          onChange={handleCountyChange}
          displayEmpty
          variant="outlined"
          style={{ width: "400px" }}
          sx={{ marginBottom: "20px" }}
        >
          <MenuItem value="">All Counties</MenuItem>
          {uniqueCounties.map((county) => (
            <MenuItem key={county} value={county}>
              {county}
            </MenuItem>
          ))}
        </Select>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row.UniqueId}
          slots={{
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Homepage;