import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const columns = [
  { id: 'ingredient', label: 'Ingredient', minWidth: 120 },
  { id: 'type', label: 'Type', minWidth: 80 },
  {
    id: 'include',
    label: 'Include',
    minWidth: 30,
    maxWidth: 60,
    align: 'center',
    format: (value) => value.toString(),
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: 'auto',
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [sortObject, setSortObject] = useState({
    order: 'desc',
    column: 'ingredient',
  });
  const [rowsPerPage, setRowsPerPage] = useState();

  useEffect(() => {
    setRowsPerPage(props.ingredients.length);
    setRows(props.ingredients);
  }, [props.ingredients]);

  const sortObjArray = (array, propertyToSortOn, desc, isString) => {
    return [...array].sort(function (a, b) {
      let x;
      let y;
      if (isString) {
        x = a[propertyToSortOn].toLowerCase();
        y = b[propertyToSortOn].toLowerCase();
      } else {
        x = a[propertyToSortOn];
        y = b[propertyToSortOn];
      }

      if (desc) {
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      } else {
        if (x > y) {
          return -1;
        }
        if (x < y) {
          return 1;
        }
        return 0;
      }
    });
  };

  const onClickHandler = (row) => {
    props.rowClick(row);
  };

  const sortColumns = (column) => {
    let isString = true;
    if (column === 'include') isString = false;
    if (sortObject.order === 'asc') {
      const sortedArray = sortObjArray(rows, column, true, isString);
      setRows(sortedArray);
      setSortObject({ order: 'desc', column: column });
    } else {
      const sortedArray = sortObjArray(rows, column, false, isString);
      setRows(sortedArray);
      setSortObject({ order: 'asc', column });
    }
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                    active={column.id === sortObject.column ? true : false}
                    direction={sortObject.order}
                    onClick={() => sortColumns(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    onClick={() => onClickHandler(row)}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'boolean' ? (
                            value === true ? (
                              <CheckRoundedIcon style={{ color: '#33cc00' }} />
                            ) : (
                              <ClearRoundedIcon style={{ color: 'red' }} />
                            )
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
