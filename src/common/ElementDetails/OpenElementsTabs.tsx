import { Close } from "@mui/icons-material";
import { Divider, styled, Tab, TabProps, Tabs } from "@mui/material";
import { OpenElement, OpenElementsContext } from "common/OpenElementsContext";
import { parseGenomicRangeString } from "common/utility";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent as ReactMouseEvent, useContext, useEffect, useRef } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from '@hello-pangea/dnd';

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


export const constructElementURL = (element: OpenElement) => `/${element.elementType}/${element.elementID}/${element.tab}`;

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType;
  elementID: string;
};

export const OpenElementsTabs = ({ elementID, elementType }: ElementDetailsHeaderProps) => {
  const [openElements, dispatch] = useContext(OpenElementsContext);

  const router = useRouter();
  const isRouting = useRef(false);
  const pathname = usePathname()

  const currentTab = (pathname.split("/")[3] ?? "") as TabRoute;
  const currentElement = openElements.find(el => el.elementID === elementID)

  // Need to have flag to mark that navigation is underway, or else deleted tab would be added right back since the state update beats the routing update
  const navigateAndMark = (url: string) => {
    isRouting.current = true;
    router.push(url);
  };

  // Resets the routing flag when routing is complete
  useEffect(() => {
    isRouting.current = false;
  }, [elementID]);

  useEffect(() => {
    // if current route is not in open elements, and routing is not currently underway
    if (!isRouting.current && !openElements.some((el) => el.elementID === elementID)) {
      dispatch({
        type: "add",
        element: {
          elementID,
          elementType,
          tab: currentTab
        },
      });
    }
  }, [dispatch, elementID, elementType, openElements]);

  //sync the current tab to the state so that it is preserved on tab switch
  useEffect(() => {
    if (currentElement && !isRouting.current && currentTab !== currentElement.tab){
      dispatch({
        type: "update",
        element: {
          elementID,
          elementType,
          tab: currentTab
        }
      })
    }
  }, [currentTab, currentElement])

  const handleTabClick = (event: ReactMouseEvent<HTMLDivElement>, elToOpen: OpenElement) => {
    navigateAndMark(constructElementURL(elToOpen));
  };

  const handleCloseTab = (elToClose: OpenElement) => {
    if (openElements.length > 1) {
      // only need to navigate if you're closing the tab that you're on
      const needToNavigate = elToClose.elementID === elementID;
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
  };

  const CloseTabButton = (element: OpenElement) => {
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

  const onDragEnd: OnDragEndResponder<string> = (result, provided) => {
    console.log(result)
    console.log(provided)
    if (result.destination.index !== result.source.index){
      dispatch({
        type: "reorder",
        element: openElements.find(el => el.elementID === result.draggableId),
        startIndex: result.source.index,
        endIndex: result.destination.index
      })
    }
  }

  type WrappedTabProps = TabProps & {
    element: OpenElement,
    index: number
  }

  const WrappedTab = ({ element, index, ...props}: WrappedTabProps) => {
    return (
      <Draggable key={element.elementID} draggableId={element.elementID} index={index} disableInteractiveElementBlocking>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Tab
              value={element.elementID}
              label={formatElementID(element.elementID)}
              onClick={(e) => handleTabClick(e, element)}
              iconPosition="end"
              icon={openElements.length > 1 && <CloseTabButton {...element} />}
              sx={{ minHeight: "48px" }}
              {...props}
            />
          </div>
        )}
      </Draggable>
    );
  };

  WrappedTab.muiName = "Tab"

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <Tabs
              ref={provided.innerRef} //need to expose highest DOM node to the Droppable component
              value={elementID}
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
                <WrappedTab element={element} index={i} />
              ))}
              {provided.placeholder} {/* Provide placeholder to create space in <Droppable /> during a drag */}
            </Tabs>
          )}
        </Droppable>
      </DragDropContext>
      <Divider />
    </div>
  );
};
