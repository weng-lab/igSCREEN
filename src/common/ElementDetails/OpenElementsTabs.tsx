import { Add, Category, Close, DragIndicator, MoreVert } from "@mui/icons-material";
import { Divider, styled, Tab, TabProps, Tabs, Stack, Button, Box, Typography, Paper, IconButton, Tooltip, SxProps, Theme } from "@mui/material";
import { OpenElement, OpenElementsContext } from "common/OpenElementsContext";
import { parseGenomicRangeString } from "common/utility";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent as ReactMouseEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OpenElementsTabsMenu from "./OpenElementsTabsMenu";
import { useMenuControl } from "common/MenuContext";

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
  element: OpenElement;
  index: number;
  closable: boolean;
  isSelected: boolean;
  handleTabClick: (el: OpenElement) => void;
  handleCloseTab: (el: OpenElement) => void;
};

const WrappedTab = ({ element, index, closable, isSelected, handleTabClick, handleCloseTab, ...props }: WrappedTabProps) => {
  return (
    <Draggable key={element.elementID} draggableId={element.elementID} index={index} disableInteractiveElementBlocking>
      {(provided, snapshot) => {
        const draggingStyles: SxProps<Theme> = snapshot.isDragging
          ? {
              backgroundColor: "white",
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
              borderRadius: 1
            }
          : {};
        const selectedStyles: SxProps<Theme> = isSelected ? {
          borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
          borderTop: (theme) => `2px solid transparent`
        } : {}
        return (
          <Tab
            value={index}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            role="tab" //dragHandleProps sets role to "button" which breaks keyboard navigation. Revert back
            label={formatElementID(element.elementID)}
            onClick={() => handleTabClick(element)}
            iconPosition="end"
            icon={closable && <CloseTabButton element={element} handleCloseTab={handleCloseTab} />}
            sx={{ minHeight: "48px", ...selectedStyles, ...draggingStyles }}
            {...props}
          />
        )   
      }}
    </Draggable>
  );
};

