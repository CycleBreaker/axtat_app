import React, { Fragment, useState, useContext, useEffect, memo } from "react";
//App components
import DbElementPopup from "./DbElementPopup";
import DbElementDeletePopup from "./DbElementDeletePopup";
import LoadingElement from "./LoadingElement";
import Footer from "./Footer";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { UserDataContext } from "./contexts/UserDataContext";
//MUI elements
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
//MUI icons
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddCardIcon from "@mui/icons-material/AddCard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
//Currency list
import { currencies } from "./config";
//Custom scrollbar
import { Scrollbars } from "react-custom-scrollbars-2";
//Firebase
import { db } from "./firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

//Menu components
const MyDivider = () => <Divider variant="middle" sx={{ mb: 4 }} />;

const MyBox = (prps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      p: "0 10px",
    }}
  >
    {prps.children}
  </Box>
);

const DeleteButtonSubComponent = function (prps) {
  const { element, elementType, setItemToDelete, openDeletePopup } = prps;
  const setDeleteElements = function () {
    setItemToDelete({ item: element, itemType: elementType });
    openDeletePopup();
  };
  return (
    <IconButton onClick={setDeleteElements}>
      <DeleteIcon color={prps.isLightTheme ? "primary" : "info"} />
    </IconButton>
  );
};

