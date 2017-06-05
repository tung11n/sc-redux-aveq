import React, { Component, PropTypes } from 'react';
import { navigateTo } from '../actions/NavigatorActions';
import { constructUrl } from '../utils/RouteUtils';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  title: PropTypes.string,
  clickCallback: PropTypes.func,
};

class Link extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { dispatch, route, clickCallback } = this.props;
    if (clickCallback) {
      clickCallback(route);
    }
    dispatch(navigateTo(route));
  }

  render() {
    const { children, className, route, title } = this.props;

    return (
      <a
        className={className}
        href={`/#/${constructUrl(route)}`}
        onClick={this.handleClick}
        title={title ? String(title) : ''}
      >
        {children}
      </a>
    );
  }
}

Link.propTypes = propTypes;

export default Link;
