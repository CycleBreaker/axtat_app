import React, { useContext } from "react";
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
//MUI icons
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddCardIcon from "@mui/icons-material/AddCard";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";

export default function Settings(props) {
  const { switchTheme, isLightTheme } = props;
  const { mobileResolution, commonWindowSize } = useContext(ResolutionContext);

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
  const ElementEditRow = (prps) => (
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
        <Typography variant="h6">{prps.title}</Typography>
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
        <Select value={prps.list[1]} sx={{ transform: "translateY(-10px)" }}>
          {prps.list.map((tg) => (
            <MenuItem value={tg}>{tg}</MenuItem>
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
          <IconButton>
            <AddBoxIcon />
          </IconButton>
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Grid>
    </Grid>
  );

  //Temporary database elements
  const tempTags = ["Me", "Family", "Woman"];
  const tempGroups = ["Food", "Transportation", "Presents"];
  const tempItems = ["Home-Cooked", "Gas", "Personal"];
  const tempSources = ["Salary", "Business", "Tips"];

  return (
    <Box sx={commonWindowSize}>
      <Paper elevation={3}>
        <Typography sx={{ textAlign: "center", pt: 2 }} variant="h4">
          Settings
        </Typography>
        <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
          <PaletteIcon sx={{ transform: "translate(-4px, 4px)" }} />
          <Typography variant="h5">Theme</Typography>
        </Stack>
        <MyDivider />
        <MyBox>
          <Stack direction="row" spacing={1}>
            <Typography sx={{ transform: "translateY(7px)" }}>
              Dark theme
            </Typography>
            <Switch checked={!isLightTheme} onChange={switchTheme} />
          </Stack>
        </MyBox>
        <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
          <CreditCardIcon sx={{ transform: "translate(-4px, 4px)" }} />
          <Typography variant="h5">Database elements: spending</Typography>
        </Stack>
        <MyDivider />
        <MyBox>
          <ElementEditRow title="Tags" list={tempTags} />
          <ElementEditRow title="Groups" list={tempGroups} />
          <ElementEditRow title="Items" list={tempItems} />
        </MyBox>
        <Stack direction="row" sx={{ ml: 2, pt: 3 }}>
          <AddCardIcon sx={{ transform: "translate(-4px, 4px)" }} />
          <Typography variant="h5">Database elements: income</Typography>
        </Stack>
        <MyDivider />
        <MyBox>
          <ElementEditRow title="Sources" list={tempSources} />
        </MyBox>
      </Paper>
    </Box>
  );
}
