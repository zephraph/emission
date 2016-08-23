/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, NativeModules } from 'react-native';
const { ARTemporaryAPIModule } = NativeModules;

import colors from '../../../../data/colors';
import ImageView from '../../opaque_image_view';
import SwitchBoard from '../../../modules/switch_board';
import InvertedButton from '../../buttons/inverted_button';
import Events from '../../../modules/events';

class ArtistCard extends React.Component {

  constructor(props) {
    super(props);
    this.handleFollowChange = this.handleFollowChange.bind(this);
    this.state = { following: false };
  }

  handleTap() {
    console.log("yo")
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href);
  }

  handleFollowChange() {
    ARTemporaryAPIModule.setFollowStatus(!this.state.following, this.props.artist._id, (error, following) => {
      if (error) {
        __DEV__ ? console.error(error) : console.log(error);
      } else {
        Events.postEvent(this, {
          name: following ? 'Follow artist' : 'Unfollow artist',
          artist_id: this.props.artist._id,
          artist_slug: this.props.artist.id,
          source_screen: 'home page',
        });
      }
      this.setState({ following: following });
    });
  }

  render() {
    const artist = this.props.artist;
    const imageURL = artist.image && artist.image.url;

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
          <View style={styles.touchableContainer}>
            <ImageView style={styles.image} imageURL={imageURL} />
            <View style={styles.textContainer}>
              <Text style={styles.sansSerifText}>{artist.name.toUpperCase()}</Text>
              <Text style={styles.serifText}>{artist.formatted_nationality_and_birthday}</Text>
              <Text style={[styles.serifText, styles.serifWorksText]}>{artist.formatted_artworks_count}</Text>
            </View>
            <View style={styles.followButton}>
              <InvertedButton text={this.state.following ? 'Following' : 'Follow'}
                              selected={this.state.following}
                              onPress={this.handleFollowChange} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // TODO The outer wrapping view is currently only there because setting `marginLeft: 16` on the Artist card from the
  //      ArtistRail component isn’t working.
  container: {
    width: 236,
    height: 310,
  },
  touchableContainer: {
    width: 220,
    height: 280,
    marginLeft: 16,
    borderColor: '#F3F3F3',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      height: 2,
      width: 0
    }

  },
  image: {
    width: 196,
    height: 148,
    marginTop: 12,
    marginLeft: 12,
  },
  textContainer: {
    marginLeft: 12,
    marginTop: 12,
  },
  sansSerifText: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
  },
  serifText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 16,
    marginBottom: -4,
    color: '#000000'
  },
    serifWorksText: {
    color: colors['gray-semibold'],
  },
  followButton: {
    marginTop: 18,
    marginLeft: 12,
    width: 196,
    height: 30,
  }
});

export default Relay.createContainer(ArtistCard, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        href
        name
        formatted_artworks_count
        formatted_nationality_and_birthday
        image {
          url(version: "large")
        }
      }
    `,
  }
});
