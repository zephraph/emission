import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"

import FlatWhite from "../FlatWhite"
import InvertedButton from "../InvertedButton"
import NavigationButton from "../NavigationButton"

const smallButton = { height: 26, width: 320, marginBottom: 20 }
const largeButton = { height: 26, width: 320, marginBottom: 20 }

storiesOf("Artsy Buttons")
  .addDecorator(story =>
    <View style={{ marginTop: 60, marginLeft: 20, marginRight: 20 }}>
      {story()}
    </View>
  )
  .add("Flat White", () => {
    return [
      <FlatWhite text="Default" style={smallButton} />,
      <FlatWhite text="Clickable" style={smallButton} onPress={() => ""} />,
    ]
  })
  .add("Inverted Button", () => {
    return [
      <View style={largeButton} key="1">
        <InvertedButton text="Default" />
      </View>,
      <View style={largeButton} key="2">
        <InvertedButton text="Clickable" onPress={() => ""} />
      </View>,
      <View style={largeButton} key="3">
        <InvertedButton text="In Progress..." inProgress={true} />
      </View>,
    ]
  })
  .add("Navigation Button", () => {
    return [<NavigationButton title="Default" href="/link/place" />]
  })
