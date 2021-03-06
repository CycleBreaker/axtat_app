import React, { Fragment, forwardRef, useState, useContext } from "react";
//Contexts
import { ThemeContext } from "./contexts/ThemeContext";
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

//Temporary table
const tempTagsTableContents = [
  { name: "Me", type: "Tag", parent: null },
  { name: "Business", type: "Tag", parent: null },
];
const tempGroupsTableContents = [
  { name: "Food", type: "Group", parent: null },
  { name: "Appearance", type: "Group", parent: null },
];
const tempItemsTableContents = [
  { name: "Home-Cooked", type: "Item", parent: "Food" },
  { name: "Clothing", type: "Item", parent: "Appearance" },
];
const tempSourcesTableContents = [
  { name: "Salary", type: "Source", parent: null },
  { name: "Tips", type: "Source", parent: null },
  { name: "Business", type: "Source", parent: null },
];
function TempTable() {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox size="small" />
            </TableCell>
            {
              //?????? ?????????????????????????????????? ?????????????????????????? ?????????????????? ????????????????, ???????????? ?? https://mui.com/material-ui/react-table/#sorting-amp-selecting
            }
            <TableCell sx={{ fontWeight: "bold", minWidth: "130px" }}>
              Spending tags
            </TableCell>
          </TableRow>
          {tempTagsTableContents.map((row) => (
            <TableRow>
              <TableCell>
                <Checkbox size="small" />
              </TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Checkbox size="small" />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Spending groups</TableCell>
          </TableRow>
          {tempGroupsTableContents.map((row) => (
            <TableRow>
              <TableCell>
                <Checkbox size="small" />
              </TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Checkbox size="small" />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Spending items</TableCell>
          </TableRow>
          {tempItemsTableContents.map((row) => (
            <TableRow>
              <TableCell>
                <Checkbox size="small" />
              </TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Checkbox size="small" />
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Earning sources</TableCell>
          </TableRow>
          {tempSourcesTableContents.map((row) => (
            <TableRow>
              <TableCell>
                <Checkbox size="small" />
              </TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function NewStatPopup(props) {
  const { open, closeFn, selectedWindow } = props;
  //Theming
  const { isLightTheme } = useContext(ThemeContext);

  //Calendar functionality
  const [calendarOpen, setCalendarOpen] = useState(false);
  const openCalendar = () => setCalendarOpen(true);
  const closeCalendar = () => setCalendarOpen(false);

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
            {selectedWindow
              ? `Edit ${selectedWindow}`
              : "Create new Stat Window"}
          </Typography>
          <DialogContent sx={formSpacing}>
            <form style={formSpacing}>
              <TextField label="Name" variant="outlined" fullWidth />
              <Grid
                container
                spacing={1}
                sx={{ width: "100%", textAlign: "center" }}
              >
                <Grid item xs={12} sm={8} sx={{ width: "100%" }}>
                  <TextField label="Date range" variant="standard" fullWidth />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ width: "100%" }}>
                  <Button variant="contained" onClick={openCalendar}>
                    Pick date range
                  </Button>
                </Grid>
              </Grid>
              <Autocomplete
                fullWidth
                options={["Line", "Bar", "Pie"]}
                value={"Line"}
                renderInput={(params) => (
                  <TextField {...params} label="Chart type" />
                )}
              />
              <Scrollbars
                style={{
                  width: "100%",
                  height: "200px",
                }}
              >
                <TempTable />
              </Scrollbars>
              <Button
                type="submit"
                size="large"
                sx={{ p: 2 }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Create
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </Fragment>
  );
}
