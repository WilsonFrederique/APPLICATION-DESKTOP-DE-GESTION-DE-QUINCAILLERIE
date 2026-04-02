import PropTypes from 'prop-types';
import React from 'react';

const Bx = ({ icon, className = '' }) => (
    <i className={`bx bx-${icon} ${className}`} />
);

Bx.propTypes = {
    icon: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Bx;