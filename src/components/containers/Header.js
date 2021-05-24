import React from 'react';
import { CHeader, CHeaderNav, CSubheader } from '@coreui/react';
import DynamicBreadcrumbs from './DynamicBreadcrumbs';
import { HeaderDropdown } from './index';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { updateSideBarVisibility } from '../../store/action/sideBarAction';
import { useDispatch } from 'react-redux';

const Header = () => {
  const dispatch = useDispatch();
  const onSideBarToggle = () => {
    dispatch(updateSideBarVisibility(true));
  };

  return (
    <CHeader withSubheader>
      <CHeaderNav className='d-md-down-none mr-auto'>
        <CSubheader
          className='justify-content-between'
          style={{ borderTop: '0px', paddingTop: '15px', marginLeft: '6%' }}   >
          <DynamicBreadcrumbs />
        </CSubheader>
      </CHeaderNav>
      <CHeaderNav className="d-lg-none d-md-block d-sm-block toggle-bar">
        <IconButton onClick={(e) => onSideBarToggle()}>
          <MenuIcon className="menu-bar-icon" />
        </IconButton>
      </CHeaderNav>
      <CHeaderNav >
        <HeaderDropdown />
      </CHeaderNav>
    </CHeader>
  );
};

export default Header;
