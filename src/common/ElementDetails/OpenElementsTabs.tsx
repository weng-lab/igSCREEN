import { Close } from "@mui/icons-material";
import { Divider, styled, Tab, TabProps, Tabs } from "@mui/material";
import { OpenElement, OpenElementsContext } from "common/OpenElementsContext";
import { parseGenomicRangeString } from "common/utility";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent as ReactMouseEvent, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';
import { url } from "inspector";

// Create a styled close button that looks like an IconButton
// Needed to prevent IconButton from being child of button in tab (hydration error)
const CloseIconButton = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
  borderRadius: "50%",
  marginLeft: theme.spacing(1),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& svg": {
    fontSize: "1rem",
  },
}));

type WrappedTabProps = TabProps & {
  element: OpenElement,
  index: number,
  handleTabClick: (el: OpenElement) => void,
  handleCloseTab: (el: OpenElement) => void
}

const WrappedTab = ({ element, index, handleTabClick, handleCloseTab, ...props }: WrappedTabProps) => {
  return (
    <Draggable key={element.elementID} draggableId={element.elementID} index={index} disableInteractiveElementBlocking>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Tab
            value={index}
            label={formatElementID(element.elementID)}
            onClick={() => handleTabClick(element)}
            iconPosition="end"
            icon={<CloseTabButton element={element} handleCloseTab={handleCloseTab} />}
            sx={{ minHeight: "48px" }}
            {...props}
          />
        </div>
      )}
    </Draggable>
  );
};

const CloseTabButton = ({element, handleCloseTab}: {element: OpenElement, handleCloseTab: (el: OpenElement) => void}) => {
  return (
    <CloseIconButton
      onClick={(event) => {
        event.stopPropagation();
        handleCloseTab(element);
      }}
    >
      <Close fontSize="inherit" />
    </CloseIconButton>
  );
};

const formatElementID = (id: string) => {
  if (id.includes('%3A')) {
    const region = parseGenomicRangeString(id)
    return `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`
  } else {
    return id
  }
}


export const constructElementURL = (element: OpenElement) => `/${element.elementType}/${element.elementID}/${element.tab}`;

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType;
  elementID: string;
};

export const OpenElementsTabs = () => {
  const [openElements, dispatch] = useContext(OpenElementsContext);

  const router = useRouter();
  const isRouting = useRef(false);
  const pathname = usePathname()

  const urlElementType = pathname.split("/")[1] as GenomicElementType;
  const urlElementID = pathname.split("/")[2];
  const urlTab = (pathname.split("/")[3] ?? "") as TabRoute;

  const currentElementState = openElements.find(el => el.elementID === urlElementID)

  /**
   * @todo check here to make sure that the url is correct. Unless I don't need to because of the other checks in the layout and tab files?
   */

  // Need to have flag to mark that navigation is underway, or else deleted tab would be added right back since the state update beats the routing update
  const navigateAndMark = (url: string) => {
    isRouting.current = true;
    router.push(url);
  };

  // Resets the routing flag when routing is complete
  useEffect(() => {
    isRouting.current = false;
  }, [urlElementID]);

  useEffect(() => {
    // if current route is not in open elements, and routing is not currently underway
    if (!isRouting.current && !currentElementState) {
      dispatch({
        type: "add",
        element: {
          elementID: urlElementID,
          elementType: urlElementType,
          tab: urlTab
        },
      });
    }
  }, [currentElementState, urlElementID, urlElementType, urlTab]);

  //sync the current tab to the state so that it is preserved on tab switch
  useEffect(() => {
    if (!isRouting.current && currentElementState && urlTab !== currentElementState.tab){
      dispatch({
        type: "update",
        element: {
          ...currentElementState,
          tab: urlTab
        }
      })
    }
  }, [urlTab, currentElementState])

  const handleTabClick = useCallback((elToOpen: OpenElement) => {
    navigateAndMark(constructElementURL(elToOpen));
  }, [navigateAndMark])

  const handleCloseTab = useCallback((elToClose: OpenElement) => {
    if (openElements.length > 1) {
      // only need to navigate if you're closing the tab that you're on
      const needToNavigate = elToClose.elementID === urlElementID;
      if (needToNavigate) {
        const toCloseIndex = openElements.findIndex((openEl) => openEl.elementID === elToClose.elementID);

        //if elToClose is last tab, go to the tab on left. Else, go to the tab on the right
        const elToNavTo =
          toCloseIndex === openElements.length - 1 ? openElements[toCloseIndex - 1] : openElements[toCloseIndex + 1];

        navigateAndMark(constructElementURL(elToNavTo));
      }

      dispatch({
        type: "remove",
        element: elToClose,
      });
    }
  }, [openElements, navigateAndMark]) ;

  const onDragEnd: OnDragEndResponder<string> = (result, provided) => {
    if (result.destination.index !== result.source.index){
      dispatch({
        type: "reorder",
        element: openElements.find(el => el.elementID === result.draggableId),
        startIndex: result.source.index,
        endIndex: result.destination.index
      })
    }
  }

  const tabIndex = useMemo(() => openElements.findIndex(el => el.elementID === urlElementID), [openElements, urlElementID])

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => { return (
            <Tabs
              ref={provided.innerRef} //need to expose highest DOM node to the Droppable component
              value={tabIndex}
              // value={openElements.findIndex(el => el.elementID === urlElementID)}
              id="open-elements-tabs"
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons.Mui-disabled": {
                  opacity: 0.3,
                },
              }}
              {...provided.droppableProps} //contains attributes for styling and element lookups
            >
              {openElements.map((element, i) => (
                <WrappedTab element={element} index={i} handleCloseTab={handleCloseTab} handleTabClick={handleTabClick} />
              ))}
              {provided.placeholder} {/* Provide placeholder to create space in <Droppable /> during a drag */}
            </Tabs>
          )}}
        </Droppable>
      </DragDropContext>
      <Divider />
    </div>
  );
};
