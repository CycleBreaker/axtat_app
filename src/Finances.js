import React, { Fragment, useState, useContext, memo } from "react";
import "./Finances.css";
import { TransitionGroup } from "react-transition-group";
//App Components
import NewEntryPopup from "./NewEntryPopup";
import EntryPopup from "./EntryPopup";
import DbElementDeletePopup from "./DbElementDeletePopup";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { TransitionContext } from "./contexts/TransitionContext";
import { SettingsContext } from "./contexts/SettingsContext";
//MUI elements
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
//Icons
import AddIcon from "@mui/icons-material/Add";
//ChartJS elements
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
//Transition animation
import { motion } from "framer-motion";

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
const tempTableEntry = [
  {
    isSpending: true,
    id: 1,
    date: 1647080668,
    sum: 234,
    tags: ["Me", "Business", "Woman"],
    group: "Food",
    item: "Home-Cooked",
    source: "",
    comment: "Home burgers",
    smiley: "🍗",
  },
  {
    isSpending: true,
    id: 2,
    date: 1647253468,
    sum: 676,
    tags: ["Me", "Woman"],
    group: "Presents",
    item: "Personal",
    source: "",
    comment: "Random gift",
    smiley: "🎁",
  },
  {
    isSpending: true,
    id: 3,
    date: 1647339868,
    sum: 4567,
    tags: ["Me"],
    group: "Appearance",
    item: "Clothing",
    source: "",
    comment: "Jacket",
    smiley: "🧥",
  },
  {
    isSpending: false,
    id: 4,
    date: 1647343468,
    sum: 14000,
    tags: [],
    group: "",
    item: "",
    source: "Salary",
    comment: "ETC March",
    smiley: "💰",
  },
  {
    isSpending: false,
    id: 5,
    date: 1647429868,
    sum: 700,
    tags: [],
    group: "",
    item: "",
    source: "Tips",
    comment: "Chernobyl tour",
    smiley: "💵",
  },
  {
    isSpending: true,
    id: 6,
    date: 1647516268,
    sum: 1243,
    tags: ["Family"],
    group: "Food",
    item: "Home-Cooked",
    source: "",
    comment: "Auchan",
    smiley: "🍗",
  },
  {
    isSpending: true,
    id: 7,
    date: 1647534268,
    sum: 80,
    tags: ["Me"],
    group: "Transportation",
    item: "Taxi",
    source: "",
    comment: "",
    smiley: "🚕",
  },
  {
    isSpending: true,
    id: 8,
    date: 1647541468,
    sum: 276,
    tags: ["Me"],
    group: "Substances",
    item: "Alcohol",
    source: "",
    comment: "With Phil",
    smiley: "🍺",
  },
  {
    isSpending: false,
    id: 9,
    date: 1647627868,
    sum: 27700,
    tags: [],
    group: "",
    item: "",
    source: "Business",
    comment: "AT Google",
    smiley: "💼",
  },
  {
    isSpending: true,
    id: 10,
    date: 1647638668,
    sum: 8654358,
    tags: ["Family"],
    group: "Purchases",
    item: "Other",
    source: "",
    comment: "New car for dad",
    smiley: "🛒",
  },
];

