"use client";

import { createContext, Dispatch, useReducer } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";

export type OpenElement = { elementType: GenomicElementType; elementID: string, tab: TabRoute };

export type OpenElementsAction =
  | { type: "addElement"; element: OpenElement }
  | { type: "removeElement"; element: OpenElement }
  | { type: "updateElement"; element: OpenElement }
  | { type: "reorder"; element: OpenElement; startIndex: number; endIndex: number }
  | { type: "setState"; state: OpenElementsState }

export type OpenElementsState = OpenElement[];

const openElementsReducer = (openElements: OpenElementsState, action: OpenElementsAction) => {
  switch (action.type) {
    case "addElement": {
      if (openElements.some((el) => el.elementID === action.element.elementID)) {
        return openElements;
      } else {
        return [...openElements, action.element];
      }
    }
    case "removeElement": {
      if (openElements.length > 1) {
        return openElements.filter(
          (el) => el.elementID !== action.element.elementID || el.elementType !== action.element.elementType
        );
      } else return openElements;
    }
    case "updateElement": {
      return openElements.map((el) => (el.elementID === action.element.elementID ? action.element : el));
    }
    case "reorder": {
      const result = Array.from(openElements);
      const [removed] = result.splice(action.startIndex, 1);
      result.splice(action.endIndex, 0, removed);

      return result;
    }
    case "setState": {
      return action.state
    }
  }
};

export const OpenElementsContext = createContext<[OpenElementsState, Dispatch<OpenElementsAction>]>(null);

export const OpenElementsContextProvider = ({ children }) => {
  const [openElements, dispatch] = useReducer(openElementsReducer, []);

  return <OpenElementsContext.Provider value={[openElements, dispatch]}>{children}</OpenElementsContext.Provider>;
};
