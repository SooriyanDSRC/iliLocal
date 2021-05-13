import React from 'react';
import packageJson from './../../../package.json';
import { CFooter } from '@coreui/react';

const Footer = () => {
  return (
    <CFooter fixed={false}>
      <div>©{packageJson.year} Cenozon Inc. All Rights Reserved. {packageJson.version}</div>
    </CFooter>
  );
};

export default React.memo(Footer);