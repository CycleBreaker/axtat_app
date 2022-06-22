import React, { forwardRef, useContext } from "react";
//MUI elements
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Zoom from "@mui/material/Zoom";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
//Contexts
import { SettingsContext } from "./contexts/SettingsContext";
import { ThemeContext } from "./contexts/ThemeContext";
//Helpers
import { lightTheme, darkTheme } from "./themes";

//Transition animation
const ZoomTransition = forwardRef(function SlideTransition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

//Tag CSS
const Tag = function (prps) {
  const { isLightTheme } = useContext(ThemeContext);
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: prps.color,
        display: "inline-block",
        textAlign: "right",
        padding: "5px",
        paddingLeft: "25px",
        margin: "5px",
        borderRadius: "100px 20px 20px 100px",
        transform: "scale(0.8)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "-30px",
          left: "5px",
          fontSize: "400%",
          color: isLightTheme
            ? lightTheme.palette.background.default
            : darkTheme.palette.background.default,
        }}
      >
        {String.fromCharCode(183)}
      </span>
      {prps.tag}
    </div>
  );
};

export default function EntryPopup(props) {
  const { open, closeFn, entry, openEditWindow, openDeleteWindow } = props;
  const { chosenCurrency } = useContext(SettingsContext);

  const dateFormat = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  //Old Tag css that I don't like anymore
  /*
  const Tag = function (prps) {
    const StyledTag = styled.div`
      display: inline-block;
      margin: 5px 15px 5px 5px;
      padding: 10px;
      background-color: ${prps.color};
      width: fit-content;
      border-radius: 10px;
      position: relative;
      box-sizing: border-box;
      &:after {
        position: absolute;
        content: "\\25CF";
        color: white;
        text-shadow: 0 0 1px #333;
        font-size: 150%;
        line-height: 0;
        text-indent: 12px;
        left: -22px;
        top: 4px;
        width: 1px;
        border-right: 24px solid ${prps.color};
        border-top: 15px solid transparent;
        border-bottom: 21px solid transparent;
      }
    `;

    return (
      <StyledTag style={{ transform: "scale(0.7)" }}>{prps.tag}</StyledTag>
    );
  };
  */

  //Temporary tag colors
  const tempTagColors = ["#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];

  return (
    <Dialog open={open} TransitionComponent={ZoomTransition} onClose={closeFn}>
      <DialogContent sx={{ textAlign: "center", width: "inherit" }}>
        <div
          style={{
            fontSize: "400%",
            display: "relative",
          }}
        >
          <div
            style={{
              position: "fixed",
              width: "fit-content",
              left: "50%",
              transform: "translate(-50%, -85px)",
            }}
          >
            {entry.smiley}
          </div>
        </div>
        <Typography variant="caption">
          {new Intl.DateTimeFormat("en-IE", dateFormat).format(
            new Date(entry.date)
          )}
        </Typography>
        <Divider sx={{ mt: 1, mb: 1 }}>
          <Chip label={entry.isSpending ? "Spending" : "Income"} />
        </Divider>
        <Typography variant="h4">
          {entry.isSpending ? entry.group : entry.source}
        </Typography>
        {entry.isSpending ? (
          <Typography variant="h5">{entry.item}</Typography>
        ) : null}
        <Typography variant="h3">
          {entry.sum + chosenCurrency.symbol}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {entry.tags.map((tg, i) => (
            <Tag key={i} tag={tg} color={tempTagColors[i]} />
          ))}
        </Box>
        <Typography sx={{ m: 1 }}>{entry.comment}</Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton onClick={openEditWindow}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={openDeleteWindow}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
