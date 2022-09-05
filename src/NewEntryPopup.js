import React, {
  Fragment,
  forwardRef,
  useState,
  useContext,
  useEffect,
} from "react";
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
import { usePrevious } from "./helpers/customHooks";

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
  const {
    userSettings,
    formInput,
    itemListOfGroup,
    inputTags,
    inputGroup,
    inputItem,
    groupChanged,
    filteredGroups,
  } = prps;

  const handleGroupChange = function (e, v) {
    inputGroup(v);
    groupChanged();
  };

  console.log("itemListOfGroup: ", itemListOfGroup);

  return (
    <div style={formSpacing}>
      <Autocomplete
        multiple
        options={userSettings.tags.map((tg) => tg.name)}
        getOptionLabel={(option) => option}
        defaultValue={[userSettings.tags[0].name]}
        fullWidth
        value={formInput.tags.map((tg) => tg)}
        onChange={inputTags}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Tags"
            placeholder="Start typing..."
            fullWidth
            error={formInput.tags.length === 0}
            helperText={
              formInput.tags.length === 0 ? "Add at least one tag" : ""
            }
          />
        )}
      />
      <Autocomplete
        fullWidth
        onChange={handleGroupChange}
        options={filteredGroups.map((gr) => gr.name)}
        defaultValue={userSettings.groups[0]}
        value={formInput.group}
        renderInput={(params) => <TextField {...params} label="Group" />}
        disableClearable
      />
      <Autocomplete
        disablePortal
        fullWidth
        options={itemListOfGroup.map((itm) => itm.name)}
        defaultValue={itemListOfGroup[0]}
        value={formInput.item}
        onChange={inputItem}
        renderInput={(params) => <TextField {...params} label="Item" />}
        disableClearable
      />
    </div>
  );
};

const IncomeInput = (prps) => (
  <div style={formSpacing}>
    <Autocomplete
      disablePortal
      disableClearable
      options={prps.userSettings.sources.map((src) => src.name)}
      fullWidth
      value={prps.formInput.source}
      onChange={prps.inputSource}
      renderInput={(params) => <TextField {...params} label="Sources" />}
    />
  </div>
);

//In case there are no groups with items, show this instead of SpendingInput
const NoInputElementsError = () => (
  <Box sx={{ p: 2 }}>
    There are no Items that match any of your Groups. Please go to Settings and
    create some.
  </Box>
);

