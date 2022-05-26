import React, { useState } from "react";
//MUI elements
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
//Icons
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
//ChartJS elements
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

//Temporary boilerplate stuff
const tempChartData = [
  { id: 1, year: 1989, value: 100, thing: "Widdly Scuds" },
  { id: 2, year: 1992, value: 43, thing: "Widdly Scuds" },
  { id: 3, year: 1996, value: 31, thing: "Widdly Scuds" },
  { id: 4, year: 2000, value: 51, thing: "Widdly Scuds" },
  { id: 5, year: 2004, value: 70, thing: "Widdly Scuds" },
  { id: 6, year: 2007, value: 100, thing: "Corky Porkies" },
  { id: 7, year: 2013, value: 65, thing: "Corky Porkies" },
  { id: 8, year: 2018, value: 73, thing: "Corky Porkies" },
  { id: 9, year: 2020, value: 82, thing: "Corky Porkies" },
  { id: 10, year: 2022, value: 26, thing: "Corky Porkies" },
];
const tempChartDataObject = {
  labels: tempChartData.map((y) => y.year),
  datasets: [
    {
      label: "Widdly Scuds",
      data: tempChartData.map(function (d) {
        if (d.thing === "Widdly Scuds") {
          return d.value;
        }
      }),
    },
    {
      label: "Corky Porkies",
      data: tempChartData.map(function (d) {
        if (d.thing === "Corky Porkies") {
          return d.value;
        }
      }),
    },
  ],
};

export default function StatWindow(props) {
  //Size toggle functionality
  const [fullSize, setFullSize] = useState(false);
  const toggleSize = () => setFullSize(!fullSize);
  const windowStyle = {
    p: 2,
    m: 2,
    textAlign: "center",
    width: fullSize ? "100%" : "100%",
    position: "relative",
    transition: "width 0.5s",
    boxSizing: "border-box",
  };

  return (
    <Paper elevation={3} sx={windowStyle}>
      <Stack
        direction="row"
        alignItems="right"
        spacing={fullSize ? 1 : 0}
        sx={{ position: "absolute", right: 20 }}
      >
        <IconButton size="small">
          <DeleteIcon />
        </IconButton>
        <IconButton size="small">
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={toggleSize}>
          {fullSize ? (
            <CloseFullscreenIcon fontSize="inherit" />
          ) : (
            <OpenInFullIcon fontSize="inherit" />
          )}
        </IconButton>
      </Stack>
      <Typography variant={fullSize ? "h4" : "h5"}>{props.name}</Typography>
      <Line data={tempChartDataObject} />
    </Paper>
  );
}
