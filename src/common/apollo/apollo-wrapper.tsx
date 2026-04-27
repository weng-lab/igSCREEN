"use client";

import React, { ReactNode } from "react";
import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
  ApolloClient,
} from "@apollo/client-integration-nextjs";
import Config from "../../config.json";

function makeClient() {
  if (typeof window === "undefined") {
    // SSR: hit the backend directly to avoid the /api/graphql proxy hop,
    // attaching the API key which is only available server-side.
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([
        new SSRMultipartLink({ stripDefer: true }),
        new HttpLink({
          uri: Config.API.CcreAPI,
          headers: { "api-key": process.env.SCREEN_API_KEY! },
        }),
      ]),
    });
  }

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: "/api/graphql" }),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}