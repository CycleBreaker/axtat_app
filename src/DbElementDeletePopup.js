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
  const { isOpen, close, item, itemType } = props;

  return (
    <Dialog open={isOpen} TransitionComponent={ZoomTransition} onClose={close}>
      <DialogTitle>{`Are you sure you want to delete the ${item} ${itemType}?`}</DialogTitle>
      <DialogContent>This action cannot be undone.</DialogContent>
      <DialogActions>
        <Button onClick={close} autoFocus>
          Cancel
        </Button>
        <Button onClick={close}>{`Delete ${itemType}`}</Button>
      </DialogActions>
    </Dialog>
  );
}
