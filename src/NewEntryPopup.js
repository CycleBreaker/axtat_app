import React, { Fragment, forwardRef, useState, useContext } from "react";
import { TransitionGroup } from "react-transition-group";
//MUI elements
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
//Icons
import SendIcon from "@mui/icons-material/Send";
//Calendar
import Calendar from "react-calendar";
import "./calendarStyling.css";
//Contexts
import { ThemeContext } from "./contexts/ThemeContext";
import { UserDataContext } from "./contexts/UserDataContext";
//Helpers
import { dateFormat } from "./config";
import { textInput } from "./helpers/customHooks";

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

//Input components
const SpendingInput = function (prps) {
  const { tags, chosenTags, inputTags } = prps;
  return (
    <div style={formSpacing}>
      <Autocomplete
        multiple
        options={tags.map((tg) => tg.name)}
        getOptionLabel={(option) => option}
        defaultValue={[tags[0].name]}
        fullWidth
        value={chosenTags.map((tg) => tg.name)}
        onChange={inputTags}
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
        fullWidth
        options={["Food", "Transportation", "Life"]}
        value={"Food"}
        renderInput={(params) => <TextField {...params} label="Group" />}
      />
      <Autocomplete
        disablePortal
        fullWidth
        options={["Home-cooked", "Alcohol", "Gas"]}
        value={"Gas"}
        renderInput={(params) => <TextField {...params} label="Item" />}
      />
    </div>
  );
};

const IncomeInput = (prps) => (
  <div style={formSpacing}>
    <Autocomplete
      disablePortal
      options={["Salary", "Business", "Tips"]}
      fullWidth
      value={"Business"}
      renderInput={(params) => <TextField {...params} label="Sources" />}
    />
  </div>
);

export default function NewEntryPopup(props) {
  const { open, closeFn, editMode } = props;
  //Contexts
  const { userSettings } = useContext(UserDataContext);
  //Theming
  const { isLightTheme } = useContext(ThemeContext);

  //Entry mode
  const [spendingMode, setSpendingMode] = useState(true);
  const selectSpendingMode = () => {
    setSpendingMode(true);
    setFormInput({ ...formInput, isSpending: true });
  };
  const selectIncomeMode = () => {
    setSpendingMode(false);
    setFormInput({ ...formInput, isSpending: false });
  };

  //Calendar functionality
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = () => setCalendarOpen(true);
  const closeCalendar = () => setCalendarOpen(false);
  const setCurrentDate = () => setFormInput({ ...formInput, date: new Date() });
  const pickDate = (dt) => setFormInput({ ...formInput, date: dt.getTime() });

  //Form filling
  const [formInput, setFormInput] = useState({
    isSpending: true,
    date: new Date(),
    sum: "",
    tags: [userSettings.tags[0]],
    group: userSettings?.groups[0],
    item: userSettings?.items[0],
    source: userSettings?.sources[0],
    comment: "",
  });
  const inputSum = (e) => {
    const replacedSymbols = e.target.value.replace(/\D+/g, "");
    setFormInput({ ...formInput, sum: replacedSymbols });
  };
  const inputTags = (e, v) => {
    console.log(v);
    setFormInput({
      ...formInput,
      tags: [(v.map = (tg) => tg.name)],
    });
  };

  return (
    <Fragment>
      <Dialog
        open={calendarOpen}
        TransitionComponent={ZoomTransition}
        onClose={closeCalendar}
        sx={{ zIndex: 2000 }}
      >
        <Calendar
          maxDate={new Date()}
          defaultValue={new Date(formInput.date)}
          onChange={pickDate}
          className={
            isLightTheme
              ? null
              : "react-calendar-dark react-calendar-dark__navigation react-calendar-dark__navigation button:enabled:hover react-calendar-dark__navigation button:enabled:focus react-calendar-dark__month-view__days__day--weekend react-calendar-dark__month-view__days__day--neighboringMonth react-calendar-dark__tile:disabled react-calendar-dark__tile:enabled:hover react-calendar-dark__tile:enabled:focus react-calendar-dark__tile--now react-calendar-dark__tile--now:enabled:hover react-calendar-dark__tile--now:enabled:focus react-calendar-dark__tile--hasActive react-calendar-dark__tile--hasActive:enabled:hover react-calendar-dark__tile--hasActive:enabled:focus react-calendar-dark__tile--active react-calendar-dark__tile--active:enabled:hover react-calendar-dark__tile--active:enabled:focus react-calendar-dark--selectRange react-calendar__tile--hover"
          }
        />
      </Dialog>
      <Dialog
        open={open}
        TransitionComponent={SlideTransition}
        onClose={closeFn}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            {editMode ? "Edit Entry" : "Add new Entry"}
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
              <Grid
                container
                spacing={1}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Grid item xs={12} sm={5} sx={{ width: "100%" }}>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={new Intl.DateTimeFormat("en-IE", dateFormat).format(
                      formInput.date
                    )}
                    sx={{ textAlign: "center" }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button variant="outlined" onClick={setCurrentDate}>
                    Today
                  </Button>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button variant="contained" onClick={openCalendar}>
                    Pick date
                  </Button>
                </Grid>
              </Grid>
              <TextField
                label="Sum"
                variant="outlined"
                inputProps={{ maxLength: 7 }}
                value={formInput.sum}
                onChange={inputSum}
                autoFocus
              />
              <TransitionGroup style={{ width: "100%" }}>
                {!spendingMode && (
                  <Collapse key={"incomeInput"}>
                    <IncomeInput />
                  </Collapse>
                )}
                {spendingMode && (
                  <Collapse key={"spendingInput"}>
                    <SpendingInput
                      tags={userSettings.tags}
                      chosenTags={formInput.tags}
                      inputTags={inputTags}
                    />
                  </Collapse>
                )}
              </TransitionGroup>
              <TextField
                label="Notes"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 75 }}
              />
              <Button
                //type="submit"
                size="large"
                sx={{ p: 2 }}
                variant="contained"
                endIcon={<SendIcon />}
                onClick={() => console.log(formInput.tags)}
              >
                {editMode ? "Update" : "Record"}
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
