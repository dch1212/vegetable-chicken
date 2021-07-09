import React, { Component } from 'react';
import { Table, Spin, Button, Select } from 'bach-antd';
import { Modal } from 'antd';
import Request from 'BizUtils/Request';
import { observer } from 'mobx-react';
import { pageOption } from 'BizConfig/constant.js';
import store from '../store';
import storeOverview from '../../AbnormalOverview/store';
import '../index.scss';
import MyCheckbox from '../../Component/MyCheckbox';
import createHistory from 'history/createBrowserHistory';

const Option = Select.Option;
const { pathname, origin, search } = window.location;
const localStorage = window.localStorage;
const btnStyle = {
  position: 'absolute',
  // display: 'inline-block',
  marginLeft: '870px',
  // marginTop: '-29px',
  // bottom: 28,
};
const history = createHistory();
const location = history.location;
history.listen((location, action) => {
  if (action === 'POP') {
    window.instance.routerstate = 'pop';
    window.instance.onChangeUrl();
    window.instance.onSearch();
    window.myCheckboxInstance.changeNum();
  } else {
    window.instance.routerstate = 'push';
  }
});
@observer
class AbnormalIndex extends Component {
  constructor(props) {
    super(props);
    this.page = {
      curPage: 1,
      pageSize: 10,
    };
    this.state = {
      visible: false,
      title: 'bug追踪',
      nameList: [],
      data: [],
      value: [],
      fetching: false,
      changeStatus: false,
      needpage: 1,
      // udid: query.id.udid ? query.id.udid : '',

    };
    this.lastFetchId = 0;
  }
  componentDidMount() {
    store.fetchVersionList();

    window.instance = this;
    // console.log(storeOverview.scoDataList);
    storeOverview.purposes = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).purposes : [];
    storeOverview.model = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).model : [];
    storeOverview.inputValue = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).appsSearch : [];
    storeOverview.inpValue = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).appsValue : [];
    storeOverview.startTime = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).startTime : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`;
    storeOverview.endTime = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).endTime : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`;
    storeOverview.stackInfo = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).stackInfo : '';
    storeOverview.udid = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).udid : '';
    storeOverview.crashType = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).crashType : [];
    storeOverview.scope = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).scope : [];
    storeOverview.projectId = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).projectId : [];
    storeOverview.statusData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).status : [];

    this.changeStatusStr();
    this.changeScopeStr();
    this.onSearch();
    // this.stringToQuery().id || this.stringToQuery().pid ? this.onSearch() : store.fetchTabListAll();
  }
  changeStatusStr = () => {
    storeOverview.fetchCheckData();
    const needDataStatus = [];
    const status = storeOverview.checkDataList.status;
    if (status) {
      status.forEach((v) => {
        if (storeOverview.statusDataList) {
          storeOverview.statusDataList.forEach((innerV) => {
            if (v.value === innerV) {
              needDataStatus.push(v.key);
            }
          });
        }
      });
      return needDataStatus;
    }
  };
  changeScopeStr = () => {
    storeOverview.fetchCheckData();
    const needDataScope = [];
    const scope = storeOverview.checkDataList.scope;
    if (scope) {
      scope.forEach((v) => {
        storeOverview.scoData.forEach((innerV) => {
          if (v.description === innerV) {
            needDataScope.push(v.id);
          }
        });
      });
      return needDataScope;
    }
  };
  stringToQuery = () => {// eslint-disable-line
    const string = window.location.search;
    const matches = string.match(/([^\?\=\&]+\=[^\&]+)/g);// eslint-disable-line
    const query = {};
    if (matches) {
      matches.forEach((tmp) => {
        const kv = tmp.split('=');
        kv[1] && kv[1] !== 'undefined' && kv[1] !== 'null' && (query[kv[0]] = decodeURIComponent(kv[1]));// eslint-disable-line
      });
    }
    return query;
  }
  onChageType = (crashType) => {
    store.crashType = crashType;
    // console.log(crashType);
    // const { pageSize } = this.page;
    store.apiParam[1].field = crashType ? 'crashType' : '';
    store.apiParam[1].value = crashType ? Number(crashType) : '';
    store.apiParam[3].field = '';
    store.apiParam[3].value = '';
    this.resetSorter();
    // 选类型时先不注释
    // store.fetchTabList(1, pageSize);
  }
  // 通过url把信息变回搜索用的信息 不然格式不对
  onChangeUrl() {
    // console.log('changeurl');
    return new Promise((resolve) => {
      const getvalue = this.stringToQuery().pid ? this.stringToQuery().pid.toString() : this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).appsSearch : [];// 取到urlapp应用中的搜索值
      const checkValue = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).pid_vid : '';// 判断是否是vid表格调过来 如果为true是
      // const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
      const value = [];
      if (getvalue) {
        value.push(getvalue.toString());
      }
      const arr = [];
      const formData = [];
      this.setState({ value });
      if (checkValue) { // 第二个表格跳过来的处理
        const obj = {};
        obj.appId = checkValue.toString();
        const checkArr = [];
        checkArr.push(JSON.parse(getvalue).c);
        obj.vids = checkArr;
        formData.push(obj);
        store.inputValue = value;
        // 搜索条件
        storeOverview.inpValue = formData;
        resolve(formData);
      } else if ((typeof getvalue) === 'string' && !checkValue) { // 第一个表格的处理
        value.forEach((v) => {
          arr.push(JSON.parse(v));
        });
        const obj = {};
        obj.appId = JSON.parse(getvalue).p || value[0];
        obj.vids = JSON.parse(getvalue).c ? [JSON.parse(getvalue).c] : [];
        formData.push(obj);
        store.inputValue = value;
        // 搜索条件
        storeOverview.inpValue = formData;
        resolve(formData);
      } else { // 其他表格调过来的
        if (getvalue) {
          getvalue.forEach((v) => {
            arr.push(JSON.parse(v));
          });
        }

        arr.map((v) => {// eslint-disable-line
          const obj = {};
          if (typeof (v) === 'number') {
            obj.appId = v.toString();
            obj.vids = [];
            formData.push(obj);
          } else {
            if (obj.appId === v.p) {
              obj.vids.push(v.c);
            } else {
              obj.appId = v.p;
              obj.vids = [v.c];
            }
            formData.push(obj);
          }
        });
        store.inputValue = value;
        // 搜索条件
        store.inpValue = [...new Set(formData)];
        resolve([...new Set(formData)]);
      }
    }
    );
  }
  // 从上个页面拿回来的方法 配合上面那个改格式
  changeData() {
    return new Promise((resolve) => {
      storeOverview.fetchCheckData()
        .then(() => resolve((storeOverview.checkDataList.apps || []).map(item => ({
          label: item.appName,
          key: item.appId,
          value: item.appId,
          children: item.vids.map((i, n) => ({
            label: i,
            value: JSON.stringify({ c: i, p: item.appId }),
            key: `${item.appId}-${item.appId}-${i}-${n}`,
          })),
        }))));
    });
  }
  makesure() {
    // this.onChangeUrl();
    const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
    if (this.stringToQuery().pid) {
      storeOverview.makesureUrl = {
        purposes: this.routerstate === 'pop' ? serData.purposes : storeOverview.purposesList,
        model: this.routerstate === 'pop' ? serData.model : storeOverview.modelList,
        appsSearch: this.routerstate === 'pop' ? serData.appsSearch : this.stringToQuery().pid.toString(),
        appsValue: this.routerstate === 'pop' ? serData.appsValue : this.stringToQuery().pid ? [{ appId: this.stringToQuery().pid.toString(), vids: [] }] : storeOverview.inpValue,
        startTime: this.routerstate === 'pop' ? serData.startTime : storeOverview.startTime,
        endTime: this.routerstate === 'pop' ? serData.endTime : storeOverview.endTime,
        stackInfo: this.routerstate === 'pop' ? serData.stackInfo : storeOverview.stackInfo,
        udid: this.routerstate === 'pop' ? serData.udid : storeOverview.udid,
        crashType: this.routerstate === 'pop' ? serData.crashType : store.crashType || serData.crashType,
        scope: this.routerstate === 'pop' ? serData.scope : storeOverview.scoDataList.length === 0 && storeOverview.scopeNull ? [] : typeof (storeOverview.scoDataList[0]) === 'string' ? this.changeScopeStr() : storeOverview.scoDataList.length === 0 ? storeOverview.scopeList : storeOverview.scoDataList,
        projectId: this.routerstate === 'pop' ? serData.projectId : storeOverview.projectId,
        status: this.routerstate === 'pop' ? serData.status : typeof (storeOverview.statusDataList[0]) === 'string' ? this.changeStatusStr() : storeOverview.statusDataList,
      };
      window.myCheckboxInstance.setState({
        value: this.stringToQuery().pid.toString(),
      });
    } else {
      storeOverview.makesureUrl = {
        purposes: this.routerstate === 'pop' ? serData.purposes : storeOverview.purposesList || serData.purposes,
        model: this.routerstate === 'pop' ? serData.model : storeOverview.modelList,
        appsSearch: this.routerstate === 'pop' ? serData.appsSearch : storeOverview.inputVal,
        appsValue: this.routerstate === 'pop' ? serData.appsValue : this.stringToQuery().pid ? [{ appId: this.stringToQuery().pid.toString(), vids: [] }] : storeOverview.appsNull ? [] : storeOverview.inpValue,
        startTime: this.routerstate === 'pop' ? serData.startTime : storeOverview.startTime,
        endTime: this.routerstate === 'pop' ? serData.endTime : storeOverview.endTime,
        stackInfo: this.routerstate === 'pop' ? serData.stackInfo : storeOverview.stackInfo,
        udid: this.routerstate === 'pop' ? serData.udid : storeOverview.udid,
        crashType: this.routerstate === 'pop' ? serData.crashType : store.crashType || serData.crashType,
        scope: this.routerstate === 'pop' ? serData.scope : storeOverview.scoDataList.length === 0 && storeOverview.scopeNull ? [] : typeof (storeOverview.scoDataList[0]) === 'string' ? this.changeScopeStr() : storeOverview.scoDataList.length === 0 ? storeOverview.scopeList : storeOverview.scoDataList,
        projectId: this.routerstate === 'pop' ? serData.projectId : storeOverview.projectId,
        status: this.routerstate === 'pop' ? serData.status : storeOverview.statusDataList ? typeof (storeOverview.statusDataList[0]) === 'string' ? this.changeStatusStr() : storeOverview.statusDataList : storeOverview.statusDataList,
      };
    }
    if (this.routerstate !== 'pop') {
      history.push({
        pathname: '/crash-platform/web/AbnormalAnalysis',
        search: `id=${encodeURIComponent(JSON.stringify(storeOverview.makesureUrlList))}`,
        state: { some: 'state' },
      });
      this.routerstate = 'push';
    }
  }
  // 点击搜索按钮 添加各种乱七八糟的东西
  onSearch = () => {
    const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
    // if (this.stringToQuery().pid) {
    //   this.makesure();
    // }
    if (this.stringToQuery().id) {
      let numPurposes = [];
      let numPurScope = [];
      const numModel = typeof (serData.model) === 'string' ?
        [serData.model] :
        serData.model;
      if (serData.purposes) {
        numPurposes = typeof (serData.purposes) === 'number' ?
          [serData.purposes] :
          serData.purposes;
      }
      if (serData.purScope) {
        numPurScope = typeof (serData.purScope) === 'number' ?
          [serData.purScope] :
          serData.purScope;
      }
      // this.onChangeUrl().then((res) => {
      this.makesure();
      storeOverview.makesureSearch = {
        // 搜索第二个页面，带来的信息加不上去，判断一下
        purposeids: storeOverview.makesureUrlList.purposes ? storeOverview.makesureUrlList.purposes.length === 0 ? [] : typeof (storeOverview.makesureUrlList.purposes) === 'number' ? [storeOverview.makesureUrlList.purposes] : storeOverview.makesureUrlList.purposes : [],
        model: storeOverview.makesureUrlList.model ? storeOverview.makesureUrlList.model.length === 0 ? [] : Array.isArray(storeOverview.makesureUrlList.model) === true ? storeOverview.makesureUrlList.model : [storeOverview.makesureUrlList.model] : [],
        // status: storeOverview.makesureUrlList.status,
        status: storeOverview.makesureUrlList.status,

        apps: storeOverview.makesureUrlList.appsValue,

        startTime: storeOverview.makesureUrlList.startTime,
        endTime: storeOverview.makesureUrlList.endTime,
        udid: storeOverview.makesureUrlList.udid,
        stackInfo: storeOverview.makesureUrlList.stackInfo,
        crashType: Number(storeOverview.makesureUrlList.crashType),
        scope: serData.purScope ? [serData.purScope] : serData.scope ? storeOverview.makesureUrlList.scope.length === 0 ? [] : storeOverview.makesureUrlList.scope : [],
        projectId: storeOverview.makesureUrlList.projectId,
      };
      store.searchInfo = storeOverview.makesureSearch;
      store.fetchCrashAndEffectiveDeviceTotal(storeOverview.makesureSearch);
      store.fetchTabList(storeOverview.makesureSearch);
      // });
    } else if (this.stringToQuery().pid) {// eslint-disable-line
      storeOverview.makesureSearch = { // 直接通过pid跳到第二个页面
        purposeids: storeOverview.purposesList,
        model: storeOverview.modelList,
        status: storeOverview.statusDataList,
        apps: storeOverview.inpValueSearch.length === 0 ? [{ appId: this.stringToQuery().pid.toString(), vids: [] }] : storeOverview.inpValueSearch,// eslint-disable-line
        startTime: storeOverview.startTime,
        endTime: storeOverview.endTime,
        scope: storeOverview.scoData,
        udid: storeOverview.udid,
        stackInfo: storeOverview.stackInfo,
        crashType: Number(store.crashType),
        projectId: store.projectId,
      };
      store.searchInfo = storeOverview.makesureSearch;
      store.fetchCrashAndEffectiveDeviceTotal(storeOverview.makesureSearch);
      store.fetchTabList(storeOverview.makesureSearch);
      // storeOverview.makesureUrlList.appsValue = storeOverview.makesureSearch.apps;
      storeOverview.inpValue = storeOverview.makesureSearch.apps;
      storeOverview.makesureUrl = {
        purposes: this.routerstate === 'pop' ? serData.purposes : storeOverview.purposesList || serData.purposes,
        model: this.routerstate === 'pop' ? serData.model : storeOverview.modelList,
        appsSearch: this.routerstate === 'pop' ? serData.appsSearch : storeOverview.inputVal,
        // appsValue:[]
        appsValue: this.routerstate === 'pop' ? serData.appsValue : this.stringToQuery().pid ? [{ appId: this.stringToQuery().pid.toString(), vids: [] }] : storeOverview.inpValue,
        appsValue: this.routerstate === 'pop' ? serData.appsValue : this.stringToQuery().pid ? [{ appId: this.stringToQuery().pid.toString(), vids: [] }] : storeOverview.appsNull ? [] : storeOverview.inpValue,
        startTime: this.routerstate === 'pop' ? serData.startTime : storeOverview.startTime,
        endTime: this.routerstate === 'pop' ? serData.endTime : storeOverview.endTime,
        stackInfo: this.routerstate === 'pop' ? serData.stackInfo : storeOverview.stackInfo,
        udid: this.routerstate === 'pop' ? serData.udid : storeOverview.udid,
        crashType: this.routerstate === 'pop' ? serData.crashType : store.crashType || serData.crashType,
        scope: this.routerstate === 'pop' ? serData.scope : storeOverview.scoDataList.length === 0 && storeOverview.scopeNull ? [] : typeof (storeOverview.scoDataList[0]) === 'string' ? this.changeScopeStr() : storeOverview.scoDataList.length === 0 ? storeOverview.scopeList : storeOverview.scoDataList,
        projectId: this.routerstate === 'pop' ? serData.projectId : storeOverview.projectId,
        status: this.routerstate === 'pop' ? serData.status : storeOverview.statusDataList ? typeof (storeOverview.statusDataList[0]) === 'string' ? this.changeStatusStr() : storeOverview.statusDataList : storeOverview.statusDataList,
      };
      if (this.routerstate !== 'pop') {
        history.push({
          pathname: '/crash-platform/web/AbnormalAnalysis',
          search: `id=${encodeURIComponent(JSON.stringify(storeOverview.makesureUrlList))}`,
          state: { some: 'state' },
        });
        this.routerstate = 'push';
      }
    } else { // 直接打开第二个页面
      this.makesure();
      storeOverview.makesureSearch = {
        purposeids: storeOverview.makesureUrlList.purposes,
        model: storeOverview.makesureUrlList.model,
        status: storeOverview.makesureUrlList.status,
        apps: storeOverview.makesureUrlList.appsValue,
        startTime: storeOverview.makesureUrlList.startTime,
        endTime: storeOverview.makesureUrlList.endTime,
        scope: storeOverview.makesureUrlList.scope,
        udid: storeOverview.makesureUrlList.udid,
        stackInfo: storeOverview.makesureUrlList.stackInfo,
        crashType: Number(store.crashType),
        projectId: store.projectId,
      };
      store.searchInfo = storeOverview.makesureSearch;
      store.fetchCrashAndEffectiveDeviceTotal(storeOverview.makesureSearch);
      store.fetchTabList(storeOverview.makesureSearch);
      // });
    }
    window.instance.routerstate = 'push';
  }

  onUdidInput = (e) => {
    const udid = e.target.value;
    storeOverview.udid = e.target.value;
    store.apiParam[4].field = udid ? 'udid' : '';
    store.apiParam[4].value = udid;
  }

  onCrashStackInput = (e) => {
    const stack = e.target.value;
    storeOverview.stackInfo = e.target.value;
    store.apiParam[2].field = stack ? 'crashStack' : '';
    store.apiParam[2].value = stack;
  }

  resetSorter = () => {
    store.orderBy = '';
    store.asc = '';
  }

  onClick = (record) => {
    const str = encodeURIComponent(JSON.stringify(storeOverview.makesureSearch));

    const searchParam = `?id=${str}&`;
    const href = `${origin}${pathname}${searchParam}application=${record.aggMd5}`;
    window.open(href);
  }

  onShowSizeChange = (curPage, pageSize) => {
    this.page = {
      curPage: 1,
      pageSize,
    };
    store.fetchTabList(storeOverview.makesureSearch, 1, pageSize);
  }

  onChange = (curPage, pageSize, sorter) => {
    this.page = {
      curPage,
      pageSize,
    };
    this.setState({
      needpage: curPage,
    });
    store.fetchTabList(storeOverview.makesureSearch, curPage, pageSize, sorter);
  }

  tableChangeHandler = (pagination, filters, sorter) => {
    const { field = '', order = '' } = sorter;

    // console.log(sorter.column.sortOrder);
    if (field !== '' && order !== '') {
      const orderBy = field;
      const asc = order === 'ascend' ? 'true' : 'false';
      if (store.asc !== asc || store.orderBy !== orderBy) {
        store.orderBy = orderBy;
        store.asc = asc;
        // console.log(orderBy, sorter.column.sortOrder, asc);
        store.fetchTabList(storeOverview.makesureSearch, this.page.curPage, this.page.pageSize, sorter.column.sortOrder, asc);// eslint-disable-line
      }
    }
  }
  makeSorterOrder = (colomnName) => {
    if (store.orderBy === colomnName) {
      if (store.asc === 'true') {
        return 'ascend';
      }
      return 'descend';
    }
    return false;
  }
  // makeSorterOrder = colomnName => colomnName
  handleCancel = () => {
    this.setState({
      visible: false,
      value: [],
    });
  }
  // 点击出弹窗
  onClickJira = (record) => {
    this.setState({
      value: [],
      visible: true,
      aggMd5: record.aggMd5,
      record,
    });
  }
  // 弹窗确定
  handleOK = r => () => {// eslint-disable-line
    Request.post('/crashPlatform/web/createJira', {
      data: {
        assignors: this.state.findvalue.map(i => i),
        aggMd5: this.state.aggMd5,
      },
    }).then((res) => {
      if (res.status === 0) {
        store.fetchTabList(storeOverview.makesureSearch, this.state.needpage, 10);
      }
    });
    this.setState({
      visible: false,
      findvalue: [],
      changeStatus: true,
    });
  }
  // 改scope的id 为了查接口
  // onChange1 = (value) => {
  //   const scoData = [];
  //   storeOverview.checkDataList.scope.forEach((v) => {
  //     value.forEach((innerV) => {
  //       if (v.description === innerV) {
  //         scoData.push(v.id);
  //       }
  //     });
  //   });
  //   storeOverview.scoData = scoData;
  //   storeOverview.makesureSearch = {
  //     purposeids: storeOverview.purposesList,
  //     model: storeOverview.modelList,
  //     status: storeOverview.statusDataList,
  //     apps: storeOverview.inpValueSearch,
  //     scope: storeOverview.scoDataList,
  //   };
  // }
  handleChange = (findvalue) => {
    this.setState({
      findvalue,
      data: [],
      fetching: false,
    });
  }
  // 拿到弹窗人员信息
  fetchUser = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    Request.get('/crashPlatform/web/assignor', { data: { name: value } })
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.data.map(user => ({
          text: `${user.name}(${user.id})`,
          value: user.id,
        }));
        this.setState({ data, fetching: false });
      });
  }
  render() {
    const { fetching, data } = this.state;
    const columns = [{
      title: `异常问题 ( ${store.tableListData.totalCount || 0} ) (崩溃总数：${store.crashAndEffectiveDeviceTotal.crashTotal || 0}， 影响设备总数量：${store.crashAndEffectiveDeviceTotal.effectDeviceTotal || 0})`,
      dataIndex: 'crashMsgAll',
      render: (text, record) => (
        <div>
          <div className="green">
            <a onClick={() => { this.onClick(record); }}>
              {record.jsProjectId ? `【${record.jsProjectId}】` : ''}#{record.aggMd5} {record.crashMsg}
            </a>
          </div>
        </div>
      ),
    }, {
      title: '首次上报',
      dataIndex: 'firstReportTime',
      width: 150,
    }, {
      title: '最近上报',
      dataIndex: 'latestReportTime',
      width: 150,
      sorter: true,

      sortOrder: this.makeSorterOrder('latestReportTime'),
    }, {
      title: '崩溃次数',
      dataIndex: 'crashCount',
      width: 100,
      sorter: true,

      sortOrder: this.makeSorterOrder('crashCount'),
    }, {
      title: '影响设备数量',
      dataIndex: 'effectDeviceCount',
      width: 110,
      sorter: true,

      sortOrder: this.makeSorterOrder('effectDeviceCount'),
    }, {
      title: '状态(接jira)',
      dataIndex: 'jiraUrl',
      width: 100,
      render: (text, record) => (
        <div>
          <div className="green">
            <a href={record.status.key !== 0 ? record.jiraUrl : 'javascript:void(0);'} onClick={() => { if (record.status.key === 0) { this.onClickJira(record); } }} target="_Blank" rel="noopener noreferrer">
              {record.status.value}
            </a>
          </div>
          <div />
        </div>
      ),
    }];

    return (
      <main>
        <div className="commonContainer">
          <br /><br /><br />
          <MyCheckbox />
          <div className="commonContent" style={{ marginTop: '30px' }}>
            <Spin spinning={store.spinStatus}>
              <Table
                columns={columns}
                rowKey={row => row.aggMd5}
                pagination={{
                  current: this.page.curPage,
                  pageSize: this.page.pageSize,
                  total: store.tableListData.totalCount,
                  onShowSizeChange: this.onShowSizeChange,
                  onChange: this.onChange,
                  ...pageOption,
                }}
                dataSource={store.tableListData.list}
                onChange={this.tableChangeHandler}
              />
            </Spin>
          </div>

        </div>
        <Modal
          title={this.state.title}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.handleOK(this.state.record)}
          closable={false}
          okText={'确定'}
          cancelText={'取消'}
        >
          <div>
            <span style={{ marginRight: '50px' }}>指派人:</span>
            <Select
              mode="multiple"
              value={this.state.findvalue}
              placeholder="请输入指派人"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={this.fetchUser}
              onChange={this.handleChange}
              style={{ width: '300px' }}
            >
              {data.map(d => <Option key={d.value}>{d.text}</Option>)}
            </Select>
          </div>
        </Modal>
      </main >
    );
  }
}

export default AbnormalIndex;

