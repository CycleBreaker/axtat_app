import { Fragment, useContext, useState } from "react";
//App components
import StatWindow from "./StatWindow";
import NewStatPopup from "./NewStatPopup";
//MUI elements
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
//Icons
import AddIcon from "@mui/icons-material/Add";
//Drag and Drop
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";

export default function Statistics(props) {
  //Contexts
  const { mobileResolution, tabletResolution } = useContext(ResolutionContext);
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
          right: tabletResolution ? "15%" : 50,
          bottom: 80,
          left: "auto",
          position: "fixed",
        }}
        onClick={openPopup}
      >
        <AddIcon />
      </Fab>
      <Box
        sx={{
          width: tabletResolution ? 800 : "100%",
          m: "0 auto",
          boxSizing: "border-box",
          p: 2,
          height: "calc(100vh+128px)",
          flex: 1,
        }}
      >
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
//Заменить текущий drag-and-drop на pretty list, или как его там
