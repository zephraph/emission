import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { RootContainer } from "react-relay"
import Routes from "../../../relay/routes"

import RelayArtistRail from "../ArtistRails/ArtistRail"

// WIP
storiesOf("Home - ArtistRail").add("Relay ", () => {
  const homeParams = new Routes.Home()
  return <RootContainer Component={RelayArtistRail} route={homeParams} />
})
