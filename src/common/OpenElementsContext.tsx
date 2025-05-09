"use client";

import { useParams, useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useReducer } from "react";
import { GenomicElementType } from "types/globalTypes";
import { constructElementURL } from "./utility";

export type OpenElement = { elementType: GenomicElementType; elementID: string };

/**
 * add: adds element, and sets it to be current element
 * remove: removes element, and sets new current element if applicable
 * navigateTo: sets element to be the current element
 * 
 * routing based on current element done in useEffect in OpenElementsContextProvider below
 */
// export type OpenElementsActionType = "add" | "remove" | "navigateTo"
export type OpenElementsActionType = "add" | "remove"


export type OpenElementsAction = { type: OpenElementsActionType; element: OpenElement }

export type OpenElementsState = { openElements: OpenElement[]; currentElement: OpenElement }

const openElementsReducer = (
  openElementsState: OpenElementsState,
  action: OpenElementsAction
) => {
  const { openElements, currentElement } = openElementsState;
  switch (action.type) {
    case "add": {
      console.log('add:')
      console.log(action.element.elementID)
      let newOpenElements: OpenElement[];
      if (openElements.some((el) => el.elementID === action.element.elementID)) {
        newOpenElements = openElements;
      } else {
        newOpenElements = [...openElements, action.element];
      }
      return {
        openElements: newOpenElements,
        currentElement: action.element,
      };
    }
    case "remove": {
      console.log('remove:')
      console.log(action.element.elementID)
      if (openElements.length > 1) {
        let newCurrentElement = currentElement;
        // only need to navigate if you're closing the tab that you're on
        const needToNavigate = action.element.elementID === currentElement.elementID;
        if (needToNavigate) {
          const toCloseIndex = openElements.findIndex((openEl) => openEl.elementID === action.element.elementID);

          //if elToClose is last tab, go to the tab on left. Else, go to the tab on the right
          newCurrentElement =
            toCloseIndex === openElements.length - 1 ? openElements[toCloseIndex - 1] : openElements[toCloseIndex + 1];
        }
        return {
          openElements: openElements.filter(
            (el) => el.elementID !== action.element.elementID || el.elementType !== action.element.elementType
          ),
          currentElement: newCurrentElement,
        };
      } else return openElementsState;
    }
    // case "navigateTo": {
    //   console.log("navigateTo:")
    //   console.log(action.element.elementID)
    //   return {
    //     ...openElementsState,
    //     currentElement: action.element,
    //   };
    // }
  }
};

export const OpenElementsContext = createContext<[OpenElementsState, Dispatch<OpenElementsAction>]>(null)

export const OpenElementsContextProvider = ({ children }) => {
  // const router = useRouter();
  // const params = useParams();

  const [{openElements, currentElement}, dispatch] = useReducer(openElementsReducer, { openElements: [], currentElement: null });

  // On initial load current element will be null. Layout will add. This shouldn't run
  // On opening new element current element will be stale. Layout will add, and set new to current. This shouldn't run
  // ^ Issue: This effect will run on the route change. Want it to only run after the currentElement is changed in this scenario
  // ^ This will route back to the stale version of current element.
  // ^ This could be eliminated by ensuring that the params.elementID is within open Elements
  // On tab switch, navigateTo is run. This changes currentElement. This effect should run and navigate
  // useEffect(() => {
  //   /**
  //    * We should avoid rerouting to currentElement when:
  //    * - currentElement is null (initial load)
  //    * - current route's element is not in openElements (its initial "add" dispatch event hasn't been performed in layout.tsx yet)
  //    */
  //   const shouldRoute =
  //     currentElement !== null &&
  //     openElements.some((el) => el.elementID === params?.elementID) &&
  //     params?.elementID !== currentElement?.elementID;

  //   if (shouldRoute) {
  //     console.log("Navigating to: " + JSON.stringify(currentElement.elementID));
  //     router.push(constructElementURL(currentElement));
  //   }
  // }, [currentElement, params, router]);

  return (
    <OpenElementsContext.Provider value={[{openElements, currentElement}, dispatch]}>{children}</OpenElementsContext.Provider>
  );
};
