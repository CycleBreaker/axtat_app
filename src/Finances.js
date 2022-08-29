import React, { Fragment, useState, useContext, useEffect, memo } from "react";
import "./Finances.css";
import { TransitionGroup } from "react-transition-group";
import { useLocation } from "react-router-dom";
//App Components
import NewEntryPopup from "./NewEntryPopup";
import EntryPopup from "./EntryPopup";
import DbElementDeletePopup from "./DbElementDeletePopup";
import LoadingElement from "./LoadingElement";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { UserDataContext } from "./contexts/UserDataContext";
//Helpers
import { dateFormat } from "./config";
//MUI elements
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Footer from "./Footer";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
//Icons
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
//Custom scrollbar
import { Scrollbars } from "react-custom-scrollbars-2";
//Firebase
import { db } from "./firebaseConfig";
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

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

//Entry table row components
const DatePlaceHolder = function (props) {
  const { isLightTheme, lightTheme, darkTheme } = useContext(ThemeContext);
  return (
    <Fragment>
      <Box sx={{ width: "inherit", p: 2 }}>
        <Box
          sx={{
            p: 1,
            m: "0 auto",
            width: "fit-content",
            backgroundColor: isLightTheme
              ? lightTheme.palette.primary.main
              : darkTheme.palette.primary.main,
            color: isLightTheme
              ? lightTheme.palette.primary.contrastText
              : darkTheme.palette.primary.contrastText,
            borderRadius: 16,
            filter: "drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.3))",
          }}
        >
          {new Intl.DateTimeFormat("en-IE", dateFormat).format(
            new Date(props.date)
          )}
        </Box>
      </Box>
      <Divider />
    </Fragment>
  );
};

const EntryTableRow = function (props) {
  const { entry, index, openEntryPopup, userSettings, entryAmount } = props;
  const { isLightTheme, lightTheme, darkTheme } = useContext(ThemeContext);

  const entryClick = function () {
    openEntryPopup(entry);
  };

  const selectIcon = function () {
    if (entry.isSpending) {
      const groupIcon = userSettings.groups.find(
        (gr) => gr.name === entry.group
      );
      if (groupIcon) {
        return groupIcon.icon;
      } else {
        return entry.icon;
      }
    } else {
      const sourceIcon = userSettings.sources.find(
        (gr) => gr.name === entry.source
      );
      if (sourceIcon) {
        return sourceIcon.icon;
      } else {
        return entry.icon;
      }
    }
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
          {selectIcon()}
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
                  justifyContent: "flex-end",
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
                  justifyContent: "flex-end",
                  alignItems: "center",
                }
          }
        >
          {entry.isSpending
            ? "-" +
              entry.sum +
              `${userSettings.currency ? userSettings.currency.symbol : null}`
            : "+" +
              entry.sum +
              `${userSettings.currency ? userSettings.currency.symbol : null}`}
        </Grid>
      </Grid>
      {index !== entryAmount - 1 && <Divider />}
    </Box>
  );
};

