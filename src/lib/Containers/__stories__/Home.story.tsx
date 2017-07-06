import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { RootContainer } from "react-relay"

import Routes from "../../relay/routes"
import Home from "../Home"

storiesOf("Home").add("Your Home Page", () => {
  const homeParams = new Routes.Home()
  return <RootContainer Component={Home} route={homeParams} />
})
