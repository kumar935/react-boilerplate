import React from 'react';
import axios from 'axios';
import DataStore from './DataStore';
import LangUtil, {I18n} from '../utils/LangUtil';
import JsonUtil from '../utils/JsonUtil';
import Util from '../utils/Util';
import {toast} from 'react-toastify';
// import NProgress from 'nprogress';
import ToastUtil from "../utils/ToastUtil";
import EventService from "./EventService";


const CDN_PREFIX = window.CONST.remoteJsUrl;
const CDN_PATHS = JSON.parse(cdn.paths);

let PREFIX = '/';
if (window.CONST.dummyApi) {
  if (window.location.hostname === 'localhost') {
    PREFIX = '/stubs/';
  }
  if (window.CONST.remoteServerUrl) {
    PREFIX = window.CONST.remoteServerUrl;
  }
}

const LOGIN_CHECK_TIMEOUT = 960000; // 16 min
const DataService = {
  urlMap: {
    getMetaData: 'pub/user/meta',
    sendOtp: 'pub/register/verifyid',
    sendProfileOtp: 'api/user/otpsend',
    verifyOtp: 'pub/register/verifycuser',
    verifyRegOtp: 'pub/register/verifycustomer',
    getCountryListPub: 'pub/meta/country/list',
    getStateListPub: 'pub/meta/state/list',
    getDistrictListPub: 'pub/meta/district/list',
    getBranchList: 'pub/meta/branch/list',
    getNamePrefixes: 'pub/meta/name_prefix/list',
    subNotifications: 'api/user/notify/register',
    initRegistrationNewUser: 'pub/register/new/init',
    verifyRegistrationNewUser: 'pub/register/new/verify',
    addHomeAddressNewUser: 'pub/register/new/address',
    getSecQuesPub: 'pub/register/secques',
    submitSecQuesNewUser: 'pub/register/new/secques',
    submitPhishingImgNewUser: 'pub/register/new/phising',
    submitLoginCredsNewUser: 'pub/register/new/creds',
    // getSecurityQuestions: 'api/secques/get',
    setSecurityQuestionsPub: 'pub/register/secques',//'api/secques/set',
    setSecurityQuestions: 'api/user/secques',
    setPhishingImagePub: 'pub/register/phising',//'api/phising/set',
    setPhishingImage: 'api/user/phising',
    getTransactionHistory: 'api/user/tranx/history',
    getExchangeRateData: 'api/remitt/xrate',
    getBeneficiaryList: 'api/user/bnfcry/list',
    getFavBeneList: 'api/user/bnfcry/fav',
    setBeneFav: 'api/user/bnfcry/fav',
    getBeneDetails: 'api/remitt/default',
    getProfileInfo: 'api/user/profile',
    updateEmail: 'api/user/email',
    updatePhone: 'api/user/phone',
    saveRateAlert: 'api/xtrate/alert/save',
    getTxStatus: 'api/remitt/tranx/status',
    deleteRateAlert: 'api/xtrate/alert/delete',
    printTxHistory: 'api/user/tranx/print_history',
    txHistoryEmail: 'api/user/tranx/print_history',
    getBeneXRate: 'api/remitt/tranxrate',
    remitNow: 'api/remitt/tranx/pay',
    getTxPurposeList: 'api/remitt/purpose/list',
    disableBeneficiary: 'api/user/bnfcry/disable',
    trnxHistoryPdf: 'api/user/tranx/report.html',
    trnxHistoryPdfDup: 'api/user/tranx/report.html?duplicate=true',
    setLoginDetails: 'pub/register/creds',//'api/creds/set',
    secQuesVerification: 'pub/auth/secques',//'pub/user/secques',
    sendOtpForResetPwd: 'pub/auth/reset',//'pub/user/reset',
    resetPwd: 'api/user/password',
    resetPwdPub: 'pub/auth/password',//'pub/user/password',
    sendLoginOtp: 'pub/auth/otp',
    login: 'pub/auth/login',//'pub/user/login',
    logout: 'pub/auth/logout',//'pub/user/logout',
    getCurrencyList: 'api/meta/ccy/list',
    getIncomeSources: 'api/meta/income_sources',
    getBankList: 'api/meta/bank/list',
    getCountryList: 'api/meta/country/list',
    getStateList: 'api/meta/state/list',
    getDistrictList: 'api/meta/district/list',
    queryBranchIFSCSwift: 'api/meta/bank_branch/list',
    getServiceList: 'api/meta/services/list',
    getServiceProvidersList: 'api/meta/service_provider/list',
    getAccountList: 'api/meta/bnfcry/accounts',
    getBeneRelations: 'api/meta/bnfcry/relations',
    getBeneCurrList: 'api/meta/bnfcry/ccy',
    getBeneDetailsCustomFields: 'api/form/fields/bnfcry',
    getAgentMasterList: 'api/meta/agent/list',
    getAgentBranchList: 'api/meta/agent_branch/list',
    submitBeneAccountInfo: 'api/user/bnfcry/account',
    submitBenePersonalInfo: 'api/user/bnfcry/personal',
    sendOtpForSaveBene: 'api/user/bnfcry/otp',
    validateOtpForSaveBene: 'api/user/bnfcry/commit'
  },

  init() {
    //need a meta call here.
    let lang = window.localStorage.getItem('lang');
    if(lang){
      DataStore.setLang(lang);
    }
    this.initInterceptors();
    this.source = axios.CancelToken.source();
    return this.loadLang();
  },
  checkLogin(){
    if(window.location.pathname.indexOf("/app/") === -1) return;
    window.clearTimeout(this.checkLoginTimeout);
    this.checkLoginTimeout = window.setTimeout(()=>{
      this.post('getProfileInfo', {}, {loginCheck: true}).then(resp => {
        if(resp.data.data.status === "UNAUTHORIZED"){
          ToastUtil.warn("Session timed out")
          console.log("session timed out");
        }
      });
    },LOGIN_CHECK_TIMEOUT);
  },
  initInterceptors(){
    // NProgress.configure({
    //   showSpinner: false,
    //   trickleSpeed: 400
    // });
    // this.numberOfAjaxCAllPending = 0;
    // // Add a request interceptor
    // axios.interceptors.request.use( config => {
    //   this.numberOfAjaxCAllPending++;
    //   // show loader
    //   if(!NProgress.isStarted()) NProgress.start();
    //   return config;
    // }, function (error) {
    //   return Promise.reject(error);
    // });
    //
    // // Add a response interceptor
    // axios.interceptors.response.use( response => {
    //   if(NProgress.isStarted()) NProgress.inc();
    //   this.checkLogin();
    //   this.numberOfAjaxCAllPending--;
    //   if(this.numberOfAjaxCAllPending < 0) this.numberOfAjaxCAllPending = 0;
    //   // console.log("------------  Ajax pending", this.numberOfAjaxCAllPending);
    //   if (this.numberOfAjaxCAllPending === 0) {
    //     NProgress.done();
    //     //hide loader
    //   }
    //   return response;
    // },  error => {
    //   if(NProgress.isStarted()) NProgress.inc();
    //   this.numberOfAjaxCAllPending--;
    //   if(this.numberOfAjaxCAllPending < 0) this.numberOfAjaxCAllPending = 0;
    //   // console.log("------------  Ajax pending", this.numberOfAjaxCAllPending);
    //   if (this.numberOfAjaxCAllPending === 0) {
    //     NProgress.done();
    //     //hide loader
    //   }
    //   return Promise.reject(error);
    // });
  },
  get(url, data, _config) {
    let config = _config || {};
    config = {
      ...config,
      headers: {
        'Accept' :'application/json',
        ...config.headers
      }
    };
    let finalUrl = PREFIX + this.prepare(url, config);
    return axios.request({
      url: finalUrl,
      method: 'get',
      headers: config.headers,
      params: data,
      cancelToken: this.source.token
    }).then(resp => {
      this.interceptResponse(resp, url, config, data);
      return resp;
    }).catch(resp => {
      if(!config.noToast) ToastUtil.error(resp.response.data.error || "There was an error");
      return resp;
    });
  },
  post(url, data, _config) {
    let config = _config || {};
    config = {
      ...config,
      headers: {
        'Accept' :'application/json',
        ...config.headers
      }
    };
    let finalUrl = PREFIX + this.prepare(url, config);
    return axios.request({
      url: finalUrl,
      data: data,
      method: 'post',
      responseType: config.responseType,
      headers: config.headers,
      cancelToken: this.source.token
    }).then(resp => {
      this.interceptResponse(resp, url, config, data);
      return resp;
    }).catch(resp => {
      console.log(resp);
      if(!config.noToast && resp.response && resp.response.data && resp.response.data.error) ToastUtil.error(resp.response.data.error);
      return resp;
    });
  },
  abortRequests(){
    this.source.cancel();
    this.source = axios.CancelToken.source();
  },
  interceptResponse(resp, url, config, data){

  },
  getRecentTransactions(){
      return new Promise((resolve) => {
        if(DataStore.getData().recentTransactions === null){
          this.post('getTransactionHistory').then(resp => {
            if(resp.data.status === "200"){
              resp.data.data.map((v,i) => {
                v.srNoOrig = i;
              });
              DataStore.saveRecentTransactions(resp.data.data);
              resolve(resp.data.data);
            }
          });
        } else {
          resolve(DataStore.getData().recentTransactions);
        }
      });
  },
  checkDownload(resp){
    if(!resp || !resp.headers['content-disposition']) return;
    let fileName = (resp.headers['content-disposition'] || "attachment; filename=report.pdf").split(" ")[1].split("=")[1];
    const url = window.URL.createObjectURL(new Blob([resp.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  },
  updateStubs(url, resp, config){
    if(process.env.DEV && window.CONST.updateStubs){
      axios.request({
        url: "http://localhost:5000/update-stub/" + this.prepare(url, config),
        data: resp.data,
        method: 'post'
      });
    }
  },
  loadMetaData(){
    return this.postFormData('getMetaData', {}).then((resp)=>{
      if(resp.status === 200){
        DataStore.setRegistrationData({validSession: resp.data.data.validSession, active: resp.data.data.active});
        DataStore.setUserData(resp.data.data.info);
        DataStore.setDomCur(resp.data.data.domCurrency);
        DataStore.setConfig(resp.data.data.config);
        DataStore.setFeatures(resp.data.data.features);
        DataStore.setTenantInfo(resp.data.data);
        return resp;
      }
    });
  },
  postFormData(url, _data, config){
    let data = _data || {};
    const params = Util.param(data);
    return this.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      ...config
    });
  },
  getFromCDN(url){
    return axios.get(CDN_PREFIX + url);
  },
  loadLang(){
    var lang = DataStore.setLang();
    let defaults = {"default": "en"};
    if(window.CONST.dev){
      let config = JsonUtil.parse(window.localStorage.getItem('debugConfig'));
      if(config && config.lang){
        defaults = {"default": config.lang};
      }
    }
    lang = defaults[lang] || lang;
    return LangUtil.loadLangJson(`${CDN_PREFIX}/dist/${CDN_PATHS.langFiles.to}/keywords.web.${lang}.json?_=${process && process.env && process.env.timestamp ? process.env.timestamp : ''}`).then(() => {
      DataStore.getData().prefs.langFloat = LangUtil.getVal("langFloat");
    });
  },
  prepare(url, config) {
    url = (this.urlMap[url] || url);
    for (var i in config) {
      url = url.replace("{" + i + "}", config[i]);
    }
    return url;
  },
};

export default DataService;


