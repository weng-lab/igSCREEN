import { ApolloClient, InMemoryCache } from "@apollo/client"
import styled from "@emotion/styled"
import { Tab } from "@mui/material"
export const client = new ApolloClient({
  uri: "https://factorbook.api.wenglab.org/graphql",
  cache: new InMemoryCache(),
})

export const StyledTab = styled(Tab)(() => ({
  textTransform: "none",
}))