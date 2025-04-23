import React from "react";
import PropTypes from "prop-types";

export default function BackgroundBadge({ imageUrl = "/logoHeader.png" }) {
  return (
    <div
      className="background-badge"
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-hidden="true"
    />
  );
}

BackgroundBadge.propTypes = {
  imageUrl: PropTypes.string,
};