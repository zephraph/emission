import React from "react"
import { Dimensions, FlatList, SectionList, TouchableWithoutFeedback, View } from "react-native"

import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import fonts from "lib/data/fonts"
import Switchboard from "lib/NativeModules/SwitchBoard"

import { GenericArtworksGrid } from "lib/Components/ArtworkGrids/GenericGrid"
import LotsByFollowedArtists from "./Components/LotsByFollowedArtists"
import SaleItem from "./Components/SaleItem"

const Container = styled.View`
  flex: 1;
  padding: 10px 15px;
`

const SectionHeader = styled.View`
  padding-top: 15px;
  padding-bottom: 10px;
  background-color: white;
`

const SectionTitle = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 25px;
  text-align: left;
  margin-left: 2px;
`

interface Props {
  sales: Array<{
    live_start_at: string | null
  }>
  lots: any
}

class Sales extends React.Component<Props, null> {
  handleTap({ item }) {
    Switchboard.presentNavigationViewController(this, item.href)
  }

  renderList(itemData) {
    const numColumns = Dimensions.get("window").width > 700 ? 4 : 2
    return (
      <FlatList
        contentContainerStyle={{ justifyContent: "space-between", padding: 5, display: "flex" }}
        data={itemData.data}
        numColumns={numColumns}
        keyExtractor={(item, index) => item.__id}
        renderItem={d => {
          return (
            <TouchableWithoutFeedback onPress={this.handleTap.bind(this, d)}>
              <View style={{ marginRight: 10, marginBottom: 10 }}>
                <SaleItem key={d.index} sale={d.item} />
              </View>
            </TouchableWithoutFeedback>
          )
        }}
      />
    )
  }

  renderLots(itemData) {
    const artworks: any = itemData.data.map(item => item.artwork)
    return <GenericArtworksGrid artworks={artworks} />
  }

  render() {
    const sales = this.props.sales
    const liveAuctions = sales.filter(a => !!a.live_start_at)
    const timedAuctions = sales.filter(a => !a.live_start_at)
    const lots = this.props.lots.hits

    const sections = [
      {
        data: [
          {
            data: liveAuctions,
          },
        ],
        id: "live-auctions",
        title: "Current Live Auctions",
      },
      {
        data: [
          {
            data: timedAuctions,
          },
        ],
        id: "timed-auctions",
        title: "Current Timed Auctions",
      },
      {
        data: [
          {
            data: lots,
          },
        ],
        id: "followed-artists",
        title: "Lots By Artists You Follow",
      },
    ]

    return (
      <SectionList
        contentContainerStyle={{
          justifyContent: "space-between",
          padding: 15,
          display: "flex",
        }}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={(item, index) => item.id}
        renderItem={(itemData: any) => {
          if (itemData.section.id === "followed-artists") {
            return this.renderLots(itemData.item)
          }
          return this.renderList(itemData.item)
        }}
        renderSectionHeader={({ section }) =>
          <SectionHeader>
            <SectionTitle>
              {section.title}
            </SectionTitle>
          </SectionHeader>}
      />
    )
  }
}

export default createFragmentContainer(Sales, {
  sales: graphql`
    fragment Sales_sales on Sale @relay(plural: true) {
      ...SaleItem_sale
      live_start_at
      href
    }
  `,
  lots: graphql`
    fragment Sales_lots on SaleArtwork {
      artwork {
        __id
        image {
          aspect_ratio
        }
        ...Artwork_artwork @relay(mask: false)
      }
    }
  `,
})
