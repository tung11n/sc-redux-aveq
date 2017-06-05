import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchSongsIfNeeded } from '../actions/PlaylistsActions';
import MobileSongs from '../components/MobileSongs';
import Songs from '../components/Songs';
import { getPlayingSongId } from '../utils/PlayerUtils';
import { toggleStream }  from '../utils/AveqUtils';

const propTypes = {
  isMobile: PropTypes.bool,
  clickCallback: PropTypes.func,
};

class SongsContainer extends Component {
  render() {
    const { isMobile } = this.props;
    if (isMobile) {
      return <MobileSongs {...this.props} />;
    }

    return <Songs {...this.props} />;
  }
  componentDidMount() {
    //createStream(this.props.playlist,'','digitalage','dfca6698a71b1d51bb9a2947270364a072664085212a5f5edaa87d0cdc52881a');
  }
}

SongsContainer.propTypes = propTypes;

function clickCallback(e) {
  e.preventDefault();
  toggleStream('Chill','');
}

function mapStateToProps(state) {
  const { authed, entities, environment, navigator, player, playlists } = state;
  const { height, isMobile } = environment;
  const { songs, users } = entities;
  const { query } = navigator.route;
  const playingSongId = getPlayingSongId(player, playlists);

  const time = query && query.t ? query.t : null;
  let playlist = query && query.q ? query.q : 'house';
  if (time) {
    playlist = `${playlist} - ${time}`;
  }

  return {
    authed,
    height,
    isMobile,
    playingSongId,
    playlist,
    playlists,
    scrollFunc: fetchSongsIfNeeded.bind(null, playlist),
    songs,
    time,
    users,
    clickCallback: clickCallback,
  };
}

export default connect(mapStateToProps)(SongsContainer);
