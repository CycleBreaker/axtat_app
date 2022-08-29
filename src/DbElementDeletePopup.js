import React, { forwardRef } from "react";
//MUI elements
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Zoom from "@mui/material/Zoom";
import Button from "@mui/material/Button";

//Transition animation
const ZoomTransition = forwardRef(function ZoomTransition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function DbElementDeletePopup(props) {
  const { isOpen, close, item, deleteDbElement, deleteStat } = props;
  const titleMessage = function () {
    switch (item.itemType) {
      case "entry":
        return "this entry";
      case "stat":
        return `the ${item.item.name} Stat Window`;
      default:
        return `the ${item.item} ${item.itemType}`;
    }
  };

  const handleDelete = function () {
    if (item.itemType === "entry") {
      deleteDbElement(item.item);
    } else if (item.itemType === "stat") {
      deleteStat(item.item);
    } else {
      deleteDbElement(item.itemType.toLowerCase(), item.item);
    }
    close();
  };

  return (
    <Dialog open={isOpen} TransitionComponent={ZoomTransition} onClose={close}>
      <DialogTitle>{`Are you sure you want to delete ${titleMessage()}?`}</DialogTitle>
      <DialogContent>This action cannot be undone.</DialogContent>
      <DialogActions>
        <Button onClick={close} autoFocus>
          Cancel
        </Button>
        {<Button onClick={handleDelete}>{`Delete ${item.itemType}`}</Button>}
      </DialogActions>
    </Dialog>
  );
}