const NoEntryText = function () {
  return (
    <Box
      sx={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography>
        Press <AddCircleIcon sx={{ transform: "translateY(6px)" }} /> to add
        your first entry
      </Typography>
    </Box>
  );
};

function Finances(props) {
  const location = useLocation();
  //Contexts
  const { mobileResolution, tabletResolution, commonWindowSize } =
    useContext(ResolutionContext);
  const {
    user,
    userEntries,
    sessionSettings,
    setSessionSettings,
    userSettings,
    updateUserEntries,
    userCheck,
    logout,
  } = useContext(UserDataContext);
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

  //Notification
  const [notificationState, setNotificationState] = useState({
    open: false,
    text: "",
  });
  const openNotification = (text) =>
    setNotificationState({ open: true, text: text });
  const handleCloseNotification = function (e, reason) {
    if (reason === "clickaway") {
      return;
    }
    setNotificationState({ open: false, text: "" });
  };
  //CRUD functions
  const createNewEntry = async function (entry) {
    console.log("create entry: ", entry);
    await addDoc(collection(db, user.id), {
      ...entry,
      icon: entry.isSpending
        ? userSettings.groups.find((gr) => entry.group === gr.name).icon
        : userSettings.sources.find((gr) => entry.source === gr.name).icon,
      date: new Date(entry.date),
    });
    openNotification("Entry added!");
  };
  const editEntry = async function (entry) {
    console.log("edit entry:", entry);
    const docRef = doc(db, user.id, entry.id);
    console.log(docRef);
    await updateDoc(docRef, {
      ...entry,
      icon: entry.isSpending
        ? userSettings.groups.find((gr) => entry.group === gr.name).icon
        : userSettings.sources.find((gr) => entry.source === gr.name).icon,
      date: new Date(entry.date),
    });
    openNotification("Entry updated!");
    updateUserEntries();
  };
  const deleteEntry = async function (id) {
    await deleteDoc(doc(db, user.id, id));
    openNotification("Entry deleted.");
    closeEntryPopup();
    updateUserEntries();
  };

  //Subscribe to entry updates
  useEffect(() => {
    setTimeout(() => setSessionSettings({ appLoaded: true }), 500);
    let unsubscribe = null;
    async function subscribeToEntryUpdates() {
      console.log("subscribed to entry updates");
      const settingsDocRef = collection(db, user.id);
      unsubscribe = await onSnapshot(settingsDocRef, (set) => {
        console.log("New entry snapshot");
        updateUserEntries();
      });
    }
    subscribeToEntryUpdates();
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe(); //Unsubscribes from onSnapshot updates
      }
    };
  }, []);

  return (
    <Scrollbars
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {user.userLoggedIn ? (
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
              display: location.pathname === "/finances" ? null : "none",
            }}
            onClick={openNewEntryPopup}
            className={sessionSettings.appLoaded ? null : "slide-in-bottom3"}
          >
            <AddIcon />
          </Fab>
          <Snackbar
            open={notificationState.open}
            autoHideDuration={3000}
            onClose={handleCloseNotification}
            message={notificationState.text}
            anchorOrigin={
              mobileResolution
                ? { vertical: "top", horizontal: "center" }
                : { vertical: "bottom", horizontal: "center" }
            }
          />
          <Box sx={commonWindowSize}>
            <NewEntryPopup
              open={newEntryPopupOpen}
              closeFn={closeNewEntryPopup}
              editMode={newPopupEntryEditMode}
              currentEntry={currentEntry}
              openNotification={openNotification}
              createNewEntry={createNewEntry}
              editEntry={editEntry}
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
              item={{
                item: currentEntry.id,
                itemType: "entry",
              }}
              deleteDbElement={deleteEntry}
            />
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{ width: "100%" }}
                className={
                  sessionSettings.appLoaded ? null : "slide-in-bottom2"
                }
              >
                {userEntries.length === 0 ? (
                  <NoEntryText />
                ) : (
                  <Paper elevation={3}>
                    <TransitionGroup sx={{ width: "inherit" }}>
                      {userEntries.map((entry, i) => (
                        <Collapse sx={{ width: "inherit" }} key={entry.id}>
                          {entry.sum === 0 ? (
                            <DatePlaceHolder key={i} date={entry.date} />
                          ) : (
                            <EntryTableRow
                              key={i}
                              index={i}
                              entry={entry}
                              openEntryPopup={openEntryPopup}
                              userSettings={userSettings}
                              entryAmount={userEntries.length}
                            />
                          )}
                        </Collapse>
                      ))}
                    </TransitionGroup>
                  </Paper>
                )}
              </Grid>
            </Grid>
          </Box>
          <Footer />
        </Fragment>
      ) : (
        <LoadingElement />
      )}
    </Scrollbars>
  );
}

export default memo(Finances);

//Разбиваем таблицу по дням так: заказываем из БД записи в порядке очереди - от новых к старым. В бэкэндовой функции разбиваем по ключам,
//то есть .getDay() && getMonth() и .getYear(). Отправляем на фронт дату последней записи, мэппим по дням.
