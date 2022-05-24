import { Fragment, forwardRef, useState } from "react";
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
import ButtonGroup from "@mui/material/ButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
//Icons
import SendIcon from "@mui/icons-material/Send";
//Calendar
import Calendar from "react-calendar";
import "./calendarStyling.css";

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
  gap: "15px",
};

export default function NewEntryPopup(props) {
  const { open, closeFn } = props;

  //Entry mode
  const [spendingMode, setSpendingMode] = useState(true);
  const selectSpendingMode = () => setSpendingMode(true);
  const selectIncomeMode = () => setSpendingMode(false);

  //Calendar functionality
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = () => setCalendarOpen(true);
  const closeCalendar = () => setCalendarOpen(false);

  return (
    <Fragment>
      <Dialog
        open={calendarOpen}
        TransitionComponent={ZoomTransition}
        keepMounted
        onClose={closeCalendar}
        sx={{ zIndex: 2000 }}
      >
        <Calendar selectRange />
      </Dialog>
      <Dialog
        open={open}
        TransitionComponent={SlideTransition}
        keepMounted
        onClose={closeFn}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Add new Entry
          </Typography>
          <DialogContent sx={formSpacing}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button
                variant={spendingMode ? "contained" : "outlined"}
                onClick={selectSpendingMode}
              >
                Spending
              </Button>
              <Button
                variant={spendingMode ? "outlined" : "contained"}
                onClick={selectIncomeMode}
              >
                Income
              </Button>
            </ButtonGroup>
            <form style={formSpacing}>
              <Stack direction="row" spacing={1}>
                <TextField label="Date" variant="standard" />
                <Button variant="outlined">Today</Button>
                <Button variant="contained" onClick={openCalendar}>
                  Pick date
                </Button>
              </Stack>
              <TextField label="Sum" variant="outlined" />
              <div style={spendingMode ? formSpacing : { display: "none" }}>
                <Autocomplete
                  multiple
                  options={["Me", "Family", "Business", "Leisure"]}
                  getOptionLabel={(option) => option}
                  defaultValue={["Me"]}
                  fullWidth
                  value={["Me"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Tags"
                      placeholder="Start typing..."
                      fullWidth
                    />
                  )}
                />
                <Autocomplete
                  disablePortalfullWidth
                  fullWidth
                  options={["Food", "Transportation", "Life"]}
                  value={"Food"}
                  renderInput={(params) => (
                    <TextField {...params} label="Group" />
                  )}
                />
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={["Home-cooked", "Alcohol", "Gas"]}
                  value={"Gas"}
                  renderInput={(params) => (
                    <TextField {...params} label="Item" />
                  )}
                />
              </div>
              <Autocomplete
                disablePortal
                options={["Salary", "Business", "Tips"]}
                fullWidth
                value={"Business"}
                renderInput={(params) => (
                  <TextField {...params} label="Sources" />
                )}
                sx={spendingMode ? { display: "none" } : null}
              />
              <TextField label="Notes" fullWidth variant="outlined" />
              <Button
                type="submit"
                size="large"
                sx={{ p: 2 }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Record
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  );
}

//Во всех Autocomplete не хватает параметров onChange, в его TextField - error и helperText
//В целом, не забудь про валидацию и вращающуюся иконку отправки
//Также попробовать добавить переход TransitionGroup Collapse, но для этого нужно в самом деле mount'ить и unmount'ить компоненты
