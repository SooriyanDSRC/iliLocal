import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const LightToolTip = withStyles((theme) => ({
   tooltip: {
      backgroundColor: theme.palette.common.white,
      color: '#000000',
      opacity: 0.8,
      boxShadow: theme.shadows[1],
      fontSize: 14,
   },
}))(Tooltip);

export default LightToolTip;
