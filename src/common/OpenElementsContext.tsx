"use client";

import { createContext, Dispatch, useReducer } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";

export type OpenElement = { elementType: GenomicElementType; elementID: string, tab: TabRoute };

export type OpenElementsActionType = "add" | "remove" | "update";

export type OpenElementsAction = { type: OpenElementsActionType; element: OpenElement };

export type OpenElementsState = OpenElement[];

const openElementsReducer = (openElements: OpenElementsState, action: OpenElementsAction) => {
  switch (action.type) {
    case "add": {
      console.log("add:");
      console.log(action.element.elementID);
      if (openElements.some((el) => el.elementID === action.element.elementID)) {
        return openElements;
      } else {
        return [...openElements, action.element];
      }
    }
    case "remove": {
      console.log("remove:");
      console.log(action.element.elementID);
      if (openElements.length > 1) {
        return openElements.filter(
          (el) => el.elementID !== action.element.elementID || el.elementType !== action.element.elementType
        );
      } else return openElements;
    }
    case "update": {
      console.log("update")
      console.log(action.element.elementID);
      return openElements.map((el) => (el.elementID === action.element.elementID ? action.element : el));
    }
  }
};

export const OpenElementsContext = createContext<[OpenElementsState, Dispatch<OpenElementsAction>]>(null);

export const OpenElementsContextProvider = ({ children }) => {
  const [openElements, dispatch] = useReducer(openElementsReducer, []);

  return <OpenElementsContext.Provider value={[openElements, dispatch]}>{children}</OpenElementsContext.Provider>;
};
