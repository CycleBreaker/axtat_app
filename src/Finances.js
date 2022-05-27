import React, { Fragment, useState, useContext } from "react";
import "./Finances.css";
//App Components
import NewEntryPopup from "./NewEntryPopup";
//MUI elements
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
//Icons
import AddIcon from "@mui/icons-material/Add";
//ChartJS elements
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";

//Temporary boilerplate stuff
const tempChartData = [
  { id: 1, year: 1989, thing: 100 },
  { id: 2, year: 1992, thing: 43 },
  { id: 3, year: 1996, thing: 31 },
  { id: 4, year: 2000, thing: 51 },
  { id: 5, year: 2004, thing: 70 },
  { id: 6, year: 2007, thing: 100 },
  { id: 7, year: 2013, thing: 65 },
  { id: 8, year: 2018, thing: 73 },
  { id: 9, year: 2020, thing: 82 },
  { id: 10, year: 2022, thing: 26 },
  { id: 11, year: 2007, thing: 100 },
  { id: 12, year: 2013, thing: 65 },
  { id: 13, year: 2018, thing: 73 },
  { id: 14, year: 2020, thing: 82 },
  { id: 15, year: 2022, thing: 26 },
];
const tempChartData2 = [
  { id: 16, year: 1989, thing: 1003 },
  { id: 17, year: 1992, thing: 433 },
  { id: 18, year: 1996, thing: 331 },
  { id: 19, year: 2000, thing: 531 },
  { id: 20, year: 2004, thing: 730 },
  { id: 21, year: 2007, thing: 1300 },
  { id: 22, year: 2013, thing: 635 },
  { id: 23, year: 2018, thing: 373 },
  { id: 24, year: 2020, thing: 832 },
  { id: 25, year: 2022, thing: 236 },
];
const tempChartDataObject = {
  labels: tempChartData.map((y) => y.year),
  datasets: [
    { label: "Somethings", data: tempChartData.map((d) => d.thing) },
    { label: "Somethingzzzzz", data: tempChartData2.map((d) => d.thing) },
  ],
};
const tempEntryComponent = function (id, year, thing) {
  return (
    <Paper key={id} elevation={1} sx={{ m: 1 }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          boxSizing: "border-box",
          padding: "5px",
        }}
      >
        <div>{id}</div>
        <div>{year}</div>
        <div>{thing}</div>
      </div>
    </Paper>
  );
};

export default function Finances(props) {
  //Responsiveness
  const { tabletResolution, commonWindowSize } = useContext(ResolutionContext);
  //New Entry popup
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  return (
    <Fragment>
      <Fab
        color="primary"
        sx={{
          margin: 0,
          top: "auto",
          right: tabletResolution ? 50 : "15%",
          bottom: 80,
          left: "auto",
          position: "fixed",
        }}
        onClick={openPopup}
        className="slide-in-bottom3"
      >
        <AddIcon />
      </Fab>
      <Box sx={commonWindowSize}>
        <NewEntryPopup open={popupOpen} closeFn={closePopup} />
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Paper elevation={3} className="slide-in-bottom">
              <Box sx={{ p: 2 }}>
                <Box sx={{ textAlign: "right" }}>9 May 2022 - 9 May 2023</Box>
                <Line data={tempChartDataObject} options={{ scale: 0.5 }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Paper elevation={3} xl={12} className="slide-in-bottom2">
              {tempChartData.map((dt) =>
                tempEntryComponent(dt.id, dt.year, dt.thing)
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
