import React, { Component } from 'react';
import { Select, Button, DatePicker, Input } from 'bach-antd';
import TreeSelect from 'BizComponent/TreeSelect';
import Picker from 'BizComponent/Picker';
import { observer } from 'mobx-react';
import moment from 'moment';
import store from '../AbnormalOverview/store';
import AnalysisStore from '../AbnormalAnalysis/store';
import SelectOption from '../Component/SelectOption';
import createHistory from 'history/createBrowserHistory';
// import SelectOption from '../Component/SelectOption';

const history = createHistory();
const location = history.location;
/* eslint-disable */
function stringToQuery(string = location.search) {
  const matches = string.match(/([^\?\=\&]+\=[^\&]+)/g);

  const query = {};

  if (matches) {
    matches.forEach((tmp) => {
      const kv = tmp.split('=');
      kv[1] && kv[1] !== 'undefined' && kv[1] !== 'null' && (query[kv[0]] = decodeURIComponent(kv[1]));
    });
  }
  return query;
}
const query = stringToQuery();
window.__Query = query;
const hasQuery = query.id ? query.id.length : '';
/* eslint-enable */
const Option = Select.Option;
const style = {
  marginRight: '30px',
};
const styleStatus = {
  marginRight: '30px',
};
const styleClearFir = {
  left: '926px',
};
const styleSearch = {
  left: '770px',
};
const styleDate = {
  marginRight: '23px',
};
const stylePurposes = {
  marginRight: '30px',
};
const styleModel = {
  marginRight: '27px',
};
const styleScope = {
  marginRight: '40px',
};
const styleCrash = {
  marginRight: '21px',
};
const styleUdid = {
  marginRight: '18px',
};
const styleBox = {
  // width: '1050px',
  marginLeft: '30px',
  // overflowX: 'scroll',
  // height: '290px',
  backgroundColor: '#fff',
};
const styleProject = {

  marginRight: '23px',
};
const clearBtnApp = {
  display: 'inlineBlock',
  fontStyle: 'normal',
  verticalAlign: 'baseline',
  textAlign: 'center',
  textTransform: 'none',
  textRendering: 'auto',
  opacity: 1,
  position: 'absolute',
  right: '62px',
  zIndex: 1,
  background: '#fff',
  top: '14%',
  fontSize: '12px',
  color: '#ddd',
  width: '12px',
  height: '12px',
  marginTop: '- 6px',
  lineHeight: '12px',
  cursor: 'pointer',
};
const clearBtnFir = {
  display: 'inlineBlock',
  fontStyle: 'normal',
  verticalAlign: 'baseline',
  textAlign: 'center',
  textTransform: 'none',
  textRendering: 'auto',
  opacity: 1,
  position: 'absolute',
  right: '8px',
  zIndex: 1,
  background: '#fff',
  top: '14%',
  fontSize: '12px',
  color: '#ddd',
  width: '12px',
  height: '12px',
  marginTop: '- 6px',
  lineHeight: '12px',
  cursor: 'pointer',
};
const clearBtnSec = {
  display: 'inlineBlock',
  fontStyle: 'normal',
  verticalAlign: 'baseline',
  textAlign: 'center',
  textTransform: 'none',
  textRendering: 'auto',
  opacity: 1,
  position: 'absolute',
  right: '70px',
  zIndex: 1,
  background: '#fff',
  top: '14%',
  fontSize: '12px',
  color: '#ddd',
  width: '12px',
  height: '12px',
  marginTop: '- 6px',
  lineHeight: '12px',
  cursor: 'pointer',
};
let timer;
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
@observer
class MyCheckbox extends Component {
  constructor(props) {
    super(props);
    /* eslint-disable */
    this.state = {
      startTime: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, 'YYYY-MM-DD'),
      endTime: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, 'YYYY-MM-DD'),
      endOpen: false,
      plainOptions: [],
      num: 0,
      checkAll: false,
      indeterminate: true,
      checkedList: [],
      formData: [],
      url: {},
      inputData: '',
      crashType: '全部崩溃'
      // newTreeData: this.getTree(),
    };
    this.onChange = this.onChange.bind(this);
    this.changeModel = this.changeModel.bind(this);
    this.changeApps = this.changeApps.bind(this);
    this.changeNum = this.changeNum.bind(this);
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
  /* eslint-enable */
  componentWillMount() {
    this.changeNum();// 在url里面把数字转换成value
    this.changeneedTime();
    // window.__Query.id.startTime || JSON.parse(window.__Query.id).startTime ? this.changeneedTime() : null;// 把url里的开始结束时间拿出来
  }
  componentDidMount() {
    store.fetchCheckData();// 拿到下拉菜单的数据
    window.myCheckboxInstance = this;
  }
  // 时间框改变值
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
    store.filed = value;
  }
  onStartChange = (value, q) => {
    this.onChange('startTime', value);
    store.startTime = q;
    // console.log(value);
    if (value === null) {
      this.setState({
        startTime: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, 'YYYY-MM-DD'),
      });
      store.startTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`;
    }
  }

  onEndChange = (value, q) => {
    this.onChange('endTime', value);
    store.endTime = q;
    if (value === null) {
      this.setState({
        endTime: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`, 'YYYY-MM-DD HH:mm:ss'),
      });
      store.endTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`;
    }
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  // 根据url里面的数字转成要的数据   分别是scope  状态  用途
  changeNum() {
    const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
    store.fetchCheckData().then(() => {
      this.setState({
        modelData: serData ? serData.model : [],
        udidValue: serData ? serData.udid : '',
        crashStackValue: serData ? serData.stackInfo : '',
        projectId: serData ? serData.projectId : [],
        // 下面那两个数值判断希望不会挨打
        value: this.stringToQuery().pid ? this.stringToQuery().pid.toString() : this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).appsSearch.length === 0 ? JSON.parse(this.stringToQuery().id).appsValue.length === 0 ? [] : JSON.parse(this.stringToQuery().id).appsValue[0].appId : JSON.parse(this.stringToQuery().id).appsSearch : [],
        crashType: serData ? serData.crashType === '0' || serData.crashType === 0 || serData.crashType === undefined ? '全部崩溃' :
          serData.crashType === '1' || serData.crashType === 1 || serData.crashType[0] === 1 ? 'Native崩溃' :
            serData.crashType === '2' || serData.crashType === 2 || serData.crashType[0] === 2 ? 'js崩溃' :
              serData.crashType === '3' || serData.crashType[0] === 3 || serData.crashType === 3 ? 'so崩溃' : '全部崩溃' : '全部崩溃',
      });
      const numStatus = serData ? serData.status : [];
      const numPurposes = serData ? serData.purposes : [];
      const numPurScope = serData ? serData.purScope ? [serData.purScope] : serData.scope : [];
      const purposes = store.checkDataList.purposes || [];
      const status = store.checkDataList.status || [];
      const scope = store.checkDataList.scope || [];
      const needDataStatus = [];
      const needDataPurposes = [];
      const needDataScope = [];
      // scope改变
      scope.forEach((v) => {
        if (numPurScope) {
          numPurScope.forEach((innerV) => {
            if (v.id === innerV) {
              needDataScope.push(v.description);
            }
          });
        }
      });
      // 状态的改变
      // if (typeof (status) === 'number') {
      status.forEach((v) => {
        if (numStatus) {
          numStatus.forEach((innerV) => {
            if (v.key === innerV) {
              needDataStatus.push(v.value);
            }
          });
        }
      });
      // }
      // 设备用途的改变
      if ((typeof numPurposes) === 'number') {
        const arr = [];
        arr.push(numPurposes);
        purposes.forEach((v) => {
          arr.forEach((innerV) => {
            if (v.purposeId === innerV) {
              needDataPurposes.push(v.purposeName);
            }
          });
        });
      } else {
        purposes.forEach((v) => {
          if (numPurposes) {
            numPurposes.forEach((innerV) => {
              if (v.purposeId === innerV) {
                needDataPurposes.push(v.purposeName);
              }
            });
          }
        });
      }

      store.scoData = needDataScope;
      store.purposesData = needDataPurposes;
      this.setState({
        statusData: needDataStatus,
        purposesData: needDataPurposes,
        scope: needDataScope,
      });
      store.statusData = needDataStatus;
    });
  }
  // 设备用途 取id
  changePurposes = (value) => {
    if (value.length === 0) {
      store.purposesNull = true;
    }
    this.setState({
      purposesData: value,
    });
    const purposes = store.checkDataList.purposes;
    let fromData = this.state.formData;
    fromData = [];
    purposes.forEach((v) => {
      value.forEach((innerV) => {
        if (v.purposeName === innerV) {
          fromData.push(v.purposeId);
        }
      });
    });
    store.purposes = fromData;
  }
  // 型号的值 这个不用处理
  changeModel(value) {
    if (value.length === 0) {
      store.modelNull = true;
    }
    store.model = value;
    this.setState({
      modelData: value ||
        window.__Query.id.model,// eslint-disable-line
    });
  }
  // 状态的值 根据值取到id
  changeStatus = (value) => {
    if (value.length === 0) {
      store.statusNull = true;
    }
    this.setState({
      statusData: value,
    });
    const status = [];
    store.checkDataList.status.forEach((v) => {
      value.forEach((innerV) => {
        if (v.value === innerV) {
          status.push(v.key);
        }
      });
    });
    store.statusData = status;
  }
  // 把第一个框的数据格式改成他要的那种
  changeData() {
    return ((store.checkDataList || []).apps || []).map(item => ({
      title: `${item.appName}(${item.appId})`,
      key: item.appId,
      value: item.appId,
      children: item.vids.map((i, n) => ({
        title: `${item.appId}->${i}`,
        value: JSON.stringify({ c: i, p: item.appId }),
        key: `${item.appId}-${item.appId}-${i}-${n}`,
      })),
    }));
  }
  // 第一个框的数据处理成后台要的
  changeApps(value) {
    if (value.length === 0) {
      store.appsNull = true;
    } else {
      store.appsNull = false;
    }
    this.setState({
      inputData: '',
    });
    const arr = [];
    const formData = [];
    this.setState({ value });
    value.forEach((v) => {
      arr.push(JSON.parse(v));
    });
    arr.forEach((i) => {
      if (i.c) {
        let flag = true;
        formData.forEach((v) => {
          if (v.appId === i.p) {
            v.vids.push(i.c);
            flag = false;
          }
        });
        if (flag) {
          formData.push({ appId: i.p, vids: [i.c] });
        }
      } else {
        const treeData = this.changeData();
        const obj = {};
        // console.log(treeData);
        treeData.forEach((v) => {
          if (Number(v.value) === i) {
            obj.appId = i.toString();
            obj.vids = [];
          }
        });
        formData.push(obj);
      }
    });
    // 下一个页面信息
    store.inputValue = value;
    store.inpValue = formData;
  }
  searchApps = (v) => {
    this.setState({
      inputData: v,
    });
  }
  clear = () => {
    this.setState({
      statusData: [],
      purposesData: [],
      value: [],
      modelData: [],
      scope: [],
      // startTime: null,
      // endTime: null,
      crashStackValue: '',
      udidValue: '',
      projectId: [],
      crashType: '全部崩溃',
    });
    store.appsValue = [];
    store.purposes = [];
    store.statusData = [];
    // store.fromData = [];
    store.inputValue = [];
    store.inpValue = [];
    store.appsSearch = [];
    store.model = [];
    store.scoData = [];
    // store.startTime = null;
    // store.endTime = null;
    store.udid = '';
    store.stackInfo = '';
    store.projectId = [];
    AnalysisStore.crashType = 0;
    if (query.id || query.pid) {
      window.location.search = '';
    }
  }
  // ------------------------------------------------->注意：接下来的这些注释是第一个搜索框的几种查询条件，别删，也许哪天就改回来了
  // 加delay  1.0
  // filterData = () => {
  //   let timer1 = false;
  //   window.setTimeout(() => { timer1 = true; }, 1000);
  //   if (timer1) {
  //     timer = false;
  //     return this.changeData().filter(i =>
  //       i.value.substring(0, this.state.inputData.length) === this.state.inputData.toString());
  //     // window.setTimeout(timer = true, 1000);
  //   }
  // }
  // 敲一个数字搜一次   2.0
  // filterData = () => this.changeData().filter(i =>
  //   i.value.substring(0, this.state.inputData.length) === this.state.inputData.toString())
  // 输入完pid再搜   3.0
  filterData = () => this.changeData().filter(i =>
    i.value === this.state.inputData.toString())
  // pid+vid精确搜索  4.0
  // filterData = () =>
  //   this.changeData().reduce((data, i) => {
  //     if (i.value === this.state.inputData.toString()) { data.push(i); } else {
  //       for (let j = 0; j < i.children.length; j++) {// eslint-disable-line
  //         if (i.children[j].key1 === this.state.inputData.toString()) {
  //           data.push(i);
  //         }
  //       }
  //     }
  //     return data;
  //   }, []);


  changeScope = (value) => {
    if (value.length === 0) {
      store.scopeNull = true;
    }
    const scoData = [];
    store.checkDataList.scope.forEach((v) => {
      value.forEach((innerV) => {
        if (v.description === innerV) {
          scoData.push(v.id);
        }
      });
    });
    this.setState({
      scope: value,
    });
    store.scoData = scoData;
  }
  changeProId = (v) => {
    if (v.length === 0) {
      store.proIdNull = true;
    }
    // console.log(v);
    store.projectId = v;
    this.setState({
      projectId: v,
    });
  }
  changeneedTime = () => {
    const serData = this.stringToQuery().id ? JSON.parse(this.stringToQuery().id) : [];
    /* eslint-disable */
    if (serData.length !== 0) {
      const defaultTime = moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, 'YYYY-MM-DD')
      const startTime =
        window.location.pathname === '/crash-platform/web/AbnormalOverview' ? serData.startTime ?
          moment(serData.startTime, 'YYYY-MM-DD HH:mm:ss') : defaultTime : serData.startTime ? moment(serData.startTime, 'YYYY-MM-DD HH:mm:ss') : defaultTime;
      const endTime =
        window.location.pathname === '/crash-platform/web/AbnormalOverview' ? serData.endTime ?
          moment(serData.endTime, 'YYYY-MM-DD HH:mm:ss') : defaultTime : serData.endTime ? moment(serData.endTime, 'YYYY-MM-DD HH:mm:ss') : defaultTime;
      this.setState({
        startTime,
        endTime,
      });
    } else {
      this.setState({
        startTime: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`, 'YYYY-MM-DD'),
        endTime: moment(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`, 'YYYY-MM-DD HH:mm:ss'),
      });
      store.startTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`;
      store.endTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 23:59:59`;
    }

  }
  /* eslint-enable */
  onChageType = (crashType) => {
    // console.log(crashType);
    AnalysisStore.crashType = crashType;
    this.setState({
      crashType: crashType === '0' ? '全部崩溃' : crashType === '1' ? 'Native崩溃' : crashType === '2' ? 'js崩溃' : crashType === '3' ? 'so崩溃' : '全部崩溃',
    });
    AnalysisStore.apiParam[1].field = crashType ? 'crashType' : '';
    AnalysisStore.apiParam[1].value = crashType ? Number(crashType) : '';
    AnalysisStore.apiParam[3].field = '';
    AnalysisStore.apiParam[3].value = '';
    this.resetSorter();
    // 选类型时先不注释
  }
  resetSorter = () => {
    AnalysisStore.orderBy = '';
    AnalysisStore.asc = '';
  }
  onCrashStackInput = (e) => {
    this.setState({
      crashStackValue: e.target.value,
    });
    const stack = e.target.value;
    store.stackInfo = e.target.value;
    AnalysisStore.apiParam[2].field = stack ? 'crashStack' : '';
    AnalysisStore.apiParam[2].value = stack;
  }
  onUdidInput = (e) => {
    this.setState({
      udidValue: e.target.value,
    });
    const udid = e.target.value;
    store.udid = e.target.value;
    AnalysisStore.apiParam[4].field = udid ? 'udid' : '';
    AnalysisStore.apiParam[4].value = udid;
  }
  // 全选开始
  // appsAll = () => {
  //   this.setState({
  //     value: this.changeData().map(i => i.key),
  //   });
  // }
  appsClear = () => {
    this.setState({
      value: [],
    });
    store.inputValue = [];
    store.inpValue = [];
    store.appsNull = true;
  }
  purposesAll = () => {
    this.setState({
      purposesData: store.checkDataList.purposes.map(i => i.purposeName),
    });
    store.purposes = store.checkDataList.purposes.map(i => i.purposeId);
  }
  modelAll = () => {
    this.setState({
      modelData: store.checkDataList.model,
    });
    store.model = store.checkDataList.model;
  }
  statusAll = () => {
    this.setState({
      statusData: store.checkDataList.status.map(i => i.value),
    });
    store.statusData = store.checkDataList.status.map(i => i.key);
  }
  // scopeAll = () => {
  //   this.setState({
  //     scope: store.checkDataList.scope.map(i => i.description),
  //   });
  //   store.scoData = store.checkDataList.scope.map(i => i.id);
  // }
  // 全选结束  两个删除开始
  crashStackClear = () => {
    this.setState({
      crashStackValue: '',
    });
    store.stackInfo = '';
  }
  udidClear = () => {
    this.setState({
      udidValue: '',
    });
    store.udid = '';
  }
  // 两个删除结束
  getTree = () => {
    this.setState({
      newTreeData: this.changeData(),
    });
  }
  clearSearch = () => {
    this.setState({
      inputData: '',
    });
  }
  search=() => {
    if (window.location.pathname === '/crash-platform/web/AbnormalOverview') {
      window.instance.search();
    } else if (window.location.pathname === '/crash-platform/web/AbnormalAnalysis') {
      window.instance.onSearch();
    }
  }
  filter = (inputValue, treeNode) => treeNode.title.includes(inputValue);
    // if (!treeNode.props.title.includes('->')) console.log(treeNode.props.title, treeNode.props.children);
    //  !treeNode.props.title.includes('->') && treeNode.props.title.includes(inputValue) && Array.isArray(treeNode.props.children)
  render() {
    const treeData = this.changeData();
    let treeSelect;
    const tProps = {
      treeData: this.changeData(),
      filterTreeNode: this.filter,
      value: this.state.value,
      onChange: this.changeApps,
      // onSearch: this.searchApps,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: 'SHOW_PARENT',
      searchPlaceholder: '按 Enter 键进行搜索',
      dropdownStyle: { maxHeight: '250px' },
      style: {
        width: 300,
        marginRight: '56px',
      },
    };
    if (treeData.length) {
      treeSelect = <TreeSelect {...tProps} allowClear />;
    }
    const { startTime, endTime, endOpen } = this.state;
    return (
      <div style={styleBox}>
        <span style={{ position: 'relative' }}>
          <span style={style}>app应用:</span> {treeSelect}
          {/* <span unselectable="unselectable" style={clearBtnApp} className="clearBtn" onClick={this.appsClear} /> */}
          {/* <Button onClick={this.appsAll}>全选</Button> */}
        </span>
        <span style={{ marginLeft: '10%' }}>
          <span style={stylePurposes}>设备用途:</span> <Select
            className="w300"
            mode="multiple"
            placeholder="请选择"
            // onFocus={this.onFocusGroup}
            // onBlur={this.onBlur}
            onChange={this.changePurposes}
            value={this.state.purposesData}
            allowClear
          >
            {

              (store.checkDataList.purposes || []).map(item => (
                <Option
                  key={item.purposeId}
                  value={item.purposeName}
                >{item.purposeName}</Option>
              ))
            }
          </Select>
          <Button onClick={this.purposesAll}>全选</Button>
        </span>
        <br /> <br />
        <span style={styleModel}>设备型号:</span> <Select
          className="w300"
          mode="multiple"
          placeholder="请选择"
          onFocus={this.onFocusGroup}
          onBlur={this.onBlur1}
          onChange={this.changeModel}
          value={this.state.modelData}
          allowClear
        >
          {
            (store.checkDataList.model || []).map(item => (
              <Option
                key={item}
                value={item}
              >{item}</Option>
            ))
          }
        </Select>
        <Button onClick={this.modelAll}>全选</Button>
        <span style={{ marginLeft: '10%' }}>
          <span style={styleStatus}>bug状态:</span> <Select
            className="w300"
            mode="multiple"
            placeholder="请选择"
            onFocus={this.onFocusGroup}
            onBlur={this.onBlur3}
            onChange={this.changeStatus}
            value={this.state.statusData}
            allowClear
          >
            {
              (store.checkDataList.status || []).map(item => (
                <Option
                  key={item.key}
                  value={item.value}
                >{item.value}</Option>
              ))
            }
          </Select>
          <Button onClick={this.statusAll}>全选</Button>
        </span>
        {
          // window.location.pathname === '/crash-platform/web/AbnormalOverview' ? null :
          <span>
            <br /><br />
            <span style={styleScope}>scope:</span> <Select
              className="w300"
              mode="multiple"
              placeholder="请选择"
              onFocus={this.onFocusGroup}
              onBlur={this.onBlur}
              onChange={this.changeScope}
              value={this.state.scope}
              allowClear
              style={{ width: 300, marginRight: '56px' }}
            >
              {
                (store.checkDataList.scope || []).map(item => (
                  <Option
                    key={item.id}
                    value={item.description}
                  >{item.description}</Option>
                ))
              }
            </Select>
          </span>
        }
        {
          <span style={{ marginLeft: '10%' }}>
            <span style={styleDate}>日期选择：</span>
            <span>
              <DatePicker
                allowClear={false}
                disabledDate={this.disabledStartDate}
                format="YYYY-MM-DD HH:mm:ss"
                value={startTime}
                placeholder="Start"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
              <DatePicker
                disabledDate={this.disabledEndDate}
                // showTime
                allowClear={false}
                format="YYYY-MM-DD HH:mm:ss"
                value={endTime}
                placeholder="End"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
                showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
              />
            </span></span>
        }

        <br /> <br />
        <span style={styleCrash}>崩溃类型：</span>
        {/* <SelectOption
          options={store.typeListData}
          defaultValue={this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).crashType === '1' ? 'Native崩溃' : JSON.parse(this.stringToQuery().id).crashType === '2' ? 'js崩溃' : JSON.parse(this.stringToQuery().id).crashType === '3' ? 'so崩溃' : '全部崩溃' : '全部崩溃'}
          // value={this.state.crashType}
          // value={'11111'}
          // defaultValue={this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).crashType === '1' ? 'Native崩溃' : JSON.parse(this.stringToQuery().id).crashType === '2' ? 'js崩溃' : JSON.parse(this.stringToQuery().id).crashType === '3' ? 'so崩溃' : '全部崩溃' : '全部崩溃'}

          onChange={this.onChageType}
        /> */}
        <Select
          className={window.location.pathname === '/crash-platform/web/AbnormalOverview' || '/crash-platform/web/AbnormalAnalysis' ? 'w300' : 'w160'}
          value={this.state.crashType}
          // defaultValue={this.stringToQuery().id ? JSON.parse(this.stringToQuery().id).crashType === '1' ? 'Native崩溃' : JSON.parse(this.stringToQuery().id).crashType === '2' ? 'js崩溃' : JSON.parse(this.stringToQuery().id).crashType === '3' ? 'so崩溃' : '全部崩溃' : '全部崩溃'}
          style={{ marginRight: window.location.pathname === '/crash-platform/web/AbnormalOverview' || '/crash-platform/web/AbnormalAnalysis' ? '60px' : '20px' }}
          placeholder={'请选择'}
          onChange={this.onChageType}
          dropdownMatchSelectWidth={false}
        >
          {
            store.typeListData.map((item, index) =>
              <Option key={index} value={item.value} className="select_option">{item.label}</Option>)
          }
        </Select>

        <span style={{ marginLeft: '10%', position: 'relative' }}>
          <span style={{ marginRight: '24px' }}>堆栈内容：</span>
          <Input
            placeholder="堆栈内容"
            value={this.state.crashStackValue}
            style={{ width: 300 }}
            onChange={this.onCrashStackInput}
          />
          <span unselectable="unselectable" style={clearBtnFir} className="clearBtn" onClick={this.crashStackClear} />
          {/* <Button onClick={this.crashStackClear}>删除</Button> */}
        </span>
        &nbsp;&nbsp;
        <br /> <br />
        <span style={{ position: 'relative' }}>
          <span style={styleUdid}>设备udid：</span>
          <Input
            placeholder="设备udid"
            style={{ width: 300, marginRight: '56px' }} onChange={this.onUdidInput}
            defaultValue={this.state.udid}
            value={this.state.udidValue}
          />
          <span unselectable="unselectable" style={clearBtnSec} className="clearBtn" onClick={this.udidClear} />
          &nbsp;&nbsp;
        </span>
        <span style={{ marginLeft: '10%' }}>
          <span style={styleProject}>project id:</span> <Select
            className="w300"
            // mode="multiple"
            mode="tags"
            placeholder="请输入"
            onFocus={this.onFocusGroup}
            onBlur={this.onBlur3}
            onChange={this.changeProId}
            value={this.state.projectId}
            allowClear
          />
        </span>
        <br /> <br />
        <Button type="primary" onClick={this.clear} style={styleClearFir}>清空</Button>
        <Button type="primary" onClick={this.search} style={styleSearch}>搜索</Button>
      </div >
    );
  }
}

export default MyCheckbox;
