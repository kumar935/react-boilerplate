import CacheUtil from './CacheUtil';
import json from './JsonUtil';
import axios from 'axios';

var cacheable = new CacheUtil("jsutils.resources");
var DFERRED = {};

function getJSONData(filePath){
  return new Promise((resolve, reject) => {
    axios.get(filePath).then(response => {
      resolve(json.parse(response.data));
    });
  });
}

const ResourceUtil = {
  getJSON: function(fileNameJson) {
    const version = (process && process.env) ? process.env.version : 0;
    var fileName = fileNameJson,
      fileNameKey = fileName;
    var langMap = cacheable.getVal(fileNameKey);
    if (langMap) {
      langMap = JSON.parse(langMap);
    }
    if (langMap && langMap.version >= version) {
      return new Promise(resolve => resolve(langMap));
    } else {
      return (function(dff){
        DFERRED[fileNameJson] = dff;
        return DFERRED[fileNameJson];
      })(DFERRED[fileNameJson] || getJSONData(fileNameJson).then(function(resp) {
          resp.version = version || resp.version;
          cacheable.setVal(fileNameKey, JSON.stringify(resp));
          return resp;
        }));
    }
  }
};

export default ResourceUtil;
