import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import styles from '../css/sidebar.css';
import '../constants/fontAwesome.ts';
import { SummaryListProps } from '../types/sidebar';
import { connect } from 'react-redux';
import { STATE_DATA, STATE_HELPER } from '../redux/reducers';
import { DataState } from '../redux/reducers/data';
import { COURSE_MAIN_FUNC_LIST, SUMMARY_FUNC_LIST } from '../constants/function';
import { ContentInfo } from '../types/data';
import { HelperState } from '../redux/reducers/helper';

class SummaryList extends React.Component<SummaryListProps, null> {

  render() {
    const { numbers } = this.props;

    return (
      <List
        className={styles.numbered_list}
        component="nav"
        subheader={
          <ListSubheader component="div" disableSticky={true}>
            <FontAwesomeIcon icon={'thumbtack'} />
            <span className={styles.list_title}>{'通知汇总'}</span>
          </ListSubheader>
        }
      >
        {SUMMARY_FUNC_LIST.map(i => (
          <ListItem className={styles.sidebar_list_item} button={true} key={i.name}>
            <ListItemIcon className={styles.list_item_icon}>
              <FontAwesomeIcon icon={i.icon} />
            </ListItemIcon>
            <Badge
              badgeContent={numbers[i.type]}
              color="primary"
              invisible={i.type === undefined || numbers[i.type] === undefined}
            >
              <ListItemText primary={i.name} />
            </Badge>
          </ListItem>
        ))}
      </List>
    );
  }
};

const mapStateToProps = (state): SummaryListProps => {
  const helper = state[STATE_HELPER] as HelperState;
  if (!helper.loggedIn) return { numbers: {} };
  const data = state[STATE_DATA] as DataState;
  const numbers = {};
  for (const k of Object.keys(COURSE_MAIN_FUNC_LIST)) {
    const type = COURSE_MAIN_FUNC_LIST[k].type;
    const mapName = `${type}Map`;
    const map = data[mapName] as Map<string, ContentInfo>;
    let count = 0;
    for (const [_, c] of map.entries()) {
      if (!c.hasRead) count += 1;
    }
    numbers[type] = count;
  }
  return { numbers };
};

export default connect(mapStateToProps)(SummaryList);