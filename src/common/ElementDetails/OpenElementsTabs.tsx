import { Close } from "@mui/icons-material";
import { styled, Tab, Tabs } from "@mui/material";
import { OpenElement, OpenElementsContext } from "common/OpenElementsContext";
import { constructElementURL } from "common/utility";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent as ReactMouseEvent, useContext, useEffect, useRef } from "react";
import { GenomicElementType } from "types/globalTypes";

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

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType;
  elementID: string;
};

export const OpenElementsTabs = ({ elementID, elementType }: ElementDetailsHeaderProps) => {
  const [openElements , dispatch] = useContext(OpenElementsContext);

  const router = useRouter();
  const isRouting = useRef(false);

  const navigateAndMark = (url: string) => {
    isRouting.current = true;
    router.push(url);
  };

  useEffect(() => {
    // Reset routing flag when pathname changes
    isRouting.current = false;
  }, [elementID]); //can I use elementID here instead

  useEffect(() => {
    // if current route is not in open elements
    if (!isRouting.current && !openElements.some((el) => el.elementID === elementID)) {
      dispatch({
        type: "add",
        element: {
          elementID,
          elementType,
        },
      });
    }
  }, [dispatch, elementID, elementType, openElements]);

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

  return (
    <Tabs
      value={elementID}
      id="open-elements-tabs"
      variant="scrollable"
      allowScrollButtonsMobile
      sx={{
        "& .MuiTabs-scrollButtons.Mui-disabled": {
          opacity: 0.3,
        },
      }}
    >
      {openElements.map((element, i) => (
        <Tab
          value={element.elementID}
          label={element.elementID}
          key={i}
          onClick={(e) => handleTabClick(e, element)}
          iconPosition="end"
          icon={<CloseTabButton {...element} />}
          sx={{ minHeight: "48px" }}
        />
      ))}
    </Tabs>
  );
};
