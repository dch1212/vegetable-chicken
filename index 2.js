import React, { Component } from 'react';
import App from 'BizComponent/App';
import { observer } from 'mobx-react';
import router from 'BizUtils/router';
import timeRange from 'BizUtils/TimeRange';
import { Tabs, Button } from 'bach-antd';
import Tables from '../Component/Tables';
import store from './store';
import AnalysisStore from '../AbnormalAnalysis/store';
import './index.scss';
import Charts from '../Component/Charts';
import MyCheckbox from '../Component/MyCheckbox';
import moment from 'moment';
import createHistory from 'history/createBrowserHistory';
// import SelectOption from '../Component/SelectOption';

const history = createHistory();
const location = history.location;
const TabPane = Tabs.TabPane;
const param = router.urlParse();

history.listen((location, action) => {
  if (action === 'POP') {
    window.instance.routerstate = 'pop';
    window.instance.search();
    window.myCheckboxInstance.changeNum();
    window.myCheckboxInstance.changeneedTime();
  } else {
    window.instance.routerstate = 'push';
  }
});
// const type = {
//   osVersion: {
//     key: 'osVersion', title: '系统版本',
//   },
//   vid: {
//     key: 'vid', title: '应用版本',
//   },
//   mobileModel: {
//     key: 'mobileModel', title: '设备机型',
//   },
//   mobileBrand: {
//     key: 'mobileBrand', title: '手机品牌',
//   },
//   jsVid: {
//     key: 'jsVid', title: '离线包版本',
//   },
//   networkType: {
//     key: 'networkType', title: '网络类型',
//   },

// };

