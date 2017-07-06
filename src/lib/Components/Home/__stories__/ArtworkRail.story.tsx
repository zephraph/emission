import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import * as Relay from "react-relay"
import Routes from "../../../relay/routes"

import { Home } from "../../../Containers/Home"

import ArtistRail from "../ArtistRails/ArtistRail"
import HeroUnits from "../HeroUnits"

import RelayArtworkRail from "../ArtworkRails/ArtworkRail"

class FauxHome extends Home<any, any> {
  render() {
    const ref = ""
    const data = {
      __id: "asdadas",
      data: {
        hi: "OK",
      },
    }

    return <RelayArtworkRail ref={ref} key={data.__id} rail={data} />
  }
}

const newContainer = Relay.createContainer(FauxHome, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        hero_units(platform: MOBILE) {
          ${HeroUnits.getFragment("hero_units")}
        }
        artwork_modules(max_rails: -1,
                        max_followed_gene_rails: -1,
                        order: [
                          ACTIVE_BIDS,
                          RECOMMENDED_WORKS,
                          FOLLOWED_ARTISTS,
                          RELATED_ARTISTS,
                          FOLLOWED_GALLERIES,
                          SAVED_WORKS,
                          LIVE_AUCTIONS,
                          CURRENT_FAIRS,
                          FOLLOWED_GENES,
                          GENERIC_GENES]) {
          __id
          ${RelayArtworkRail.getFragment("rail")}
        }
        artist_modules {
          __id
          ${ArtistRail.getFragment("rail")}
        }
      }
    `,
  },
})

// WIP
storiesOf("Home - ArtworkRail").add("Relay ", () => {
  const homeParams = new Routes.Home()
  return <Relay.RootContainer Component={newContainer} route={homeParams} />
})