//Entry table row component
const EntryTableRow = function (props) {
  const { entry, index, openEntryPopup, chosenCurrency } = props;
  const { isLightTheme, lightTheme, darkTheme } = useContext(ThemeContext);

  const entryClick = function () {
    openEntryPopup(entry);
  };

  return (
    //The grid rows stretch by width thanks to 'flex' property
    <Box sx={{ width: "inherit" }} onClick={entryClick}>
      <Grid container spacing={2} sx={{ width: "100%", p: 2 }}>
        <Grid
          item
          xl={2}
          sx={{
            flex: 0.2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {entry.smiley}
        </Grid>
        <Grid
          item
          xl={5}
          sx={
            entry.isSpending
              ? { flex: 2.3 }
              : {
                  fontWeight: "bold",
                  color: isLightTheme
                    ? lightTheme.palette.success.main
                    : darkTheme.palette.success.main,
                  flex: 2.3,
                }
          }
        >
          {entry.isSpending ? entry.group + " / " + entry.item : entry.source}
        </Grid>
        <Grid
          item
          xl={5}
          sx={
            entry.isSpending
              ? {
                  flex: 0.5,
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {
                  fontWeight: "bold",
                  color: isLightTheme
                    ? lightTheme.palette.success.main
                    : darkTheme.palette.success.main,
                  flex: 0.5,
                  textAlign: "right",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }
          }
        >
          {entry.isSpending
            ? "-" + entry.sum + chosenCurrency.symbol
            : "+" + entry.sum + chosenCurrency.symbol}
        </Grid>
      </Grid>
      {index !== tempTableEntry.length - 1 && <Divider />}
    </Box>
  );
};

function Finances(props) {
  //Contexts
  const { tabletResolution, commonWindowSize } = useContext(ResolutionContext);
  const { transition } = useContext(TransitionContext);
  const { chosenCurrency } = useContext(SettingsContext);
  //New Entry popup
  const [newEntryPopupOpen, setNewEntryPopupOpen] = useState(false);
  const openNewEntryPopup = () => setNewEntryPopupOpen(true);
  const closeNewEntryPopup = function () {
    setNewPopupEntryEditMode(false);
    setNewEntryPopupOpen(false);
  };
  const [newPopupEntryEditMode, setNewPopupEntryEditMode] = useState(false);
  const openEditEntryPopup = function () {
    setNewPopupEntryEditMode(true);
    openNewEntryPopup();
  };
  //Existing entry popup
  const [currentEntry, setCurrentEntry] = useState(tempTableEntry[0]);
  const [entryPopupOpen, setEntryPopupOpen] = useState(false);
  const openEntryPopup = function (entry) {
    setCurrentEntry(entry);
    setEntryPopupOpen(true);
  };
  const closeEntryPopup = () => setEntryPopupOpen(false);
  //Delete entry popup controls
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const openDeletePopup = () => setDeletePopupOpen(true);
  const closeDeletePopup = () => setDeletePopupOpen(false);

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
        onClick={openNewEntryPopup}
        className="slide-in-bottom3"
      >
        <AddIcon />
      </Fab>
      <motion.div
        initial={transition.initial}
        animate={transition.animate}
        exit={transition.exit}
      >
        <Box sx={commonWindowSize}>
          <NewEntryPopup
            open={newEntryPopupOpen}
            closeFn={closeNewEntryPopup}
            editMode={newPopupEntryEditMode}
          />
          <EntryPopup
            entry={currentEntry}
            open={entryPopupOpen}
            closeFn={closeEntryPopup}
            openEditWindow={openEditEntryPopup}
            openDeleteWindow={openDeletePopup}
          />
          <DbElementDeletePopup
            isOpen={deletePopupOpen}
            close={closeDeletePopup}
            item={currentEntry.id}
            itemType="entry"
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Paper elevation={3} className="slide-in-bottom">
                <Box sx={{ p: 2 }}>
                  <Box sx={{ textAlign: "right" }}>9 May 2022 - 9 May 2023</Box>
                  <Line data={tempChartDataObject} options={{ scale: 0.5 }} />
                </Box>
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ width: "100%" }}
              className="slide-in-bottom2"
            >
              <Paper elevation={3}>
                <TransitionGroup sx={{ width: "inherit" }}>
                  {tempTableEntry.map((entry, i) => (
                    <Collapse sx={{ width: "inherit" }}>
                      <EntryTableRow
                        key={entry.id}
                        index={i}
                        entry={entry}
                        openEntryPopup={openEntryPopup}
                        chosenCurrency={chosenCurrency}
                      />
                    </Collapse>
                  ))}
                </TransitionGroup>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Fragment>
  );
}

export default memo(Finances);
