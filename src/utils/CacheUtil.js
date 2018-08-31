import json from './JsonUtil'

var localStorage = window.localStorage;
var cacheCounter = 0;

var CacheTable = function CacheTable(records){
  this.push.apply(this,records);
};
CacheTable.prototype = new Array();

CacheTable.prototype.index = function(fun){
  this._index_ = fun;
};
CacheTable.prototype.save = function(fun){
  this._index_ = fun;
};

class CacheUtil {
  constructor(cacheName){
    this.id = cacheName || cacheCounter++;
    this.tables = {};
  }
  setVal(key,value){
    return localStorage.setItem(this.id + "#" + key,json.stringify({ 'time' : '0', text : value}));
  }
  has(key){
    var value = localStorage.getItem(this.id + "#"+ key);
    return (typeof value === 'string');
  }
  getVal(key){
    var xString = localStorage.getItem(this.id + "#"+ key);
    var x = json.parse(xString)
    return (x==undefined) ? null : x.text;
  }

  saveText(key,value){
    if(typeof value !== "string"){
      return localStorage.setItem(this.id + "#" + key,json.stringify(value));
    } else {
      return localStorage.setItem(this.id + "#" + key,value);
    }
  }
  table(tablename){
    if(this.tables[tablename]){
      return this.tables[tablename];
    }
    var tableCache = this.get("#_TABLE_");
    if(tableCache == null){
      tableCache = { list : table , _index_ : null}
      this.set("#_TABLE_",tableCache);
    }
    this.tables[tablename] = new CacheTable(tableCache.list);
    this.tables[tablename].index(tableCache._index_);
    this.tables[tablename]._cacheid_ = this.id
    return this.tables[tablename];
  }
}

export default CacheUtil;
