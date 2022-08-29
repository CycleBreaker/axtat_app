import React, {
  Fragment,
  forwardRef,
  useState,
  useContext,
  useEffect,
} from "react";
//Contexts
import { ThemeContext } from "./contexts/ThemeContext";
import { UserDataContext } from "./contexts/UserDataContext";
//Helpers
import { textInput } from "./helpers/customHooks";
import { dateFormat } from "./config";
//MUI elements
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
//Icons
import SendIcon from "@mui/icons-material/Send";
//Calendar
import Calendar from "react-calendar";
import "./calendarStyling.css";
//Custom scrollbar
import { Scrollbars } from "react-custom-scrollbars-2";

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

//Element table
function ElementTable(props) {
  const { selectedElements, setSelectedElements } = props;
  const { userSettings } = useContext(UserDataContext);

  const isSelected = (name, type) =>
    selectedElements[type].indexOf(name) !== -1;

  //Select elements
  const handleSelect = (name, type) => {
    const selectedIndex = selectedElements[type + "s"].indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedElements[type + "s"], name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedElements[type + "s"].slice(1));
    } else if (selectedIndex === selectedElements[type + "s"].length - 1) {
      newSelected = newSelected.concat(
        selectedElements[type + "s"].slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedElements[type + "s"].slice(0, selectedIndex),
        selectedElements[type + "s"].slice(selectedIndex + 1)
      );
    }

    setSelectedElements({
      ...selectedElements,
      [type + "s"]: newSelected,
    });
  };
  const handleSelectAllTags = (e) => {
    if (e.target.checked) {
      const newSelected = userSettings.tags.map((n) => n.name);
      setSelectedElements({
        ...selectedElements,
        tags: newSelected,
      });
      return;
    }
    setSelectedElements({
      ...selectedElements,
      tags: [],
    });
  };
  const handleSelectAllGroups = (e) => {
    if (e.target.checked) {
      const newSelected = userSettings.groups.map((n) => n.name);
      setSelectedElements({
        ...selectedElements,
        groups: newSelected,
      });
      return;
    }
    setSelectedElements({
      ...selectedElements,
      groups: [],
    });
  };
  const handleSelectAllItems = (e) => {
    if (e.target.checked) {
      const newSelected = userSettings.items.map((n) => n.name);
      setSelectedElements({
        ...selectedElements,
        items: newSelected,
      });
      return;
    }
    setSelectedElements({
      ...selectedElements,
      items: [],
    });
  };
  const handleSelectAllSources = (e) => {
    if (e.target.checked) {
      const newSelected = userSettings.sources.map((n) => n.name);
      setSelectedElements({
        ...selectedElements,
        sources: newSelected,
      });
      return;
    }
    setSelectedElements({
      ...selectedElements,
      sources: [],
    });
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox
                size="small"
                onClick={handleSelectAllTags}
                indeterminate={
                  selectedElements.tags.length > 0 &&
                  selectedElements.tags.length < userSettings.tags.length
                }
                checked={
                  selectedElements.tags.length === userSettings.tags.length
                }
              />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", minWidth: "130px" }}>
              Spending tags
            </TableCell>
          </TableRow>
          {userSettings.tags.map((tg) => {
            const isItemSelected = isSelected(tg.name, "tags");
            return (
              <TableRow
                onClick={() => handleSelect(tg.name, "tag")}
                selected={isItemSelected}
              >
                <TableCell>
                  <Checkbox size="small" checked={isItemSelected} />
                </TableCell>
                <TableCell>{tg.name}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>
              <Checkbox
                size="small"
                onClick={handleSelectAllGroups}
                indeterminate={
                  selectedElements.groups.length > 0 &&
                  selectedElements.groups.length < userSettings.groups.length
                }
                checked={
                  selectedElements.groups.length === userSettings.groups.length
                }
              />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Spending groups</TableCell>
          </TableRow>
          {userSettings.groups.map((gr) => {
            const isItemSelected = isSelected(gr.name, "groups");
            return (
              <TableRow
                onClick={() => handleSelect(gr.name, "group")}
                selected={isItemSelected}
              >
                <TableCell>
                  <Checkbox size="small" checked={isItemSelected} />
                </TableCell>
                <TableCell>{gr.icon + " " + gr.name}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>
              <Checkbox
                size="small"
                onClick={handleSelectAllItems}
                indeterminate={
                  selectedElements.items.length > 0 &&
                  selectedElements.items.length < userSettings.items.length
                }
                checked={
                  selectedElements.items.length === userSettings.items.length
                }
              />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Spending items</TableCell>
          </TableRow>
          {userSettings.items.map((itm) => {
            const isItemSelected = isSelected(itm.name, "items");
            return (
              <TableRow
                onClick={() => handleSelect(itm.name, "item")}
                selected={isItemSelected}
              >
                <TableCell>
                  <Checkbox size="small" checked={isItemSelected} />
                </TableCell>
                <TableCell>{itm.name}</TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>
              <Checkbox
                size="small"
                onClick={handleSelectAllSources}
                indeterminate={
                  selectedElements.sources.length > 0 &&
                  selectedElements.sources.length < userSettings.sources.length
                }
                checked={
                  selectedElements.sources.length ===
                  userSettings.sources.length
                }
              />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Earning sources</TableCell>
          </TableRow>
          {userSettings.sources.map((src) => {
            const isItemSelected = isSelected(src.name, "sources");
            return (
              <TableRow
                onClick={() => handleSelect(src.name, "source")}
                selected={isItemSelected}
              >
                <TableCell>
                  <Checkbox size="small" checked={isItemSelected} />
                </TableCell>
                <TableCell>{src.icon + " " + src.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function NewStatPopup(props) {
  const { open, closeFn, selectedWindow, editMode, uploadNewStat, updateStat } =
    props;
  const { userSettings } = useContext(UserDataContext);
  //Theming
  const { isLightTheme } = useContext(ThemeContext);

  //Calendar functionality
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = () => setCalendarOpen(true);
  const closeCalendar = () => setCalendarOpen(false);

  //INPUT
  //Name
  const [nameInput, setNameInput, nameReset] = textInput(
    editMode ? selectedWindow.name : ""
  );
  const [formInput, setFormInput] = useState({
    dateRange: editMode
      ? [
          new Date(selectedWindow.dateRange[0].seconds * 1000),
          new Date(selectedWindow.dateRange[1].seconds * 1000),
        ]
      : [new Date(), new Date()],
    chartType: editMode ? selectedWindow.chartType : "Bar",
  });
  const [selectedElements, setSelectedElements] = useState(
    editMode
      ? {
          groups: selectedWindow.displayGroups.map((el) => el),
          items: selectedWindow.displayItems.map((el) => el),
          tags: selectedWindow.displayTags.map((el) => el),
          sources: selectedWindow.displaySources.map((el) => el),
        }
      : {
          groups: [],
          items: [],
          tags: [],
          sources: [],
        }
  );
  //Date range
  const pickDateRange = (rng) => setFormInput({ ...formInput, dateRange: rng });
  //Chart type
  const pickChartType = (e) =>
    setFormInput({ ...formInput, chartType: e.target.textContent });
  const generateOptionsWithIcons = function () {
    const pieIcon = () => <PieChartIcon />;
    const barIcon = () => <BarChartIcon />;
    const lineIcon = () => <ShowChartIcon />;
    return ["Bar " + barIcon, "Line " + lineIcon, "Pie " + pieIcon];
  };
  const optionsWithIcons = function () {
    const labels = generateOptionsWithIcons();
    return labels;
  };

  const handleSubmit = function () {
    const submitData = {
      chartType: formInput.chartType,
      dateRange: [
        new Date(new Date(formInput.dateRange[0]).setHours(0, 0, 0, 0)),
        new Date(new Date(formInput.dateRange[1]).setHours(23, 59, 59, 59)),
      ],
      displayTags: selectedElements.tags,
      displayGroups: selectedElements.groups,
      displayItems: selectedElements.items,
      displaySources: selectedElements.sources,
      id: editMode ? selectedWindow.id : userSettings.statistics.length + 1,
      name: nameInput,
      order: editMode ? selectedWindow.order : userSettings.statistics.length,
    };
    console.log(formInput.dateRange);
    if (editMode) {
      updateStat(submitData);
    } else {
      uploadNewStat(submitData);
    }
    closeFn();
    clearInputs();
  };

  const clearInputs = function () {
    nameReset();
    setFormInput({
      dateRange: [new Date(), new Date()],
      chartType: "Bar",
    });
    setSelectedElements({
      groups: [],
      items: [],
      tags: [],
      sources: [],
    });
  };

  useEffect(() => console.log("selectedWindow", selectedWindow));

  return (
    <Fragment>
      <Dialog
        open={calendarOpen}
        TransitionComponent={ZoomTransition}
        onClose={closeCalendar}
        sx={{ zIndex: 2000 }}
      >
        <Calendar
          selectRange
          maxDate={new Date()}
          onChange={pickDateRange}
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
            {editMode
              ? `Edit ${selectedWindow.name}`
              : "Create new Stat Window"}
          </Typography>
          <DialogContent sx={formSpacing}>
            <form style={formSpacing}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={nameInput}
                onChange={setNameInput}
              />
              <Grid
                container
                spacing={1}
                sx={{ width: "100%", textAlign: "center" }}
              >
                <Grid item xs={12} sm={8} sx={{ width: "100%" }}>
                  <TextField
                    style={{ transform: "translateY(10px)" }}
                    variant="standard"
                    fullWidth
                    value={
                      new Intl.DateTimeFormat("en-IE", dateFormat).format(
                        formInput.dateRange[0]
                      ) +
                      " - " +
                      new Intl.DateTimeFormat("en-IE", dateFormat).format(
                        formInput.dateRange[1]
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ width: "100%" }}>
                  <Button variant="contained" onClick={openCalendar}>
                    Pick date range
                  </Button>
                </Grid>
              </Grid>
              <Autocomplete
                fullWidth
                options={["Bar", "Pie", "Line"]}
                value={formInput.chartType}
                renderInput={(params) => (
                  <TextField {...params} label="Chart type" />
                )}
                onChange={pickChartType}
                disableClearable
              />
              <Scrollbars
                style={{
                  width: "100%",
                  height: "200px",
                }}
              >
                <ElementTable
                  selectedElements={selectedElements}
                  setSelectedElements={setSelectedElements}
                />
              </Scrollbars>
              <Button
                size="large"
                sx={{ p: 2 }}
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={
                  nameInput === "" ||
                  (selectedElements.tags.length === 0 &&
                    selectedElements.groups.length === 0 &&
                    selectedElements.items.length === 0 &&
                    selectedElements.sources.length === 0)
                }
              >
                {editMode ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  );
}
