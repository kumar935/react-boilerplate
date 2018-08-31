import React from 'react';
import ResourceUtil from './ResourceUtil';
const STRINGS = {};

const LangUtil = {
  reversemap: {},
  add(langMap) {
    return new Promise((resolve) => {
      for (var key in langMap.map) {
        STRINGS[key.toLowerCase()] = langMap.map[key];
      }
      resolve(langMap);
    })
  },
  loadLangJson(fileNameJson) {
    var self = this;
    return ResourceUtil.getJSON(fileNameJson).then(function(resp) {
      return self.add(resp);
    });
  },
  getVal(key,tnt) {
    if (typeof key === 'string') {
      var keys = key.split(":");
      var str = STRINGS[keys[0].toLowerCase()] || "";
      let replaceCount = (str.match(/\$/g) || []).length;
      for (var i = 1; i <= replaceCount; i++) { // <= replaceCount instead of < keys.length
        str = str.replace("$" + i, keys[i] || "");
      }
      if(tnt){
        var vars = (str.match(/\$\{[\w]+\}/gm) || []).map(function(strkey){
            return strkey.replace("${","").replace("}","")
          });
        tnt = (tnt || "def").toLowerCase();
        for(var ivar in vars){
          str = str.replace("${" + vars[ivar] + "}", (STRINGS["var."+vars[ivar]+"." + tnt] || STRINGS["var."+vars[ivar]+".def"] || ""));
        }
      }
      str = str ? str : key;
      if (this.reversemap) {
        this.reversemap[str] = key;
      }
      return str;
    }
    return key;
  },
  getMsg(msgKey){
    let key = msgKey.split("_").join("").toLowerCase();
    let args = msgKey.split(":");
    args.shift();
    let fullKey = `g.msg.${key.split(":")[0]}:${args.join(":")}`;
    let msg = this.getVal(fullKey);
    if(msg === fullKey) return msgKey;
    return msg;
  },
  key(str) {
    if (typeof str === 'string' && this.reversemap && this.reversemap[str]) {
      return this.reversemap[str];
    }
    return str;
  }
};

const I18n = (key,tnt) => LangUtil.getVal(key,tnt);
const langFloat = () => LangUtil.getVal('langFloat');

export default LangUtil;
export {I18n, langFloat};
