import React, { Fragment, useContext, useState } from "react";
//App components
import StatWindow from "./StatWindow";
import NewStatPopup from "./NewStatPopup";
//MUI elements
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
//Icons
import AddIcon from "@mui/icons-material/Add";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
//Drag and Drop
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Statistics(props) {
  //Responsiveness
  const { tabletResolution, commonWindowSize } = useContext(ResolutionContext);
  //Sorting order and state
  const [windowOrder, setWindowOrder] = useState([
    "one",
    "two",
    "three",
    "four",
    "five",
  ]);
  //New Stat Window popup
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);
  //Temporary sortable element
  const DndList = () => {
    return (
      <Box style={{ height: "100vh" }}>
        {windowOrder.map((v, i) => (
          <Draggable key={i} draggableId={i} index={i}>
            {(provided) => (
              <StatWindow
                index={i}
                name={v}
                {...provided.draggableProps}
                ref={provided.innerRef}
                {...provided.dragHandleProps}
              />
            )}
          </Draggable>
        ))}
      </Box>
    );
  };

  return (
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
        <NewStatPopup open={popupOpen} closeFn={closePopup} />
        <DragDropContext>
          <Droppable droppableId="statWindowList">
            {(provided) => (
              <DndList {...provided.droppableProps} ref={provided.innerRef} />
            )}
          </Droppable>
        </DragDropContext>
        <Box sx={{ height: "800px" }}></Box>
      </Box>
    </Fragment>
  );
}

//В этом и в других компонентах, где имеются графики, нужно добавить Мемо, чтобы они не дёргались и не перерендеривались
//Не видно надписи Made by Etcetera, возможно, из-за DnD
