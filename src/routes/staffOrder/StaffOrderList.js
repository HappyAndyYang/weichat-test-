import React, { Component } from 'react';
import { NavBar, Icon, PullToRefresh } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from '../deviceManager/deviceManager.less';

import StaffOrderLists from '../../components/StaffOrder/StaffOrderList';

// const workList = [];
@connect(({ stafforderlist, stafflogin }) => ({ stafforderlist, stafflogin }))
class StaffOrderList extends Component {
  componentDidMount() {
    this.queryWorkOrderList();
  }
  queryWorkOrderList() {
    const {
      dispatch,
      stafforderlist: { pagination: { pagesize, current } },
    } = this.props;
    const { data: { staffid } } = JSON.parse(localStorage.stafflogin);
    dispatch({
      type: 'stafforderlist/init',
      payload: '',
    });
    dispatch({
      type: 'stafforderlist/getStaffOrderList',
      payload: { staffid, pagesize, current },
    });
  }
  refresh = () => {
    const {
      dispatch,
      stafforderlist: { pagination: { pagesize, current, total } },
    } = this.props;
    const { data: { staffid } } = JSON.parse(localStorage.stafflogin);
    let page = current;
    if (total >= pagesize) {
      page = current + 1;
      dispatch({
        type: 'stafforderlist/getStaffOrderList',
        payload: { staffid, pagesize, currentpage: page },
      });
    }
  }
  logout = () => {
    const { dispatch } = this.props;
    localStorage.removeItem('stafflogin');
    dispatch(routerRedux.push('/stafflogin'));
  }
  render() {
    const { dispatch, stafforderlist: { status, data: { list } } } = this.props;
    // workList.push(...list);
    return (
      <div>
        <NavBar
          mode="light"
          className={styles.navbar}
          rightContent={
            <div
              key="1"
              style={{
                background: '#FFCC00',
                fontSize: 14,
                marginRight: 15,
              }}
              onClick={this.logout}
            >
              退出
            </div>
          }
        >
          工单列表
        </NavBar>
        <PullToRefresh
          damping={60}
          style={{
            height: document.documentElement.clientHeight,
            overflow: 'auto',
          }}
          indicator={{ deactivate: '上拉可以刷新' }}
          direction="up"
          onRefresh={this.refresh}
        >
          { status ?
            <Icon type="loading" className={styles.loading} size="lg" />
            :
            <StaffOrderLists dispatch={dispatch} datalist={list} status={status} />
          }
        </PullToRefresh>
      </div>
    );
  }
}

export default StaffOrderList;