const CloseTabButton = ({
  element,
  handleCloseTab,
}: {
  element: OpenElement;
  handleCloseTab: (el: OpenElement) => void;
}) => {
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
  if (id.includes("%3A")) {
    const region = parseGenomicRangeString(id);
    return `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
  } else {
    return id;
  }
};

export const constructElementURL = (element: OpenElement) =>
  `/${element.elementType}/${element.elementID}/${element.tab}`;

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType;
  elementID: string;
};

export const OpenElementsTabs = ({ children }: { children?: React.ReactNode }) => {
  const [openElements, dispatch] = useContext(OpenElementsContext);

  const { menuCanBeOpened,isMenuMounted, openMenu } = useMenuControl();
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);


  /**
   * Used to give focus to the MobileMenu search bar
   */
  useEffect(() => {
  if (isMenuMounted && shouldFocusSearch) {
    const el = document.getElementById('mobile-search-component')
    if (el) {
      el.focus();
      setShouldFocusSearch(false); // reset the flag
    }
  }
}, [isMenuMounted, shouldFocusSearch]);

  const router = useRouter();
  const isRouting = useRef(false);
  const pathname = usePathname();

  const urlElementType = pathname.split("/")[1] as GenomicElementType;
  const urlElementID = pathname.split("/")[2];
  const urlTab = (pathname.split("/")[3] ?? "") as TabRoute;

  const currentElementState = openElements.find((el) => el.elementID === urlElementID);

  // Need to have flag to mark that navigation is underway, or else deleted tab would be added right back since the state update beats the routing update
  const navigateAndMark = useCallback(
    (url: string) => {
      isRouting.current = true;
      router.push(url);
    },
    [router]
  );

  // Resets the routing flag when routing is complete
  useEffect(() => {
    isRouting.current = false;
  }, [urlElementID]);

  useEffect(() => {
    // if current route is not in open elements, and routing is not currently underway
    if (!isRouting.current && !currentElementState) {
      dispatch({
        type: "addElement",
        element: {
          elementID: urlElementID,
          elementType: urlElementType,
          tab: urlTab,
        },
      });
    }
  }, [currentElementState, dispatch, urlElementID, urlElementType, urlTab]);

  //sync the current tab to the state so that it is preserved on tab switch
  useEffect(() => {
    if (!isRouting.current && currentElementState && urlTab !== currentElementState.tab) {
      dispatch({
        type: "updateElement",
        element: {
          ...currentElementState,
          tab: urlTab,
        },
      });
    }
  }, [urlTab, currentElementState, dispatch]);

  const handleTabClick = useCallback(
    (elToOpen: OpenElement) => {
      navigateAndMark(constructElementURL(elToOpen));
    },
    [navigateAndMark]
  );

  const handleCloseTab = useCallback(
    (elToClose: OpenElement) => {
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
          type: "removeElement",
          element: elToClose,
        });
      }
    },
    [openElements, urlElementID, dispatch, navigateAndMark]
  );

  const onDragEnd: OnDragEndResponder<string> = (result, provided) => {
    if (result.destination.index !== result.source.index) {
      dispatch({
        type: "reorder",
        element: openElements.find((el) => el.elementID === result.draggableId),
        startIndex: result.source.index,
        endIndex: result.destination.index,
      });
    }
  };

  const moreThanOneElementOpen = useMemo(() => {
    if (openElements.length > 1) {
      return true
    } else return false
  }, [openElements])

  const handleCloseAll = useCallback(() => {
    dispatch({
      type: "setState",
      state: [currentElementState],
    });
  }, [currentElementState, dispatch]);

  const handleSort = useCallback(() => {
    const sortOrder: GenomicElementType[] = ["region", "gene", "icre", "variant"];
    dispatch({
      type: "setState",
      state: [...openElements].sort((a, b) => {
        const typeComparison = sortOrder.indexOf(a.elementType) - sortOrder.indexOf(b.elementType);
        if (typeComparison === 0) {
          return a.elementID.localeCompare(b.elementID);
        }
        return typeComparison;
      }),
    });
    }, [dispatch, openElements]);

  const tabIndex = useMemo(
    () => openElements.findIndex((el) => el.elementID === urlElementID),
    [openElements, urlElementID]
  );

  const handleSwitchFocus = () => {
    if (menuCanBeOpened) { // aka isMobile
      openMenu();
      setShouldFocusSearch(true); // defer focusing until menu is open
    } else {
      document.getElementById('desktop-search-component')?.focus();
    }
  };

  return (
    <TabContext value={tabIndex}>
      {/* z index of scrollbar in DataGrid is 60 */}
      <Paper elevation={1} square sx={{ position: "sticky", top: 0, zIndex: 61 }} id="open-elements-tabs">
        <Stack direction={"row"}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => {
                return (
                  <TabList
                    ref={provided.innerRef} //need to expose highest DOM node to the Droppable component
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons={snapshot.draggingFromThisWith ? false : "auto"} //prevent scroll buttons from appearing when dragging first or last item
                    sx={{
                      "& .MuiTabs-scrollButtons.Mui-disabled": {
                        opacity: 0.3,
                      },
                      "& .MuiTabs-indicator": {
                        display: "none", // hide selected indicator since we're adding one back in to fix drag behavior
                      },
                      flexGrow: 1,
                    }}
                    {...provided.droppableProps} //contains attributes for styling and element lookups
                  >
                    {openElements.map((element, i) => (
                      <WrappedTab
                        key={i}
                        index={i}
                        closable={openElements.length > 1}
                        element={element}
                        isSelected={urlElementID === element.elementID}
                        handleCloseTab={handleCloseTab}
                        handleTabClick={handleTabClick}
                      />
                    ))}
                    {!snapshot.draggingFromThisWith && (
                      <Tooltip title="New Search" placement="right">
                        <Tab onClick={handleSwitchFocus} icon={<Add fontSize="small" />} sx={{ minWidth: 0 }} />
                      </Tooltip>
                    )}
                    {/* Currently not using placeholder element, but could do so with the below */}
                    {/* {provided.placeholder} */}
                  </TabList>
                );
              }}
            </Droppable>
          </DragDropContext>

          <OpenElementsTabsMenu
            handleCloseAll={moreThanOneElementOpen ? handleCloseAll : undefined}
            handleSort={moreThanOneElementOpen ? handleSort : undefined}
          />
        </Stack>
      </Paper>
      {/* Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ */}
      <TabPanel value={tabIndex} sx={{ p: 0, flexGrow: 1, minHeight: 0 }} id="element-details-TabPanel">
        {children}
      </TabPanel>
    </TabContext>
  );
};
