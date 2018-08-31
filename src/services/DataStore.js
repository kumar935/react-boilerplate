import CacheUtil from '../utils/CacheUtil';

const CACHE = new CacheUtil('DataStore');
const DataStore = {
  data: {
    tenant: "",
    tenantCode: "",
    prefs: {
      lang: "default",
      langFloat: "left"
    },
    registration: {
      validSession: false,
      active: false
    },
    customerCareDetails: {
      custPhone: '+965 22057194',
      custEmail: 'exch-online1@almullagroup.com'
    },
    addBeneData:{},
    recentTransactions: null,
    user: {},
    otp: null,
    eOtp: null,
    domCurrency: {},
    login: {
      loginData: null
    },
    features: []
  },
  init() {
    this.dataStr = JSON.stringify(this.data);
    let tenant;
    try{
      tenant = window.location.host.split(".")[0].split("-")[1].toUpperCase();
    } catch (e){
      console.warn(e);
    }
    this.data.tenant = tenant;
  },
  reset() {
    this.data = JSON.parse(this.dataStr);
    this.setLang("default");
  },
  resetAddBeneData(){
    this.data.addBeneData = {};
  },
  setAddBeneData(data){
    if(data.country) this.data.addBeneData.country = data.country;
    if(data.bank) this.data.addBeneData.bank = data.bank;
    if(data.service) this.data.addBeneData.service = data.service;
  },
  clearOTP(){
    this.data.otp = null;
    this.data.eOtp = null;
  },
  setOTP(otp, eOtp) {
    this.data.otp = otp;
    this.data.eOtp = eOtp;
  },
  getData() {
    return this.data;
  },
  saveRecentTransactions(data){
    this.data.recentTransactions = data;
  },
  setRegistrationData({validSession, active}){
    this.data.registration.validSession = validSession || this.data.registration.validSession;
    this.data.registration.active = active || this.data.registration.active;
  },
  setUserData(data){
    this.data.user = data || this.data.user;
  },
  setDomCur(data){
    this.data.domCurrency = data || this.data.domCurrency;
  },
  setFeatures(data){
    this.data.features = data || this.data.features;
  },
  setLoginData(data, identity){
    this.data.login.loginData = data;
    this.data.login.identity = identity;
  },
  setConfig(data){
    this.data.config = data || this.data.config;
  },
  setLang(lang) {
    var _lang = this.data.prefs.lang = lang || this.data.prefs.lang;
    CACHE.setVal("lang", _lang);
    return _lang;
  },
  setTenantInfo(data){
    this.data.tenantCode = data.tenantCode || this.data.tenantCode;
  },
  setData(data) {
    // if (data.emailSet !== undefined) {
    //   this.data.emailSet = data.emailSet;
    // }
  },
};

export default DataStore;
