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
  const handleOnDragEnd = function (e) {
    if (!e.destination) return;
    const items = Array.from(windowOrder);
    const [reorderedItem] = items.splice(e.source.index, 1);
    items.splice(e.destination.index, 0, reorderedItem);
    setWindowOrder(items);
  };
  //New Stat Window popup
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

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
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="statWindowList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {windowOrder.map((wd, i) => (
                  <Draggable key={wd} draggableId={String(i)} index={i}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <StatWindow name={wd} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Fragment>
  );
}

//В этом и в других компонентах, где имеются графики, нужно добавить Мемо, чтобы они не дёргались и не перерендеривались
//Не видно надписи Made by Etcetera, возможно, из-за DnD
