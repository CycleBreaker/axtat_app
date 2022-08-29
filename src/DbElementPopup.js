import React, {
  Fragment,
  forwardRef,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
//Contexts
import { ThemeContext } from "./contexts/ThemeContext";
import { UserDataContext } from "./contexts/UserDataContext";
//Helpers
import { colorSet } from "./config";
import { textInput } from "./helpers/customHooks";
//MUI elements
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
//Icon and color pickers
import Picker from "emoji-picker-react";
import { GithubPicker as ColorPicker } from "react-color";

//Transition animations
const SlideTransition = forwardRef(function SlideTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ZoomTransition = forwardRef(function ZoomTransition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

//Styling
const formSpacing = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

export default function DbElementPopup(props) {
  const { isOpen, close, options, uploadNewDbElement, updateDbElement } = props;
  const { isLightTheme } = useContext(ThemeContext);
  const { userSettings } = useContext(UserDataContext);

  //User input
  const [inputValue, inputHandleChange, inputReset] = textInput(
    options.editMode ? options.elementName : ""
  );
  const handleClose = function () {
    inputReset();
    setChosenColor(isLightTheme ? colorSet[0].light : colorSet[0].dark);
    close();
  };
  //Color
  const [chosenColor, setChosenColor] = useState(
    options.elementType === "tag"
      ? isLightTheme
        ? options.editMode
          ? colorSet.find((clr) => clr.id === options.editedElement.color).light
          : colorSet[0].light
        : options.editMode
        ? colorSet.find((clr) => clr.id === options.editedElement.color).dark
        : colorSet[0].dark
      : null
  );
  const handleColorChange = function (e) {
    setChosenColor(e.hex);
    closeColorPicker();
  };
  //Icon
  const [chosenIcon, setChosenIcon] = useState(
    options.editMode
      ? options.editedElement.icon
      : options.elementType === "group" || options.elementType === "source"
      ? options.elementType === "group"
        ? "😃"
        : "💸"
      : null
  );
  const handleIconChange = function (e) {
    setChosenIcon(e.target.textContent);
    closeSmileyPicker();
  };
  //Parent group
  const [chosenGroup, setChosenGroup] = useState(
    options.editMode
      ? options.editedElement.parent
      : userSettings.groups[0].name
  );
  const handleGroupChange = (e) => setChosenGroup(e.target.textContent);

  //Dialog states
  const [smileyPickerOpen, setSmileyPickerOpen] = useState(false);
  const openSmileyPicker = () => setSmileyPickerOpen(true);
  const closeSmileyPicker = () => setSmileyPickerOpen(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const openColorPicker = () => setColorPickerOpen(true);
  const closeColorPicker = () => setColorPickerOpen(false);
  const [error, setError] = useState(false);

  const handleSubmit = function () {
    console.log("handling submit...");
    switch (options.elementType) {
      case "tag":
        console.log("tag case");
        let foundColorId = 0;
        colorSet.map((clr) => {
          if (
            clr.light === chosenColor.toUpperCase() ||
            clr.dark === chosenColor.toUpperCase()
          ) {
            foundColorId = clr.id;
          }
        });
        if (options.editMode) {
          updateDbElement(
            options.elementType,
            {
              name: inputValue,
              color: foundColorId,
            },
            options.elementName
          );
        } else {
          uploadNewDbElement(options.elementType, {
            name: inputValue,
            color: foundColorId,
          });
        }
        break;
      case "group":
        console.log("group case");
        if (options.editMode) {
          updateDbElement(
            options.elementType,
            { name: inputValue, icon: chosenIcon },
            options.editedElement.name
          );
        } else {
          uploadNewDbElement(options.elementType, {
            name: inputValue,
            icon: chosenIcon,
          });
        }
        break;
      case "item":
        console.log("item case");
        if (options.editMode) {
          updateDbElement(
            options.elementType,
            {
              name: inputValue,
              parent: chosenGroup,
            },
            options.editedElement.name
          );
        } else {
          uploadNewDbElement(options.elementType, {
            name: inputValue,
            parent: chosenGroup,
          });
        }
        break;
      case "source":
        console.log("source case");
        if (options.editMode) {
          updateDbElement(
            options.elementType,
            { name: inputValue, icon: chosenIcon },
            options.editedElement.name
          );
        } else {
          uploadNewDbElement(options.elementType, {
            name: inputValue,
            icon: chosenIcon,
          });
        }
        break;
    }
    handleClose();
  };

  useEffect(function () {
    setError(false);
    userSettings[options.elementType + "s"].map((el) => {
      if (el.name === inputValue) {
        setError(true);
        if (options.editMode && inputValue === options.elementName) {
          setError(false);
        }
      }
    });
    /*
    if (options.elementType === "group") {
      userSettings.groups.map((gr) => {
        if (gr !== chosenGroup) {
          setError(true);
        }
      });
    }
    */
  });

  return (
    <Fragment>
      <Dialog
        open={smileyPickerOpen}
        TransitionComponent={ZoomTransition}
        onClose={closeSmileyPicker}
        sx={{ zIndex: 2000 }}
      >
        <Picker
          native={true}
          disableAutoFocus
          onEmojiClick={handleIconChange}
        />
      </Dialog>
      <Dialog
        open={colorPickerOpen}
        TransitionComponent={ZoomTransition}
        onClose={closeColorPicker}
        sx={{ zIndex: 2000 }}
      >
        <ColorPicker
          colors={
            isLightTheme
              ? colorSet.map((clr) => clr.light)
              : colorSet.map((clr) => clr.dark)
          }
          width="162px"
          onChange={handleColorChange}
        />
      </Dialog>
      <Dialog
        open={isOpen}
        TransitionComponent={SlideTransition}
        onClose={handleClose}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            {options.editMode
              ? `Edit ${options.elementName} `
              : "Create a new "}
            {options.elementType}
          </Typography>
          <DialogContent>
            <form style={formSpacing}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                inputProps={{ maxLength: 14 }}
                value={inputValue}
                onChange={inputHandleChange}
                error={error}
                helperText={
                  error
                    ? `Such ${options.elementType} name already exists`
                    : null
                }
              />
              {options.elementType === "item" ? (
                <Autocomplete
                  fullWidth
                  options={userSettings.groups.map((gr) => gr.name)}
                  value={chosenGroup}
                  onChange={handleGroupChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Parent group" />
                  )}
                  disableClearable
                />
              ) : null}
              {options.elementType === "group" ||
              options.elementType === "source" ? (
                <Stack direction="row" spacing={1}>
                  <Typography variant="h6">Icon:</Typography>
                  <IconButton
                    sx={{ transform: "translateY(-9px)" }}
                    onClick={openSmileyPicker}
                  >
                    {chosenIcon}
                  </IconButton>
                </Stack>
              ) : null}
              {options.elementType === "tag" ? (
                <Stack direction="row" spacing={1}>
                  <Typography variant="h6">Color:</Typography>
                  <IconButton
                    sx={{ transform: "translateY(-9px)" }}
                    onClick={openColorPicker}
                  >
                    <Box
                      sx={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: chosenColor,
                      }}
                    />
                  </IconButton>
                </Stack>
              ) : null}
              <Button
                size="large"
                sx={{ p: 2 }}
                variant="contained"
                disabled={inputValue === "" || error}
                onClick={handleSubmit}
              >
                {options.editMode ? "Done" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  );
}
