import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SvgIcon from "@material-ui/core/SvgIcon";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import { TreeView, TreeItem } from "@material-ui/lab";
import { Collapse, FormControlLabel, Checkbox, Card } from "@material-ui/core";
import { displayText, stringManipulationCheck } from "../../../constant";
import _ from 'lodash';
import { isNullUndefined, findFeatures } from "../../../components/shared/helper";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}
function TransitionComponent(props) {
  TransitionComponent.propTypes = {
    in: PropTypes.bool,
  };
  return <Collapse {...props} />;
}

const useStyles = makeStyles({
  root: {
    height: "100%",
    flexGrow: 1,
    border: "solid 1px #c5c5c5",
    backgroundColor: "#ffffff",
    padding: "25px",
    maxWidth: "100% !important"
  },
  editIconSize: {
    padding: "6px !important",
    fontSize: "20px !important"
  },
  spinnerStyle: {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto"
  },
  tableHeader: {
    marginTop: "20px",
    backgroundColor: " #036290",
    color: "#ffffff"
  }
});

export default function FeaturesWorkflowTreeView(props) {
  const classes = useStyles();
  const StyledTreeItem = withStyles((theme) => ({
    iconContainer: {
      "& .close": {
        opacity: 0.3,
      }
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    }
  }))((props) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} />
  ));
  const roleItems = [displayText.ADD_ROLE, displayText.EDIT_ROLE, displayText.DELETE_ROLE];
  const hideRoleManagementTreeItems = [displayText.CLIENT_ADMIN, displayText.APPLICATION_ADMIN];
  const handleLabelClick = (e, content, index) => {
    if (content.name === displayText.ROLE_MANAGEMENT && !_.includes(hideRoleManagementTreeItems, props.roleName) ||
      content.name === displayText.MY_PROFILE || !isRoleEditable) {
      e.preventDefault();
      return
    }
    e.preventDefault();
    props.handleFeaturesCheck(e, content, index);
  };
  const [isRoleEditable, setIsRoleEditable] = useState(false);

  useEffect(() => {
    let role = findFeatures(props?.userRoles?.operations, displayText.EDIT_ROLE);
    if (isNullUndefined(role))
      setIsRoleEditable(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.userRoles])

  return (
    <Card>
      <TreeView
        className={classes.root}
        defaultExpanded={["1"]}
        defaultExpandIcon={<PlusSquare />}
        defaultCollapseIcon={<MinusSquare />}>
        {props.content?.map((operations, index) => {
          return (
            <div key={operations?.featuresGuid}>
              <StyledTreeItem
                nodeId={index.toString()}
                key={operations.name}
                onLabelClick={(e) => handleLabelClick(e, operations)}
                label={
                  <FormControlLabel
                    key={operations.isActive + stringManipulationCheck.UNDERSCORE_OPERATOR + index}
                    control={operations.name === displayText.ROLE_MANAGEMENT && !_.includes(hideRoleManagementTreeItems, props.roleName) ||
                      operations.name === displayText.MY_PROFILE || (!isRoleEditable && props.action === displayText.EDIT) ?
                      <Checkbox
                        disabled
                        className="disabled"
                        checked={operations.isActive} /> : <Checkbox
                        name="checkedB"
                        color="primary"
                        checked={operations.isActive}
                        indeterminate={operations?.indeterminate} />
                    }
                    label={operations.name} />
                }>
                {operations.operations &&
                  operations.operations.map((operations, cIndex) => {
                    return (
                      <StyledTreeItem
                        key={operations.operationsGuid}
                        nodeId={`${index + stringManipulationCheck.EMPTY_STRING + cIndex}`}
                        className={(_.includes(roleItems, operations.name) && !_.includes(hideRoleManagementTreeItems, props.roleName)) ||
                          operations.name === displayText.MY_PROFILE || (!isRoleEditable && props.action === displayText.EDIT) ?
                          (classes.checkBox, "disabled") : classes.checkBox
                        }
                        label={operations.name}
                        endIcon={_.includes(roleItems, operations.name) && !_.includes(hideRoleManagementTreeItems, props.roleName) ||
                          operations.name === displayText.MY_PROFILE || (!isRoleEditable && props.action === displayText.EDIT) ?
                          <Checkbox
                            disabled
                            className="mg-lt-35 disabled"
                            checked={operations.isActive} />
                          : <Checkbox
                            className={(classes.checkBox, "mg-lt-35")}
                            checked={operations.isActive}
                            onChange={(e) => props.handleFeaturesCheck(e, operations, cIndex, operations, index)} />
                        } />
                    );
                  })}
              </StyledTreeItem>
            </div>
          );
        })}
      </TreeView>
    </Card>
  );
}