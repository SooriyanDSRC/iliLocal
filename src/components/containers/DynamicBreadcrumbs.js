import React from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Breadcrumbs, Link } from '@material-ui/core';
import _ from 'lodash';
import { apiRouter, displayText, routerConstants, stringManipulationCheck } from '../../constant';

export default function DynamicBreadcrumbs() {
  const history = useHistory();
  return (
    <Breadcrumbs aria-label='breadcrumb'>
      <Link color='inherit' href={`#${apiRouter.MY_PROFILE}`}>
        {displayText.HOME}
      </Link>
      {
        _.eq(history.location.pathname, routerConstants.CLIENT_MANAGEMENT_URL) ? (
          <Typography color='textPrimary'>
            {displayText.CLIENT_MANAGEMENT}
          </Typography>
        ) : _.includes(history.location.pathname, apiRouter.CLIENT_URL_ROLES) ? (
          <Link color='inherit' href={`#${routerConstants.CLIENT_MANAGEMENT_URL}`}>
            {displayText.CLIENT_MANAGEMENT}
          </Link>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.startsWith(history.location.pathname, apiRouter.CLIENT_URL_ROLES) &&
        _.endsWith(history.location.pathname, apiRouter.USER_MANAGEMENT_URL_FOR_ROLES) ? (
        <Typography color='textPrimary'>
          {displayText.USER_MANAGEMENT}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.startsWith(history.location.pathname, apiRouter.CLIENT_URL_ROLES) &&
        _.endsWith(history.location.pathname, apiRouter.OPERATIONAL_AREA_URL_FOR_ROLES) ? (
        <Typography color='textPrimary'>
          {displayText.OPERATIONAL_AREA}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.eq(history.location.pathname, routerConstants.APPLICATION_ADMIN_URL) ? (
        <Typography color='textPrimary'>
          {displayText.APP_USER_BREADCRUMBS}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.eq(history.location.pathname, routerConstants.VENDOR_MANAGEMENT_URL) ? (
        <Typography color='textPrimary'>
          {displayText.VENDOR_MANAGEMENT}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.startsWith(history.location.pathname, apiRouter.CLIENT_URL_ROLES) &&
        _.endsWith(history.location.pathname, routerConstants.ROLE_MANAGEMENT_URL) ? (
        <Typography color='textPrimary'>
          {displayText.ROLE_MANAGEMENT}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.startsWith(history.location.pathname, apiRouter.DATA_IMPORT) ? (
        <Typography color='textPrimary'>
          {displayText.DATAIMPORT}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

      {_.startsWith(history.location.pathname, routerConstants.COMPANY_PROFILE_URL) ? (
        <Typography color='textPrimary'>
          {displayText.COMPANY_PROFILE}
        </Typography>) : (stringManipulationCheck.EMPTY_STRING)}

    </Breadcrumbs>
  );
}