@observer
class AbnormalOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // show: false,
      url: window.location.search,
      beginTime: timeRange.begin(),
      endTime: timeRange.end(),
      pieTime: {
        begin: timeRange.begin(),
        end: timeRange.end(),
      },
      vid: '',
      vidTwo: '',
    };
    this.msg = {
      defaultActiveKey: param.tabPanel || '1',
      pid: param.pid || '60001',
    };
    this.makesure = this.makesure.bind(this);
  }
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
  // const query = stringToQuery();
  componentDidMount() {
    store.fetchVersionList(this.msg.pid);
    //eslint-disable-line
    window.instance = this;
    store.purposes = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).purposes : [];
    store.model = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).model : [];
    store.inputValue = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).appsSearch : [];
    store.inpValue = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).appsValue : [];
    store.startTime = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).startTime : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`;
    store.endTime = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).endTime : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`;
    store.stackInfo = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).stackInfo : '';
    store.udid = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).udid : '';
    AnalysisStore.crashType = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).crashType : [];
    store.scope = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).scope : [];
    store.projectId = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).projectId : [];
    store.statusData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).status : [];
    this.changeStatusStr();
    this.changeScopeStr();
    // this.stringToQuery().id ? this.search() : store.fetchJuheList();
    // this.stringToQuery().id ? this.search() : null;
    this.search();
  }
  changeStatusStr = () => {
    store.fetchCheckData();
    const needDataStatus = [];
    const status = store.checkDataList.status;
    if (status) {
      status.forEach((v) => {
        if (store.statusDataList) {
          store.statusDataList.forEach((innerV) => {
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
    store.fetchCheckData();
    const needDataScope = [];
    const scope = store.checkDataList.scope;
    if (scope) {
      scope.forEach((v) => {
        // if (store.statusDataList) {
        store.scoData.forEach((innerV) => {
          if (v.description === innerV) {
            needDataScope.push(v.id);
          }
        });
        // }
      });
      return needDataScope;
    }
  };
  // 点击确定按钮 五个makesure是传的信息 不然写一个会相互影响
  makesure() {
    const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
    // 传到下一个页面信息
    // console.log(this.routerstate);
    store.makesureUrl = {
      purposes: this.routerstate === 'pop' ? serData.purposes : store.purposesList,
      model: this.routerstate === 'pop' ? serData.model : store.modelList,
      appsSearch: this.routerstate === 'pop' ? serData.appsSearch : store.inputVal,
      appsValue: this.routerstate === 'pop' ? serData.appsValue : store.inpValue,
      startTime: this.routerstate === 'pop' ? serData.startTime : store.startTime,
      endTime: this.routerstate === 'pop' ? serData.endTime : store.endTime,
      stackInfo: this.routerstate === 'pop' ? serData.stackInfo : store.stackInfo,
      udid: this.routerstate === 'pop' ? serData.udid : store.udid,
      crashType: this.routerstate === 'pop' ? serData.crashType : AnalysisStore.crashType,
      scope: this.routerstate === 'pop' ? serData.scope : store.scoDataList.length === 0 && store.scopeNull ? [] : typeof (store.scoDataList[0]) === 'string' ? this.changeScopeStr() : store.scoDataList.length === 0 ? store.scopeList : store.scoDataList,
      projectId: this.routerstate === 'pop' ? serData.projectId : store.projectId,
      status: this.routerstate === 'pop' ? serData.status : typeof (store.statusDataList[0]) === 'string' ? this.changeStatusStr() : store.statusDataList,
    };
    store.makesure = {
      purposes: store.purposesList,
      model: store.modelList,
      status: store.statusDataList,
      appsSearch: store.inputVal,
      appsValue: store.inpValue,
      startTime: store.startTime,
      endTime: store.endTime,
      pid_vid: '',
    };
    store.makesure1 = {
      purposes: this.routerstate === 'pop' ? serData.purposes : store.purposesList,
      model: this.routerstate === 'pop' ? serData.model : store.modelList,
      appsSearch: this.routerstate === 'pop' ? serData.appsSearch : store.inputVal,
      appsValue: this.routerstate === 'pop' ? serData.appsValue : store.inpValue,
      startTime: this.routerstate === 'pop' ? serData.startTime : store.startTime,
      endTime: this.routerstate === 'pop' ? serData.endTime : store.endTime,
      stackInfo: this.routerstate === 'pop' ? serData.stackInfo : store.stackInfo,
      udid: this.routerstate === 'pop' ? serData.udid : store.udid,
      crashType: this.routerstate === 'pop' ? serData.crashType : AnalysisStore.crashType,
      scope: this.routerstate === 'pop' ? serData.scope : store.scoData,
      projectId: this.routerstate === 'pop' ? serData.projectId : store.projectId,
      status: this.routerstate === 'pop' ? serData.status : store.statusDataList,
    };
    store.makesure2 = {

      purposes: this.routerstate === 'pop' ? serData.purposes : store.purposesList,
      model: this.routerstate === 'pop' ? serData.model : store.modelList,
      appsSearch: this.routerstate === 'pop' ? serData.appsSearch : store.inputVal,
      appsValue: this.routerstate === 'pop' ? serData.appsValue : store.inpValue,
      startTime: this.routerstate === 'pop' ? serData.startTime : store.startTime,
      endTime: this.routerstate === 'pop' ? serData.endTime : store.endTime,
      stackInfo: this.routerstate === 'pop' ? serData.stackInfo : store.stackInfo,
      udid: this.routerstate === 'pop' ? serData.udid : store.udid,
      crashType: this.routerstate === 'pop' ? serData.crashType : AnalysisStore.crashType,
      scope: this.routerstate === 'pop' ? serData.scope : store.scoData,
      projectId: this.routerstate === 'pop' ? serData.projectId : store.projectId,
      status: this.routerstate === 'pop' ? serData.status : store.statusDataList,
      pid_vid: '',
    };
    store.makesure3 = {

      purposes: this.routerstate === 'pop' ? serData.purposes : store.purposesList,
      model: this.routerstate === 'pop' ? serData.model : store.modelList,
      appsSearch: this.routerstate === 'pop' ? serData.appsSearch : store.inputVal,
      appsValue: this.routerstate === 'pop' ? serData.appsValue : store.inpValue,
      startTime: this.routerstate === 'pop' ? serData.startTime : store.startTime,
      endTime: this.routerstate === 'pop' ? serData.endTime : store.endTime,
      stackInfo: this.routerstate === 'pop' ? serData.stackInfo : store.stackInfo,
      udid: this.routerstate === 'pop' ? serData.udid : store.udid,
      crashType: this.routerstate === 'pop' ? serData.crashType : AnalysisStore.crashType,
      scope: this.routerstate === 'pop' ? serData.scope : store.scoData,
      projectId: this.routerstate === 'pop' ? serData.projectId : store.projectId,
      status: this.routerstate === 'pop' ? serData.status : store.statusDataList,
    };
    store.makesure4 = {

      purposes: this.routerstate === 'pop' ? serData.purposes : store.purposesList,
      model: this.routerstate === 'pop' ? serData.model : store.modelList,
      appsSearch: this.routerstate === 'pop' ? serData.appsSearch : store.inputVal,
      appsValue: this.routerstate === 'pop' ? serData.appsValue : store.inpValue,
      startTime: this.routerstate === 'pop' ? serData.startTime : store.startTime,
      endTime: this.routerstate === 'pop' ? serData.endTime : store.endTime,
      stackInfo: this.routerstate === 'pop' ? serData.stackInfo : store.stackInfo,
      udid: this.routerstate === 'pop' ? serData.udid : store.udid,
      crashType: this.routerstate === 'pop' ? serData.crashType : AnalysisStore.crashType,
      scope: this.routerstate === 'pop' ? serData.scope : store.scoData,
      projectId: this.routerstate === 'pop' ? serData.projectId : store.projectId,
      status: this.routerstate === 'pop' ? serData.status : store.statusDataList,
    };
    store.makesure5 = {

      purposes: this.routerstate === 'pop' ? serData.purposes : store.purposesList,
      model: this.routerstate === 'pop' ? serData.model : store.modelList,
      appsSearch: this.routerstate === 'pop' ? serData.appsSearch : store.inputVal,
      appsValue: this.routerstate === 'pop' ? serData.appsValue : store.inpValue,
      startTime: this.routerstate === 'pop' ? serData.startTime : store.startTime,
      endTime: this.routerstate === 'pop' ? serData.endTime : store.endTime,
      stackInfo: this.routerstate === 'pop' ? serData.stackInfo : store.stackInfo,
      udid: this.routerstate === 'pop' ? serData.udid : store.udid,
      crashType: this.routerstate === 'pop' ? serData.crashType : AnalysisStore.crashType,
      scope: this.routerstate === 'pop' ? serData.scope : store.scoData,
      projectId: this.routerstate === 'pop' ? serData.projectId : store.projectId,
      status: this.routerstate === 'pop' ? serData.status : store.statusDataList,
    };
    // 搜索条件
    if (this.routerstate !== 'pop') {
      history.push({
        pathname: '/crash-platform/web/AbnormalOverview',
        search: `id=${encodeURIComponent(JSON.stringify(store.makesureUrlList))}`,
        state: { some: 'state' },
      });
      this.routerstate = 'push';
    }
  }
  search = () => {
    // const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
    this.makesure();

    store.makesureSearch = {
      purposeids: store.makesureUrlList.purposes,
      model: store.makesureUrlList.model,
      status: store.makesureUrlList.status,
      apps: store.makesureUrlList.appsValue,
      startTime: store.makesureUrlList.startTime,
      endTime: store.makesureUrlList.endTime,
      udid: store.makesureUrlList.udid,
      stackInfo: store.makesureUrlList.stackInfo,
      crashType: Number(store.makesureUrlList.crashType),
      scope: store.makesureUrlList.scope,
      projectId: store.makesureUrlList.projectId,
    };
    store.fetchJuheList1();
    store.fetchCrashTrend();
    // this.setState({
    //   show: true,
    // });
    window.instance.routerstate = 'push';
  }
  render() {
    return (
      <App>
        <div className="box">
          <div className="crash_title">
            异常概览
        </div>
          <main>
            <div className="commonContainerBox">
              <Tabs defaultActiveKey={this.msg.defaultActiveKey} className="tab commonContent">
                <TabPane tab="崩溃" key="1" />
              </Tabs>
              <MyCheckbox />
              {/* <Button type="primary" style={btnStyle} onClick={this.search}>搜索
            </Button> */}
            </div>


            <div className="commonContainer" style={{ marginTop: '30px' }}>
              <div className="crashline_title">
                趋势图
        </div>
              <div style={{ marginBottom: '20px', marginRight: '20px', height: '330px', marginLeft: '30px' }}>
                <Charts option={store.ChartTrend} />
              </div>
            </div>


            <div className="commonContainer">
              <div className="commonTitle_flex commonTitle">
                <div className="title">聚合列表</div>
                （ <h4 >影响用户总数：{store.tableNumList.effectDeviceTotal}，
      崩溃总数: {store.tableNumList.crashTotal}</h4> ）
              </div>
              <div style={{ padding: '30px' }}>
                <div style={{ marginTop: '20px' }}>
                  <Tables />

                </div>
              </div>

            </div>
          </main>
        </div>
      </App>
    );
  }
}

App.renderDOM(AbnormalOverview);

