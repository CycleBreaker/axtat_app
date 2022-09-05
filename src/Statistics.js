import React, { Fragment, useContext, useState, memo, useEffect } from "react";
//App components
import StatWindow from "./StatWindow";
import NewStatPopup from "./NewStatPopup";
import DbElementDeletePopup from "./DbElementDeletePopup";
import Footer from "./Footer";
import LoadingElement from "./LoadingElement";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { UserDataContext } from "./contexts/UserDataContext";
//MUI elements
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
//Icons
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
//Drag and Drop
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
//Custom scrollbar
import { Scrollbars } from "react-custom-scrollbars-2";
//Firebase
import { db } from "./firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const NoStatsText = function () {
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
        your first report
      </Typography>
    </Box>
  );
};

function Statistics() {
  //Contexts
  const { mobileResolution, tabletResolution, commonWindowSize } =
    useContext(ResolutionContext);
  const { user, userSettings, setUserSettings, updateSettings } =
    useContext(UserDataContext);

  //DnD stuff
  const [windowOrder, setWindowOrder] = useState([]);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setWindowOrder(arrayMove(windowOrder, oldIndex, newIndex));
    const newWindowOrder = new Array();
    arrayMove(windowOrder, oldIndex, newIndex).map((stat, i) =>
      newWindowOrder.push({ ...stat, order: i })
    );
    if (!user.demoMode) {
      updateWindowOrder(newWindowOrder);
    }
  };
  const DraggableStatWindowList = SortableContainer(({ children }) => {
    return <Fragment>{children}</Fragment>;
  });
  const DraggableStatWindow = SortableElement((props) => (
    <StatWindow {...props} />
  ));

  //Select window for editing/deletion
  const [currentWindow, setCurrentWindow] = useState({
    name: "None",
    id: "00",
  });
  const [editModeOn, setEditModeOn] = useState(false);
  //New Stat Window popup
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = function (e, editMode = false, id) {
    console.log("Opening popup...", editMode, id);
    if (editMode) {
      console.log("edit mode on");
      setCurrentWindow(userSettings.statistics.find((st) => st.id === id));
      setEditModeOn(true);
    }
    setPopupOpen(true);
  };
  const closePopup = function () {
    setPopupOpen(false);
    setEditModeOn(false);
    setTimeout(() => setCurrentWindow({ name: "None", id: "00" }), 50);
  };
  //Delete Stat Window popup
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const openDeletePopup = function (id) {
    setCurrentWindow(userSettings.statistics.find((st) => st.id === id));
    setDeletePopupOpen(true);
  };
  const closeDeletePopup = function () {
    setDeletePopupOpen(false);
    setTimeout(() => setCurrentWindow({ name: "None", id: "00" }), 50);
  };

  //CRUD functions
  const updateWindowOrder = async function (statsWithNewPos) {
    const settingsDocRef = doc(db, user.id, "settings");
    await updateDoc(settingsDocRef, {
      statistics: statsWithNewPos,
    }).then(() => {
      openNotification("Stat Window order updated!");
    });
  };
  const uploadNewStat = async function (stat) {
    console.log("stat", stat);
    if (user.demoMode) {
      const userSettingsCopy = userSettings;
      userSettingsCopy.statistics.unshift({
        ...stat,
        dateRange: [
          { seconds: Math.floor(stat.dateRange[0].getTime()) / 1000 },
          { seconds: Math.floor(stat.dateRange[1].getTime()) / 1000 },
        ],
      });
      console.log("userSettingsCopy", userSettingsCopy);
      setUserSettings(userSettingsCopy);
      console.log("stat: ", stat);
    } else {
      const settingsDocRef = doc(db, user.id, "settings");
      await updateDoc(settingsDocRef, {
        statistics: [...userSettings.statistics, stat],
      }).then(() => {
        openNotification(`${stat.name} Stat Window successfully added!`);
        updateSettings();
      });
    }
  };
  const updateStat = async function (stat) {
    const updatedStats = userSettings.statistics;
    updatedStats[userSettings.statistics.findIndex((st) => st.id === stat.id)] =
      {
        ...stat,
        dateRange: [
          { seconds: Math.floor(stat.dateRange[0].getTime()) / 1000 },
          { seconds: Math.floor(stat.dateRange[1].getTime()) / 1000 },
        ],
      };
    if (user.demoMode) {
      setUserSettings({ ...userSettings, statistics: updatedStats });
    } else {
      const settingsDocRef = doc(db, user.id, "settings");
      await updateDoc(settingsDocRef, {
        statistics: updatedStats,
      }).then(() => {
        openNotification(`${stat.name} Stat Window successfully updated!`);
        updateSettings();
      });
    }
  };
  const deleteStat = async function (stat) {
    const updatedStats = userSettings.statistics.filter(
      (st) => st.id !== stat.id
    );
    if (user.demoMode) {
      setUserSettings({ ...userSettings, statistics: updatedStats });
    } else {
      const settingsDocRef = doc(db, user.id, "settings");
      await updateDoc(settingsDocRef, {
        statistics: updatedStats,
      }).then(() => {
        openNotification(`${stat.name} Stat Window successfully updated!`);
        updateSettings();
      });
    }
  };

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

  useEffect(() => {
    const sortedStats = userSettings.statistics.sort(
      (a, b) => a.order - b.order
    );
    if (userSettings.statistics) {
      setWindowOrder(sortedStats);
    }
  }, [userSettings]);

  useEffect(() => {
    let unsubscribe = null;
    async function subscribeToSettingsUpdates() {
      const settingsDocRef = doc(db, user.id, "settings");
      unsubscribe = await onSnapshot(settingsDocRef, (set) => {
        console.log("Updating stats...");
        updateSettings();
      });
    }
    subscribeToSettingsUpdates();

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
          >
            <AddIcon />
          </Fab>
          <Box sx={commonWindowSize}>
            {popupOpen ? (
              <NewStatPopup
                open={popupOpen}
                closeFn={closePopup}
                selectedWindow={currentWindow}
                uploadNewStat={uploadNewStat}
                editMode={editModeOn}
                updateStat={updateStat}
              />
            ) : null}
            <DbElementDeletePopup
              isOpen={deletePopupOpen}
              close={closeDeletePopup}
              item={{ item: currentWindow, itemType: "stat" }}
              deleteStat={deleteStat}
            />
            {windowOrder.length === 0 ? <NoStatsText /> : null}
            <DraggableStatWindowList onSortEnd={onSortEnd} pressDelay={200}>
              <div>
                {windowOrder.map((wd, i) => (
                  <DraggableStatWindow
                    key={i}
                    data={wd}
                    index={i}
                    openEditPopup={openPopup}
                    openDeletePopup={openDeletePopup}
                  />
                ))}
              </div>
            </DraggableStatWindowList>
          </Box>
          <Footer />
        </Fragment>
      ) : (
        <LoadingElement />
      )}
    </Scrollbars>
  );
}

export default memo(Statistics);

//В этом и в других компонентах, где имеются графики, нужно добавить Мемо, чтобы они не дёргались и не перерендеривались
//Не видно надписи Made by Etcetera, возможно, из-за DnD
