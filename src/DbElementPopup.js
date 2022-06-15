import React, { Fragment, forwardRef, useState, useContext } from "react";
//Contexts
import { ThemeContext } from "./contexts/ThemeContext";
//Helpers
import { tagColorSetLight, tagColorSetDark } from "./config";
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
  const { isOpen, close, options } = props;
  const { isLightTheme } = useContext(ThemeContext);

  //Dialog states
  const [smileyPickerOpen, setSmileyPickerOpen] = useState(false);
  const openSmileyPicker = () => setSmileyPickerOpen(true);
  const closeSmileyPicker = () => setSmileyPickerOpen(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const openColorPicker = () => setColorPickerOpen(true);
  const closeColorPicker = () => setColorPickerOpen(false);

  return (
    <Fragment>
      <Dialog
        open={smileyPickerOpen}
        TransitionComponent={ZoomTransition}
        keepMounted
        mountOnEnter
        unmountOnExit
        onClose={closeSmileyPicker}
        sx={{ zIndex: 2000 }}
      >
        <Picker disableAutoFocus={true} native={true} />
      </Dialog>
      <Dialog
        open={colorPickerOpen}
        TransitionComponent={ZoomTransition}
        keepMounted
        mountOnEnter
        unmountOnExit
        onClose={closeColorPicker}
        sx={{ zIndex: 2000 }}
      >
        <ColorPicker
          colors={isLightTheme ? tagColorSetLight : tagColorSetDark}
          width="162px"
        />
      </Dialog>
      <Dialog
        open={isOpen}
        TransitionComponent={SlideTransition}
        keepMounted
        onClose={close}
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
              />
              {options.elementType === "Item" ? (
                <Autocomplete
                  fullWidth
                  options={["Transportaion", "Food", "Life"]}
                  value={"Transportaion"}
                  renderInput={(params) => (
                    <TextField {...params} label="Parent group" />
                  )}
                />
              ) : null}
              {options.elementType === "Group" ||
              options.elementType === "Source" ? (
                <Stack direction="row" spacing={1}>
                  <Typography variant="h6">Icon:</Typography>
                  <IconButton
                    sx={{ transform: "translateY(-9px)" }}
                    onClick={openSmileyPicker}
                  >
                    😀
                  </IconButton>
                </Stack>
              ) : null}
              {options.elementType === "Tag" ? (
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
                        backgroundColor: "red",
                      }}
                    />
                  </IconButton>
                </Stack>
              ) : null}
              <Button
                type="submit"
                size="large"
                sx={{ p: 2 }}
                variant="contained"
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
