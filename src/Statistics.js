import React, { Fragment, useContext, useState, memo } from "react";
//App components
import StatWindow from "./StatWindow";
import NewStatPopup from "./NewStatPopup";
import DbElementDeletePopup from "./DbElementDeletePopup";
import Footer from "./Footer";
import LoadingElement from "./LoadingElement";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { UserDataContext } from "./contexts/UserDataContext";
//MUI elements
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//Icons
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";
//Drag and Drop
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
//Custom scrollbar
import { Scrollbars } from "react-custom-scrollbars-2";

const NoStatsText = function () {
  return (
    <Box
      sx={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography>
        Press <AddCircleIcon sx={{ transform: "translateY(6px)" }} /> to add
        your first report
      </Typography>
    </Box>
  );
};

function Statistics(props) {
  //Contexts
  const { tabletResolution, commonWindowSize } = useContext(ResolutionContext);
  const { user } = useContext(UserDataContext);

  //Temporary DnD stuff
  const [windowOrder, setWindowOrder] = useState([
    "one",
    "two",
    "three",
    "four",
    "five",
  ]);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setWindowOrder(arrayMove(windowOrder, oldIndex, newIndex));
  };
  const DraggableStatWindowList = SortableContainer(({ children }) => {
    return <Fragment>{children}</Fragment>;
  });
  const DraggableStatWindow = SortableElement((props) => (
    <StatWindow {...props} />
  ));

  //Select window for editing/deletion
  const [currentWindow, setCurrentWindow] = useState(null);
  const selectWindow = (wd) => setCurrentWindow(wd);
  //New Stat Window popup
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = function (editMode = false, wd) {
    setPopupOpen(true);
    if (editMode) {
      selectWindow(wd);
    }
  };
  const closePopup = function () {
    setPopupOpen(false);
    setTimeout(() => setCurrentWindow(null), 50);
  };
  //Delete Stat Window popup
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const openDeletePopup = function (wd) {
    setDeletePopupOpen(true);
    selectWindow(wd);
  };
  const closeDeletePopup = () => setDeletePopupOpen(false);

  return (
    <Scrollbars
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {user.userLoggedIn ? (
        <Fragment>
          <Fab
            color="primary"
            sx={{
              margin: 0,
              top: "auto",
              right: tabletResolution ? 50 : "15%",
              bottom: 80,
              left: "auto",
              position: "fixed",
            }}
            onClick={openPopup}
          >
            <AddIcon />
          </Fab>
          <Box sx={commonWindowSize}>
            <NewStatPopup
              open={popupOpen}
              closeFn={closePopup}
              selectedWindow={currentWindow}
            />
            <DbElementDeletePopup
              isOpen={deletePopupOpen}
              close={closeDeletePopup}
              item={currentWindow}
              itemType="stat"
            />
            <DraggableStatWindowList onSortEnd={onSortEnd} pressDelay={200}>
              <div>
                {windowOrder.map((wd, i) => (
                  <DraggableStatWindow
                    key={i}
                    name={wd}
                    index={i}
                    openEditPopup={openPopup}
                    openDeletePopup={openDeletePopup}
                  />
                ))}
              </div>
            </DraggableStatWindowList>
          </Box>
          <Footer />
        </Fragment>
      ) : (
        <LoadingElement />
      )}
    </Scrollbars>
  );
}

export default memo(Statistics);

//В этом и в других компонентах, где имеются графики, нужно добавить Мемо, чтобы они не дёргались и не перерендеривались
//Не видно надписи Made by Etcetera, возможно, из-за DnD