export default function NewEntryPopup(props) {
  const {
    open,
    closeFn,
    editMode,
    currentEntry,
    openNotification,
    createNewEntry,
    editEntry,
  } = props;
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
  const setCurrentDate = () =>
    setFormInput({
      ...formInput,
      date: new Date().getTime(),
    });
  const pickDate = (dt) => setFormInput({ ...formInput, date: dt.getTime() });

  //Form filling
  const [formInput, setFormInput] = useState(
    editMode
      ? currentEntry
      : {
          isSpending: true,
          date: new Date(),
          sum: 100,
          tags: [userSettings.tags[0].name],
          group: userSettings.groups[0].name,
          item: userSettings.items[0].name,
          source: userSettings.sources[0].name,
          comment: "",
        }
  );
  const resetStateAndClose = function () {
    setFormInput({
      isSpending: true,
      date: new Date(),
      sum: 100,
      tags: [userSettings.tags[0].name],
      group: userSettings?.groups[0].name,
      item: userSettings.items[0].name,
      source: userSettings?.sources[0].name,
      comment: "",
    });
    closeFn();
  };
  const inputSum = (e) =>
    setFormInput({
      ...formInput,
      sum: Number(e.target.value.replace(/[^.\d]/g, "")),
    });
  const inputTags = (e, v) =>
    setFormInput({
      ...formInput,
      tags: v,
    });
  const filterGroups = function (gr) {
    let groupHasNoItems = true;
    userSettings.items.map((itm) => {
      if (itm.parent === gr.name) {
        groupHasNoItems = false;
      }
    });
    if (groupHasNoItems) {
      return false;
    } else {
      return true;
    }
  };
  const [filteredGroups, setFilteredGroups] = useState(
    userSettings.groups.filter(filterGroups)
  );
  const inputGroup = function (v) {
    setFormInput({
      ...formInput,
      group: v,
    });
    setItemListOfGroup(userSettings.items.filter((itm) => itm.parent === v));
  };
  const groupChanged = () =>
    setFilteredGroups(userSettings.groups.filter(filterGroups));
  const [itemListOfGroup, setItemListOfGroup] = useState(
    userSettings.items.filter((itm) => itm.parent === formInput.group)
  );
  const inputItem = (e, v) =>
    setFormInput({
      ...formInput,
      item: v,
    });
  const inputSource = (e, v) => setFormInput({ ...formInput, source: v });
  const inputComment = (e) =>
    setFormInput({ ...formInput, comment: e.target.value });

  const prevGroup = usePrevious(formInput.group);
  useEffect(() => {
    if (prevGroup !== formInput.group) {
      inputItem(null, itemListOfGroup[0].name);
      console.log("its different!");
    }
    groupChanged();
  }, [formInput]);

  //Update filtered groups and items & set edited variables:
  useEffect(() => {
    //Update fitered groups and items
    setFilteredGroups(userSettings.groups.filter(filterGroups));
    setItemListOfGroup(
      editMode
        ? [userSettings.items.find((it) => it.parent === currentEntry.group)]
        : userSettings.items.filter((itm) => itm.parent === formInput.group)
    );
    //Set edited variables
    if (currentEntry.isSpending) {
      selectSpendingMode();
    } else {
      selectIncomeMode();
    }
    if (editMode) {
      setFormInput({
        ...currentEntry,
        isSpending: currentEntry.isSpending,
        date: new Date(currentEntry.date),
        sum: currentEntry.sum,
        comment: currentEntry.comment,
        group: currentEntry.group,
        item: currentEntry.item,
      });
    } else {
      setFormInput({
        ...formInput,
        date: new Date(),
        sum: 100,
        tags: [userSettings.tags[0].name],
        group: userSettings.groups[0].name,
        item: userSettings.items[0].name,
        source: userSettings.sources[0].name,
        comment: "",
      });
    }
  }, [open]);

  useEffect(() => console.log("spendingMode: ", spendingMode));

  //Validation and submission
  const handleSubmit = function () {
    console.log("formInput", formInput);
    if (spendingMode) {
      let itemBelongsToGroup = false;
      const theItem = userSettings.items.find(
        (itm) => itm.name === formInput.item
      );
      if (theItem.parent === formInput.group) {
        itemBelongsToGroup = true;
      }
      if (
        formInput.date &&
        formInput.sum &&
        formInput.group &&
        itemBelongsToGroup
      ) {
        console.log("all good - spending");
        if (editMode) {
          console.log("edit mode");
          editEntry({
            ...formInput,
            isSpending: true,
            source: "",
          });
        } else {
          console.log("not edit mode");
          createNewEntry({
            ...formInput,
            isSpending: true,
            source: "",
          });
        }
        closeFn();
      } else {
        openNotification("Something went wrong. Please try again.");
        console.log(
          formInput.date,
          formInput.sum,
          formInput.group,
          itemBelongsToGroup
        );
        closeFn();
      }
    } else {
      if (formInput.date && formInput.sum && formInput.source) {
        console.log("all good - income");
        if (editMode) {
          editEntry({
            ...formInput,
            isSpending: false,
            tags: [],
            group: "",
            item: "",
          });
        } else {
          createNewEntry({
            ...formInput,
            isSpending: false,
            tags: [],
            group: "",
            item: "",
          });
        }
        closeFn();
      } else {
        openNotification("Something went wrong. Please try again.");
        console.log(formInput.date, formInput.sum, formInput.source);
        closeFn();
      }
    }
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
        onClose={resetStateAndClose}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            {editMode ? "Edit Entry" : "Add new Entry"}
          </Typography>
          {filteredGroups.length === 0 && <NoInputElementsError />}
          {filteredGroups.length > 0 && (
            <DialogContent sx={formSpacing}>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
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
                      value={new Intl.DateTimeFormat(
                        "en-IE",
                        dateFormat
                      ).format(formInput.date)}
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
                  error={formInput.sum > 0 ? false : true}
                  helperText={
                    formInput.sum > 0 ? null : "Enter sum higher than 0"
                  }
                />
                <TransitionGroup style={{ width: "100%" }}>
                  {!spendingMode && (
                    <Collapse key={"incomeInput"}>
                      <IncomeInput
                        userSettings={userSettings}
                        formInput={formInput}
                        inputSource={inputSource}
                      />
                    </Collapse>
                  )}
                  {spendingMode && (
                    <Collapse key={"spendingInput"}>
                      <SpendingInput
                        userSettings={userSettings}
                        formInput={formInput}
                        filteredGroups={filteredGroups}
                        itemListOfGroup={itemListOfGroup}
                        inputTags={inputTags}
                        inputGroup={inputGroup}
                        inputItem={inputItem}
                        groupChanged={groupChanged}
                      />
                    </Collapse>
                  )}
                </TransitionGroup>
                <TextField
                  label="Notes"
                  fullWidth
                  variant="outlined"
                  value={formInput.comment}
                  onChange={inputComment}
                  inputProps={{ maxLength: 75 }}
                />
                <Button
                  //type="submit"
                  size="large"
                  sx={{ p: 2 }}
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={
                    spendingMode
                      ? formInput.date &&
                        formInput.sum > 0 &&
                        formInput.group &&
                        formInput.item &&
                        formInput.tags.length > 0
                        ? false
                        : true
                      : formInput.date && formInput.sum && formInput.source
                      ? false
                      : true
                  }
                >
                  {editMode ? "Update" : "Record"}
                </Button>
              </form>
            </DialogContent>
          )}
        </Box>
      </Dialog>
    </Fragment>
  );
}

//Во всех Autocomplete не хватает параметров onChange, в его TextField - error и helperText
//В целом, не забудь про валидацию и вращающуюся иконку отправки
