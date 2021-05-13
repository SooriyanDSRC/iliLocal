import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';

export default function Pagination(props) {
  return (
    <TablePagination
      component="div"
      count={props.totalCount}
      page={props.page}
      onChangePage={props.handleChangePage}
      rowsPerPage={props.rowsPerPage}
      onChangeRowsPerPage={props.handleChangeRowsPerPage}
    />
  );
}