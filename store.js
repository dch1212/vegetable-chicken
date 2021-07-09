import { observable, action, toJS, computed } from 'mobx';
import Request from 'BizUtils/Request';
import timeRange from 'BizUtils/TimeRange';

// const type = {
//   affectUserCount: { value: '影响用户数' },
//   crashCount: { value: '崩溃发生次数' },
//   crashRate: { value: '崩溃率' },
//   sessionCount: { value: '用互联网数' },
// };

const fields = ['osVersion', 'vid', 'mobileModel', 'jsVid', 'mobileBrand', 'networkType'];

class Store {

  @observable versionList = [];
  @observable chartData = {};
  @observable pieData = {};
  @observable number = [];
  @observable number1 = [];
  @observable number2 = [];
  @observable number3 = [];
  @observable inputValue = [];
  @observable indeterminate = false;
  @observable checkedList = [];
  // @observable purposes = [];
  @observable model = [];
  @observable scope = [];
  @observable makesure = {};
  @observable makesureUrl = {};
  @observable purposes = [];
  @observable statusData = [];
  @observable checkDataOld = [];
  @observable makesureSearch = {};
  @observable tableData = {};
  @observable tableDataPid = [];
  @observable tableDataVid = [];
  @observable tableDataScope = [];
  @observable tableDataModel = [];
  @observable tableDataUdid = [];
  @observable tableNum = [];
  @observable scoData = [];
  @observable inpValue = [];
  // 获取下拉菜单数据
  @observable checkData = {};
  @observable purposesNull;
  @observable appsNull;
  @observable proIdNull;
  @observable scopeNull;
  @observable statusNull;
  @observable modelNull;
  @observable projectId;
  @observable typeList = [
    {
      id: 0, value: '0', label: '全部崩溃',
    },
    {
      id: 1, value: '1', label: 'Native崩溃',
    },
    {
      id: 2, value: '2', label: 'js崩溃',
    },
    {
      id: 3, value: '3', label: 'so崩溃',
    },
  ];
  @action.bound
  fetchCheckData() {
    return new Promise((resolve) => {
      Request.get('/crashPlatform/web/queryDeviceBaseInfo')
        .then((res) => {
          this.checkData = res.data;
          resolve(res.data);
        }).catch((e) => {
          console.log(e);
        });
    });
  }
  // pid点击翻页按钮
  @action.bound
  getTablePid(c, p) {
    const sdata = this.makesureList;
    Request.post('/crashPlatform/web/aggregation?i=1', {
      data: {
        model: sdata.model,
        purposeIds: sdata.purposes,
        status: sdata.status,
        scope: sdata.scope,
        apps: sdata.appsValue,
        udid: sdata.udid,
        stackInfo: sdata.stackInfo,
        crashType: sdata.crashType,
        // curPage,
        // pageSize,
        startTime: sdata.startTime,
        endTime: sdata.endTime,
        curPage: c,
        pageSize: p,
        dimension: 1,
      },
    })
      .then((res) => {
        if (res) {
          this.tableDataPid = res.data;
        }
      });
  }
  // vid点击翻页按钮
  @action.bound
  getTableVid(c, p) {
    // debugger;
    const sdata = this.makesureList;
    Request.post('/crashPlatform/web/aggregation?i=2', {
      data: {
        model: sdata.model,
        purposeIds: sdata.purposes,
        status: sdata.status,
        scope: sdata.scope,
        apps: sdata.appsValue,
        udid: sdata.udid,
        stackInfo: sdata.stackInfo,
        crashType: sdata.crashType,
        // curPage,
        // pageSize,
        startTime: sdata.startTime,
        endTime: sdata.endTime,
        curPage: c,
        pageSize: p,
        dimension: 2,
      },
    })
      .then((res) => {
        if (res) {
          this.tableDataVid = res.data;
        }
      });
  }
  // scope点击翻页
  @action.bound
  getTableScope(c, p) {
    const sdata = this.makesureList;
    Request.post('/crashPlatform/web/aggregation?i=3', {
      data: {
        model: sdata.model,
        purposeIds: sdata.purposes,
        status: sdata.status,
        scope: sdata.scope,
        apps: sdata.appsValue,
        udid: sdata.udid,
        stackInfo: sdata.stackInfo,
        crashType: sdata.crashType,
        // curPage,
        // pageSize,
        startTime: sdata.startTime,
        endTime: sdata.endTime,
        curPage: c,
        pageSize: p,
        dimension: 3,
      },
    })
      .then((res) => {
        if (res) {
          this.tableDataScope = res.data;
        }
      });
  }
  // model点击翻页
  @action.bound
  getTableModel(c, p) {
    const sdata = this.makesureList;
    Request.post('/crashPlatform/web/aggregation?i=4', {
      data: {
        model: sdata.model,
        purposeIds: sdata.purposes,
        status: sdata.status,
        scope: sdata.scope,
        apps: sdata.appsValue,
        udid: sdata.udid,
        stackInfo: sdata.stackInfo,
        crashType: sdata.crashType,
        // curPage,
        // pageSize,
        startTime: sdata.startTime,
        endTime: sdata.endTime,
        curPage: c,
        pageSize: p,
        dimension: 4,
      },
    })
      .then((res) => {
        if (res) {
          this.tableDataModel = res.data;
        }
      });
  }
  // udid点击翻页
  @action.bound
  getTableUdid(c, p) {
    const sdata = this.makesureList;

    Request.post('/crashPlatform/web/aggregation?i=5', {
      data: {
        model: sdata.model,
        purposeIds: sdata.purposes,
        status: sdata.status,
        scope: sdata.scope,
        apps: sdata.appsValue,
        udid: sdata.udid,
        stackInfo: sdata.stackInfo,
        crashType: sdata.crashType,
        // curPage,
        // pageSize,
        startTime: sdata.startTime,
        endTime: sdata.endTime,
        curPage: c,
        pageSize: p,
        dimension: 5,
      },
    })
      .then((res) => {
        if (res) {
          this.tableDataUdid = res.data;
        }
      });
  }
  // 搜索条件之后的展示五个列表
  @action.bound
  fetchJuheList1() {
    const sdata = this.makesureSearchList;
    Request.post('/crashPlatform/web/aggregation?i=1', { data: { projectId: sdata.projectId, crashType: sdata.crashType, stackInfo: sdata.stackInfo, udid: sdata.udid, model: sdata.model, purposeIds: sdata.purposeids, status: sdata.status, scope: sdata.scope, apps: sdata.apps, startTime: sdata.startTime, endTime: sdata.endTime, dimension: 1 } })
      .then((res) => {
        if (res) {
          this.tableDataPid = res.data;
        }
      });
    Request.post('/crashPlatform/web/queryEffectDeviceAndCrashTotal', { data: { projectId: sdata.projectId, crashType: sdata.crashType, stackInfo: sdata.stackInfo, udid: sdata.udid, model: sdata.model, purposeIds: sdata.purposeids, status: sdata.status, scope: sdata.scope, apps: sdata.apps, startTime: sdata.startTime, endTime: sdata.endTime, dimension: 1 } })
      .then((res) => {
        if (res) {
          this.tableNum = res.data;
        }
      });
    Request.post('/crashPlatform/web/aggregation?i=2', { data: { projectId: sdata.projectId, crashType: sdata.crashType, stackInfo: sdata.stackInfo, udid: sdata.udid, model: sdata.model, purposeIds: sdata.purposeids, status: sdata.status, scope: sdata.scope, apps: sdata.apps, startTime: sdata.startTime, endTime: sdata.endTime, dimension: 2 } })
      .then((res) => {
        if (res) {
          this.tableDataVid = res.data;
        }
      });
    Request.post('/crashPlatform/web/aggregation?i=3', { data: { projectId: sdata.projectId, crashType: sdata.crashType, stackInfo: sdata.stackInfo, udid: sdata.udid, model: sdata.model, purposeIds: sdata.purposeids, status: sdata.status, scope: sdata.scope, apps: sdata.apps, startTime: sdata.startTime, endTime: sdata.endTime, dimension: 3 } })
      .then((res) => {
        if (res) {
          this.tableDataScope = res.data;
        }
      });
    Request.post('/crashPlatform/web/aggregation?i=4', { data: { projectId: sdata.projectId, crashType: sdata.crashType, stackInfo: sdata.stackInfo, udid: sdata.udid, model: sdata.model, purposeIds: sdata.purposeids, status: sdata.status, scope: sdata.scope, apps: sdata.apps, startTime: sdata.startTime, endTime: sdata.endTime, dimension: 4 } })
      .then((res) => {
        if (res) {
          this.tableDataModel = res.data;
        }
      });
    Request.post('/crashPlatform/web/aggregation?i=5', { data: { projectId: sdata.projectId, crashType: sdata.crashType, stackInfo: sdata.stackInfo, udid: sdata.udid, model: sdata.model, purposeIds: sdata.purposeids, status: sdata.status, scope: sdata.scope, apps: sdata.apps, startTime: sdata.startTime, endTime: sdata.endTime, dimension: 5 } })
      .then((res) => {
        if (res) {
          this.tableDataUdid = res.data;
        }
      });
  }


