import React, { Fragment, useContext, useState, memo } from "react";
import { TransitionGroup } from "react-transition-group";
//App components
import StatWindow from "./StatWindow";
import NewStatPopup from "./NewStatPopup";
//Contexts
import { ResolutionContext } from "./contexts/ResolutionContext";
import { TransitionContext } from "./contexts/TransitionContext";
//MUI elements
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
//Icons
import AddIcon from "@mui/icons-material/Add";
//Drag and Drop
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";
//Transition animation
import { motion } from "framer-motion";

function Statistics(props) {
  //Contexts
  const { tabletResolution, commonWindowSize } = useContext(ResolutionContext);
  const { transition } = useContext(TransitionContext);

  //New Stat Window popup
  const [popupOpen, setPopupOpen] = useState(false);
  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

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
      <motion.div
        initial={transition.initial}
        animate={transition.animate}
        exit={transition.exit}
      >
        <Box sx={commonWindowSize}>
          <NewStatPopup open={popupOpen} closeFn={closePopup} />
          <DraggableStatWindowList onSortEnd={onSortEnd}>
            <div>
              {windowOrder.map((wd, i) => (
                <DraggableStatWindow key={i} name={wd} index={i} />
              ))}
            </div>
          </DraggableStatWindowList>
        </Box>
      </motion.div>
    </Fragment>
  );
}

export default memo(Statistics);

//В этом и в других компонентах, где имеются графики, нужно добавить Мемо, чтобы они не дёргались и не перерендеривались
//Не видно надписи Made by Etcetera, возможно, из-за DnD
