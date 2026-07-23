import { Add } from "@mui/icons-material";
import { Box, Tab, Stack, Paper, Tooltip } from "@mui/material";
import { OpenElement, OpenElementsContext } from "common/OpenElementsContext";
import { compressOpenElementsToURL, decompressOpenElementsFromURL } from "common/utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";
import { DragDropContext, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OpenElementsTabsMenu from "../OpenElementsTabsMenu";
import { useMenuControl } from "common/MenuContext";
import { DraggableTab } from "./DraggableTab";

export const constructElementURL = (element: OpenElement) =>
  `/${element.elementType}/${element.elementID}/${element.tab}`;

const SORT_ORDER: GenomicElementType[] = ["region", "gene", "icre", "variant"];

export const OpenElementsTabs = ({ children }: { children?: React.ReactNode }) => {
  const [openElements, dispatch] = useContext(OpenElementsContext);
  const { menuCanBeOpened, isMenuMounted, openMenu } = useMenuControl();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlElement = useMemo(
    () => ({
      elementType: pathname.split("/")[1] as GenomicElementType,
      elementID: pathname.split("/")[2],
      tab: (pathname.split("/")[3] ?? "") as TabRoute,
    }),
    [pathname]
  );

  const currentElementState = openElements.find((el) => el.elementID === urlElement.elementID);

  // ------- Initialize state from URL on initial load -------

  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      const openParam = searchParams.get("open");
      if (openParam) {
        const openElementsFromUrl: OpenElement[] = decompressOpenElementsFromURL(openParam);
        if (openElementsFromUrl.length > 0) {
          dispatch({ type: "setState", state: openElementsFromUrl });
        }
      }
      isInitializedRef.current = true;
    }
  }, [dispatch, searchParams]);

  // ------- Routing Related --------

  const isRoutingRef = useRef(false); // used to prevent race conditions when updating internal state and url (both async)

  /**
   * Navigates to given url, marking isRoutingRef to true
   * Needed to prevent race conditions between async state and routing changes
   */
  const navigateAndMark = useCallback(
    (url: string) => {
      isRoutingRef.current = true;
      router.push(url);
    },
    [router]
  );

  /**
   * Reset the routing flag when routing is complete
   */
  useEffect(() => {
    isRoutingRef.current = false;
  }, [urlElement.elementID]);

  /**
   * Sync URL with current internal state (skip if not initialized yet)
   * Important - this relies on openElements being an empty array on initial load, and it never being reset to empty
   * Otherwise would need to check isInitializedRef.current
   */
  useEffect(() => {
    if (!openElements.length || isRoutingRef.current) return;
    const newUrl = pathname + "?open=" + compressOpenElementsToURL(openElements);
    router.replace(newUrl); //don't use navigateAndMark since it's only set to false when navigating between elements (would be stuck false)
  }, [navigateAndMark, openElements, pathname, router]);

  // if current route is not in open elements, and routing is not currently underway
  useEffect(() => {
    if (!isRoutingRef.current && !currentElementState) {
      dispatch({ type: "addElement", element: urlElement });
    }
  }, [currentElementState, dispatch, urlElement]);

  // sync the current view to the state
  useEffect(() => {
    if (!isRoutingRef.current && currentElementState && urlElement.tab !== currentElementState.tab) {
      dispatch({ type: "updateElement", element: { ...currentElementState, tab: urlElement.tab } });
    }
  }, [urlElement, currentElementState, dispatch]);

  /**
   * Called when Drag ends within <DragDropContext>. Dispatches reorder event
   */
  const onDragEnd: OnDragEndResponder<string> = (result, _) => {
    if (result.destination.index !== result.source.index) {
      dispatch({
        type: "reorder",
        element: openElements.find((el) => el.elementID === result.draggableId),
        startIndex: result.source.index,
        endIndex: result.destination.index,
      });
    }
  };

  // ------- <DraggableTab> Helpers -------

  const handleTabClick = useCallback(
    (elToOpen: OpenElement) => {
      navigateAndMark(constructElementURL(elToOpen) + "?" + searchParams.toString());
    },
    [navigateAndMark, searchParams]
  );

  const handleCloseTab = useCallback(
    (elToClose: OpenElement) => {
      if (openElements.length > 1) {
        // only need to navigate if you're closing the tab that you're on
        const needToNavigate = elToClose.elementID === urlElement.elementID;
        if (needToNavigate) {
          const toCloseIndex = openElements.findIndex((openEl) => openEl.elementID === elToClose.elementID);

          //if elToClose is last tab, go to the tab on left. Else, go to the tab on the right
          const elToNavTo =
            toCloseIndex === openElements.length - 1 ? openElements[toCloseIndex - 1] : openElements[toCloseIndex + 1];

          navigateAndMark(constructElementURL(elToNavTo));
        }

        dispatch({ type: "removeElement", element: elToClose });
      }
    },
    [openElements, urlElement.elementID, dispatch, navigateAndMark]
  );

  //  ------- End <DraggableTab> Helpers -------

  //  ------- <OpenElementsTabsMenu> Helpers -------

  const moreThanOneElementOpen = openElements.length > 1;

  const handleCloseAll = useCallback(() => {
    dispatch({ type: "setState", state: [currentElementState] });
  }, [currentElementState, dispatch]);

  const handleSort = useCallback(() => {
    dispatch({
      type: "setState",
      state: [...openElements].sort((a, b) => {
        const typeComparison = SORT_ORDER.indexOf(a.elementType) - SORT_ORDER.indexOf(b.elementType);
        return typeComparison === 0 ? a.elementID.localeCompare(b.elementID) : typeComparison;
      }),
    });
  }, [openElements, dispatch]);

  // ------- End <OpenElementsTabsMenu> Helpers -------

  //  ------- "New Search" Button Helpers -------

  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);

  useEffect(() => {
    if (isMenuMounted && shouldFocusSearch) {
      const el = document.getElementById("mobile-search-component");
      if (el) {
        el.focus();
        setShouldFocusSearch(false); // reset the flag
      }
    }
  }, [isMenuMounted, shouldFocusSearch]);

  const handleFocusSearch = useCallback(() => {
    if (menuCanBeOpened) {
      // aka isMobile
      openMenu();
      setShouldFocusSearch(true); // defer focusing until menu is open
    } else {
      document.getElementById("desktop-search-component")?.focus();
    }
  }, [menuCanBeOpened, openMenu]);

  // ------- End "New Search" Button Helpers -------

  /**
   * Index of current route's element within internal state
   */
  const tabIndex = useMemo(() => {
    const index = openElements.findIndex((el) => el.elementID === urlElement.elementID);
    return index >= 0 ? index : 0; // Fix MUI invalid tab error. Return 0 on initial load when usePathname hasn't resolved
  }, [openElements, urlElement.elementID]);

  return (
    <TabContext value={tabIndex}>
      <Box display={"grid"} height={"100%"} gridTemplateRows={"auto minmax(0, 1fr)"} gridTemplateColumns={"minmax(0, 1fr)"}>
        {/* z index of scrollbar in DataGrid is 60 */}
        <Paper
          elevation={1}
          square
          sx={{ position: "sticky", top: "var(--header-height, 64px)", zIndex: 61 }}
          id="open-elements-tabs" //allows the querySelector in EntityDetailsLayout to find this to measure its height
        >
          <Stack direction={"row"}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
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
                      <DraggableTab
                        key={i}
                        index={i}
                        closable={openElements.length > 1}
                        element={element}
                        isSelected={urlElement.elementID === element.elementID}
                        handleCloseTab={handleCloseTab}
                        handleTabClick={handleTabClick}
                      />
                    ))}
                    {!snapshot.draggingFromThisWith && (
                      <Tooltip title="New Search" placement="right">
                        <Tab onClick={handleFocusSearch} icon={<Add fontSize="small" />} sx={{ minWidth: 0 }} />
                      </Tooltip>
                    )}
                    {/* Currently not using placeholder element, but could do so with the below */}
                    {/* {provided.placeholder} */}
                  </TabList>
                )}
              </Droppable>
            </DragDropContext>
            <OpenElementsTabsMenu
              handleCloseAll={moreThanOneElementOpen ? handleCloseAll : undefined}
              handleSort={moreThanOneElementOpen ? handleSort : undefined}
            />
          </Stack>
        </Paper>
        {/* Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ */}
        <TabPanel value={tabIndex} sx={{ p: 0 }} id="element-details-TabPanel">
          {children}
        </TabPanel>
      </Box>
    </TabContext>
  );
};