  // 版本列表
  @action.bound
  fetchVersionList(pid) {
    Request.get(`/crashPlatform/web/apps/${pid}/vidList`)
      .then((res) => {
        if (res && res.status === 0) {
          this.versionList = res.data;
        }
      });
  }

  // 崩溃趋势
  // @action.bound
  fetchCrashTrend() {
    const sdata = this.makesureSearchList;
    const data = {
      projectId: sdata.projectId,
      crashType: sdata.crashType,
      stackInfo: sdata.stackInfo,
      udid: sdata.udid,
      model: sdata.model,
      purposeIds: sdata.purposeids,
      status: sdata.status,
      scope: sdata.scope,
      apps: sdata.apps,
      startTime: sdata.startTime || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`,
      endTime: sdata.endTime || `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`,
      // startTime: sdata.startTime || '',
      // endTime: sdata.endTime || '',
    };
    Request.post('/crashPlatform/web/exceptions/crashTrend', {
      data,
    }).then((res) => {
      if (res && res.status === 0 && res.data) {
        const items = res.data.items || [];
        this.chartData = {
          tooltip: {
            trigger: 'axis',
            // formatter: '{a} <br/>{b} : {c}',
            axisPointer: {
              label: {
                backgroundColor: '#6a7985',
              },
              animation: false,
            },
          },
          legend: {
            left: 'right',
            data: ['影响用户数', '崩溃发生次数'],
          },
          // color: ['#111', '#222'],
          color: ['#D88268', '#5BA0A7'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: { show: false },
            data: [],
          },
          grid: {
            left: '4%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} ',
              },
              scale: true, /* 按比例显示*/
            },
            {
              type: 'value',
              axisLabel: {
                formatter: '{value}',
              },
              splitLine: {
                show: false,
              },

              scale: true, /* 按比例显示*/
            }],
          series: [
            {
              name: '影响用户数',
              type: 'line',
              yAxisIndex: 0,
              data: [],
              normal: {
                color: '#D88268',
                fontSize: 8,
              },
            },
            {
              name: '崩溃发生次数',
              type: 'line',
              yAxisIndex: 1,
              data: [],

              normal: {
                color: '#5BA0A7',
              },
            },

          ],
        };
        items.forEach((item) => {
          this.chartData.xAxis.data.push(timeRange.formatTime(item.beginTime));
          this.chartData.series[0].data.push(item.affectUserCount || 0);
          this.chartData.series[1].data.push(item.crashCount || 0);
          // this.chartData.series[2].data.push(item.crashRate || 0);
          // this.chartData.series[3].data.push(item.sessionCount || 0);
        });
      }
    });
  }

  // 饼图数据  gen
  @action.bound
  fetchPieData(pid, vid, beginTime, endTime) {
    const data = {
      pid,
      beginTime,
      endTime,
      fields,
    };
    if (vid) {
      data.vid = vid;
    }
    Request.post('/crashPlatform/web/exceptions/crashPercent', {
      data,
    })
      .then((res) => {
        if (res && res.status === 0 && res.data) {
          this.pieData = res.data;
        }
      });
  }

  @computed get versionListData() {
    return toJS(this.versionList);
  }

  @computed get ChartTrend() {
    return toJS(this.chartData);
  }

  @computed get pieDataList() {
    return toJS(this.pieData);
  }
  @computed get checkDataList() {
    return toJS(this.checkData);
  }
  @computed get num() {
    return toJS(this.number);
  }
  // @computed get num() {
  //   return toJS(this.number1);
  // }
  @computed get num2() {
    return toJS(this.number2);
  }
  @computed get num3() {
    return toJS(this.number3);
  }
  @computed get inputVal() {
    return toJS(this.inputValue);
  }
  @computed get shebeiList() {
    return toJS(this.shebei);
  }
  @computed get modelList() {
    return toJS(this.model);
  }
  @computed get scopeList() {
    return toJS(this.scope);
  }
  @computed get makesureUrlList() {
    return toJS(this.makesureUrl);
  }
  @computed get makesureList() {
    return toJS(this.makesure);
  }
  @computed get makesureList1() {
    return toJS(this.makesure1);
  }
  @computed get makesureList2() {
    return toJS(this.makesure2);
  }
  @computed get makesureList3() {
    return toJS(this.makesure3);
  }
  @computed get makesureList4() {
    return toJS(this.makesure4);
  }
  @computed get makesureList5() {
    return toJS(this.makesure5);
  }
  @computed get purposesList() {
    return toJS(this.purposes);
  }
  @computed get statusDataList() {
    return toJS(this.statusData);
  }
  @computed get makesureSearchList() {
    return toJS(this.makesureSearch);
  }
  @computed get tablePidList() {
    return toJS(this.tableDataPid);
  }
  @computed get tableVidList() {
    return toJS(this.tableDataVid);
  }
  @computed get tableScopeList() {
    return toJS(this.tableDataScope);
  }
  @computed get tableModelList() {
    return toJS(this.tableDataModel);
  }
  @computed get tableUdidList() {
    return toJS(this.tableDataUdid);
  }
  @computed get tableNumList() {
    return toJS(this.tableNum);
  }
  @computed get typeListData() {
    return toJS(this.typeList);
  }
  @computed get inpValueSearch() {
    return toJS(this.inpValue);
  }
  @computed get scoDataList() {
    return toJS(this.scoData);
  }
}

const store = new Store();

export default store;