const ElementEditRow = function (prps) {
  const {
    mobileResolution,
    title,
    list,
    openDbElementPopup,
    isLightTheme,
    selectedElements,
    setSelectedElements,
    setItemToDelete,
    openDeletePopup,
    setOptions,
  } = prps;
  const { userSettings } = useContext(UserDataContext);

  const elementKey = title.toLowerCase().slice(0, -1);

  const handleChange = (e) => {
    setSelectedElements({ ...selectedElements, [elementKey]: e.target.value });
  };
  const handleAddNewPopupOpen = function () {
    setOptions({
      editMode: false,
      elementType: elementKey,
      elementName: selectedElements[elementKey],
      editedElement: null,
    });
    openDbElementPopup();
  };

  const handleEditPopupOpen = function () {
    setOptions({
      editMode: true,
      elementType: elementKey,
      elementName: selectedElements[elementKey],
      editedElement: userSettings[elementKey + "s"].find(
        (el) => el.name === selectedElements[elementKey]
      ),
    });
    openDbElementPopup();
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative", pb: 2 }}>
      <Grid
        item
        xs={12}
        sm={4}
        sx={
          mobileResolution
            ? { textAlign: "center", width: "100%" }
            : { pl: 2, width: "100%" }
        }
      >
        <Typography variant="h6">{title}</Typography>
      </Grid>
      <Grid
        item
        xs={6}
        sm={4}
        sx={
          mobileResolution
            ? { width: "50%", textAlign: "center" }
            : { textAlign: "center" }
        }
      >
        <Select
          value={selectedElements[elementKey]}
          sx={{ transform: "translateY(-10px)" }}
          onChange={handleChange}
        >
          {list?.map((tg) => (
            <MenuItem key={tg.name} value={tg.name}>
              {tg.name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid
        item
        xs={6}
        sm={4}
        sx={
          mobileResolution
            ? {
                width: "50%",
                display: "flex",
                justifyContent: "space-around",
                transform: "translateY(-10px)",
              }
            : {
                position: "absolute",
                right: 0,
              }
        }
      >
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleAddNewPopupOpen}>
            <AddBoxIcon color={isLightTheme ? "primary" : "info"} />
          </IconButton>
          <IconButton onClick={handleEditPopupOpen}>
            <EditIcon color={isLightTheme ? "primary" : "info"} />
          </IconButton>
          <DeleteButtonSubComponent
            elementType={title.slice(0, -1)}
            element={selectedElements[title.slice(0, -1).toLowerCase()]}
            isLightTheme={isLightTheme}
            setItemToDelete={setItemToDelete}
            openDeletePopup={openDeletePopup}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

function Settings() {
  //Contexts
  const { mobileResolution, commonWindowSize } = useContext(ResolutionContext);
  const { isLightTheme, switchTheme } = useContext(ThemeContext);
  const { logout, user, userSettings, updateSettings } =
    useContext(UserDataContext);
  //Selected elements state
  const [selectedCurrency, setSelectedCurrency] = useState(
    userSettings.currency
  );
  const [selectedElements, setSelectedElements] = useState({
    tag: userSettings.tags[0].name,
    group: userSettings.groups[0].name,
    item: userSettings.items[0].name,
    source: userSettings.sources[0].name,
  });
  const handleCurrencySelect = async function (e, v) {
    console.log("userSettings: ", userSettings.currency, "value: ", v);
    setSelectedCurrency(v);
    const settingsDocRef = doc(db, user.id, "settings");
    await updateDoc(settingsDocRef, { currency: v }).then(() => {
      openNotification("Preferred currency updated");
      console.log(userSettings.currency);
    });
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

  //Edit and create DB element popup controls
  const [dbElementPopupOpen, setDbElementPopupOpen] = useState(false);
  const openDbElementPopup = () => setDbElementPopupOpen(true);
  const closeDbElementPopup = () => setDbElementPopupOpen(false);
  const [dbElementPopupOptions, setDbElementPopupOptions] = useState({
    editMode: false,
    elementType: "tag",
    elementName: userSettings.tags[0].name,
    editedElement: null,
  });

  //Delete DB element popup controls
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const openDeletePopup = () => setDeletePopupOpen(true);
  const closeDeletePopup = () => setDeletePopupOpen(false);
  const [itemToDelete, setItemToDelete] = useState({ item: "", itemType: "" });
  const closeDeletePopupAndClear = function () {
    closeDeletePopup();
    setItemToDelete({ item: "", itemType: "" });
  };
  //Spending elements lists for mapping
  const spendingElementNames = ["Tags", "Groups", "Items"];
  const spendingElementArrays = [
    userSettings.tags,
    userSettings.groups,
    userSettings.items,
  ];

  //Update settings
  const receiveUpdatedSettings = function (updSettings) {
    //TODO: add an error message if there's a problem with getting a snapshot
    setChosenCurrency(updSettings.data().currency);
  };
  const uploadNewDbElement = async function (type, elt) {
    console.log("firing uploadNewDbElement()");
    const settingsDocRef = doc(db, user.id, "settings");
    console.log(elt);
    await updateDoc(settingsDocRef, {
      [type + "s"]: [...userSettings[type + "s"], elt],
    }).then(() => {
      openNotification(`${elt.name} ${type} successfully added!`);
    });
    updateSettings();
  };
  const updateDbElement = async function (type, elt, prevName) {
    const settingsDocRef = doc(db, user.id, "settings");
    const elementIndex = userSettings[type + "s"].findIndex(
      (fd) => fd.name === prevName
    );
    const newElementArray = userSettings[type + "s"];
    newElementArray[elementIndex] = elt;
    await updateDoc(settingsDocRef, {
      [type + "s"]: newElementArray,
    }).then(() => {
      setSelectedElements({ ...selectedElements, [type]: elt.name });
      openNotification(
        `${type.charAt(0).toUpperCase() + type.slice(1)} successfully updated!`
      );
    });
    updateSettings();
  };
  const deleteDbElement = async function (type, elt) {
    const settingsDocRef = doc(db, user.id, "settings");
    const filteredList = userSettings[type + "s"].filter(
      (el) => el.name !== elt
    );
    await updateDoc(settingsDocRef, { [type + "s"]: filteredList }).then(() => {
      setSelectedElements({
        ...selectedElements,
        [type]: userSettings[type + "s"][0].name,
      });
      console.log(
        "selectedElements",
        selectedElements,
        "selectedElements[type]",
        selectedElements[type],
        userSettings[type + "s"][0].name
      );
      openNotification(`${elt} ${type} successfully deleted!`);
    });
    updateSettings();
  };

  useEffect(() => {
    //setChosenCurrency(userSettings.currency); //TODO: get all the settings on mount and call receiveUpdatedSettings()
    let unsubscribe = null;
    async function subscribeToSettingsUpdates() {
      const settingsDocRef = doc(db, user.id, "settings");
      unsubscribe = await onSnapshot(settingsDocRef, (set) => {
        console.log("update");
        updateSettings();
        setSelectedCurrency(userSettings.currency);
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
          {dbElementPopupOpen && (
            <DbElementPopup
              isOpen={dbElementPopupOpen}
              close={closeDbElementPopup}
              options={dbElementPopupOptions}
              uploadNewDbElement={uploadNewDbElement}
              updateDbElement={updateDbElement}
            />
          )}
          {deletePopupOpen && (
            <DbElementDeletePopup
              isOpen={deletePopupOpen}
              close={closeDeletePopupAndClear}
              item={itemToDelete}
              deleteDbElement={deleteDbElement}
            />
          )}
          <Box sx={commonWindowSize}>
            <Paper elevation={3}>
              <Typography sx={{ textAlign: "center", pt: 2 }} variant="h4">
                Settings
              </Typography>
              <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
                <PaletteIcon sx={{ transform: "translate(-4px, 4px)" }} />
                <Typography variant="h5">Theme and currency</Typography>
              </Stack>
              <MyDivider />
              <MyBox>
                <Stack direction="row" spacing={1}>
                  <Typography sx={{ transform: "translateY(7px)" }}>
                    Dark theme
                  </Typography>
                  <Switch checked={!isLightTheme} onChange={switchTheme} />
                </Stack>
                <Stack
                  direction={mobileResolution ? "column" : "row"}
                  spacing={1}
                  sx={{ width: mobileResolution ? "100%" : "50%" }}
                >
                  <Typography
                    sx={
                      mobileResolution
                        ? { textAlign: "center" }
                        : { transform: "translateY(15px)" }
                    }
                  >
                    Currency
                  </Typography>
                  <Autocomplete
                    disablePortal
                    options={Object.values(currencies).map((val) => val)} //Object.values(currencies).map((val) => `${val.name} (${val.symbol})`)
                    getOptionLabel={(val) => `${val.name} (${val.symbol})`}
                    fullWidth
                    value={userSettings.currency}
                    onChange={handleCurrencySelect}
                    renderInput={(params) => (
                      <TextField {...params} label="Currency" />
                    )}
                    disableClearable
                  />
                </Stack>
              </MyBox>
              <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
                <CreditCardIcon sx={{ transform: "translate(-4px, 4px)" }} />
                <Typography variant="h5">
                  Database elements: spending
                </Typography>
              </Stack>
              <MyDivider />
              <MyBox>
                {spendingElementNames.map((el, ar) => (
                  <ElementEditRow
                    key={el}
                    title={el}
                    list={spendingElementArrays[ar]}
                    mobileResolution={mobileResolution}
                    openDbElementPopup={openDbElementPopup}
                    isLightTheme={isLightTheme}
                    selectedElements={selectedElements}
                    setSelectedElements={setSelectedElements}
                    setItemToDelete={setItemToDelete}
                    openDeletePopup={openDeletePopup}
                    setOptions={setDbElementPopupOptions}
                  />
                ))}
              </MyBox>
              <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
                <AddCardIcon sx={{ transform: "translate(-4px, 4px)" }} />
                <Typography variant="h5">Database elements: income</Typography>
              </Stack>
              <MyDivider />
              <MyBox>
                <ElementEditRow
                  title="Sources"
                  list={userSettings.sources}
                  mobileResolution={mobileResolution}
                  openDbElementPopup={openDbElementPopup}
                  isLightTheme={isLightTheme}
                  selectedElements={selectedElements}
                  setSelectedElements={setSelectedElements}
                  setItemToDelete={setItemToDelete}
                  openDeletePopup={openDeletePopup}
                  setOptions={setDbElementPopupOptions}
                />
              </MyBox>
              <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
                <ManageAccountsIcon
                  sx={{ transform: "translate(-4px, 4px)" }}
                />
                <Typography variant="h5">Account: {user.name}</Typography>
              </Stack>
              <MyDivider />
              <MyBox>
                <Button variant="outlined" sx={{ mb: 2 }} onClick={logout}>
                  Log out
                </Button>
              </MyBox>
            </Paper>
          </Box>
          <Footer />
        </Fragment>
      ) : (
        <LoadingElement />
      )}
    </Scrollbars>
  );
}

export default memo(Settings);

// Компонентам ElementEditRow передаются props под названием options по примеру tempOptions. Эти опции передаются всплывающему окну как props.
