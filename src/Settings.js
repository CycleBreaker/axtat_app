import React, { useState, useContext, memo } from "react";
//App components
import DbElementPopup from "./DbElementPopup";
import DbElementDeletePopup from "./DbElementDeletePopup";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { TransitionContext } from "./contexts/TransitionContext";
import { SettingsContext } from "./contexts/SettingsContext";
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
//MUI icons
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddCardIcon from "@mui/icons-material/AddCard";
//Transition animation
import { motion } from "framer-motion";
//Currency list
import { currencies } from "./config";

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
  const setDeleteElements = function () {
    setItemToDelete({ item: prps.element, itemType: prps.elementType });
    openDeletePopup();
  };
  return (
    <IconButton
      onClick={setDeleteElements}
      element={prps.element}
      elementType={prps.elementType}
    >
      <DeleteIcon color={prps.isLightTheme ? "primary" : "info"} />
    </IconButton>
  );
};

const ElementEditRow = (prps) => (
  <Grid container spacing={2} sx={{ position: "relative", pb: 2 }}>
    <Grid
      item
      xs={12}
      sm={4}
      sx={
        prps.mobileResolution
          ? { textAlign: "center", width: "100%" }
          : { pl: 2, width: "100%" }
      }
    >
      <Typography variant="h6">{prps.title}</Typography>
    </Grid>
    <Grid
      item
      xs={6}
      sm={4}
      sx={
        prps.mobileResolution
          ? { width: "50%", textAlign: "center" }
          : { textAlign: "center" }
      }
    >
      <Select value={prps.list[1]} sx={{ transform: "translateY(-10px)" }}>
        {prps.list.map((tg) => (
          <MenuItem key={tg} value={tg}>
            {tg}
          </MenuItem>
        ))}
      </Select>
    </Grid>
    <Grid
      item
      xs={6}
      sm={4}
      sx={
        prps.mobileResolution
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
        <IconButton onClick={prps.openDbElementPopup}>
          <AddBoxIcon color={prps.isLightTheme ? "primary" : "info"} />
        </IconButton>
        <IconButton onClick={prps.openDbElementPopup}>
          <EditIcon color={prps.isLightTheme ? "primary" : "info"} />
        </IconButton>
        <DeleteButtonSubComponent
          elementType={prps.title.slice(0, -1)}
          element={prps.selectedElements[prps.title.slice(0, -1).toLowerCase()]}
          isLightTheme={prps.isLightTheme}
        />
      </Stack>
    </Grid>
  </Grid>
);

function Settings() {
  //Contexts
  const { mobileResolution, commonWindowSize } = useContext(ResolutionContext);
  const { isLightTheme, switchTheme } = useContext(ThemeContext);
  const { transition } = useContext(TransitionContext);
  const { chosenCurrency, setChosenCurrency } = useContext(SettingsContext);
  //Selected elements state
  const [selectedElements, setSelectedElements] = useState({
    tag: "Family",
    group: "Transportation",
    item: "Gas",
    source: "Business",
  });
  //Edit and create DB element popup controls
  const [dbElementPopupOpen, setDbElementPopupOpen] = useState(false);
  const openDbElementPopup = () => setDbElementPopupOpen(true);
  const closeDbElementPopup = () => setDbElementPopupOpen(false);
  //Delete DB element popup controls
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const openDeletePopup = () => setDeletePopupOpen(true);
  const closeDeletePopup = () => setDeletePopupOpen(false);
  const [itemToDelete, setItemToDelete] = useState({ item: "", itemType: "" });
  const closeDeletePopupAndClear = function () {
    closeDeletePopup();
    setItemToDelete({ item: "", itemType: "" });
  };

  //Temporary database elements
  const tempTags = ["Me", "Family", "Woman"];
  const tempGroups = ["Food", "Transportation", "Presents"];
  const tempItems = ["Home-Cooked", "Gas", "Personal"];
  const tempSources = ["Salary", "Business", "Tips"];
  //Temporary DB Element Popup options
  const tempOptions = {
    editMode: false,
    elementType: "Group",
    elementName: "Food",
  };

  return (
    <motion.div
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
    >
      <DbElementPopup
        isOpen={dbElementPopupOpen}
        close={closeDbElementPopup}
        options={tempOptions}
      />
      <DbElementDeletePopup
        isOpen={deletePopupOpen}
        close={closeDeletePopupAndClear}
        item={itemToDelete.item}
        itemType={itemToDelete.itemType}
      />
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
                options={Object.values(currencies).map(
                  (val) => `${val.name} (${val.symbol})`
                )}
                fullWidth
                value={`${chosenCurrency.name} (${chosenCurrency.symbol})`}
                renderInput={(params) => (
                  <TextField {...params} label="Currency" />
                )}
              />
            </Stack>
          </MyBox>
          <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
            <CreditCardIcon sx={{ transform: "translate(-4px, 4px)" }} />
            <Typography variant="h5">Database elements: spending</Typography>
          </Stack>
          <MyDivider />
          <MyBox>
            <ElementEditRow
              title="Tags"
              list={tempTags}
              mobileResolution={mobileResolution}
              openDbElementPopup={openDbElementPopup}
              isLightTheme={isLightTheme}
              selectedElements={selectedElements}
            />
            <ElementEditRow
              title="Groups"
              list={tempGroups}
              mobileResolution={mobileResolution}
              openDbElementPopup={openDbElementPopup}
              isLightTheme={isLightTheme}
              selectedElements={selectedElements}
            />
            <ElementEditRow
              title="Items"
              list={tempItems}
              mobileResolution={mobileResolution}
              openDbElementPopup={openDbElementPopup}
              isLightTheme={isLightTheme}
              selectedElements={selectedElements}
            />
          </MyBox>
          <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
            <AddCardIcon sx={{ transform: "translate(-4px, 4px)" }} />
            <Typography variant="h5">Database elements: income</Typography>
          </Stack>
          <MyDivider />
          <MyBox>
            <ElementEditRow
              title="Sources"
              list={tempSources}
              mobileResolution={mobileResolution}
              openDbElementPopup={openDbElementPopup}
              isLightTheme={isLightTheme}
              selectedElements={selectedElements}
            />
          </MyBox>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default memo(Settings);

// Компонентам ElementEditRow передаются props под названием options по примеру tempOptions. Эти опции передаются всплывающему окну как props.
