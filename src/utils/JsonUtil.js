// var dummyJson;
let jsonutil = {};
const BRACKET_RE_S = /\['([^']+)'\]/g;
const BRACKET_RE_D = /\["([^"]+)"\]/g;
const BRACKET_RE_N = /\[([0-9]+)\]/g;

function getDummyJson() {
  // dummyJson = dummyJson || _module_('dummyJson');
  // if(dummyJson ===undefined){
  //   console.warn("dummyJson is not installed, to compile json, dummyJson is recommended.")
  // }
  // return dummyJson;
}

function normalizeKeypath(key) {
  return key.indexOf('[') < 0
    ? key
    : key.replace(BRACKET_RE_S, '.$1')
      .replace(BRACKET_RE_D, '.$1')
      .replace(BRACKET_RE_N, '.$1');
}

jsonutil.get = function (obj, key) {
  /* jshint eqeqeq: false */
  key = normalizeKeypath(key);
  if (key.indexOf('.') < 0) {
    return obj[key];
  }
  const path = key.split('.');
  let d = -1;
  const l = path.length;
  while (++d < l && obj != null) {
    obj = obj[path[d]];
  }
  return obj;
};

/**
 *  set a value to an object keypath
 */
jsonutil.set = function (obj, key, val) {
  /* jshint eqeqeq: false */
  key = normalizeKeypath(key);
  if (key.indexOf('.') < 0) {
    obj[key] = val;
    return;
  }
  const path = key.split('.');
  let d = -1;
  const l = path.length - 1;
  while (++d < l) {
    if (obj[path[d]] == null) {
      obj[path[d]] = {};
    }
    obj = obj[path[d]];
  }
  obj[path[d]] = val;
  return obj[path[d]];
};

jsonutil.stringify = function (obj) {
  // if(!errorList) var errorList = [];
  try {
    return JSON.stringify(obj);
  } catch (err) {
    // errorList.push(err)
    return jsonutil.stringify({
      msg: 'cannot convert JSON to string',
      error: [err],
    });
  }
};

const parse = function (str, throwExcep) {
  if (typeof (str) === 'object') { return str; }
  try {
    return JSON.parse(str);
  } catch (err) {
    try {
      return $.parseJSON(str);
    } catch (err2) {
      const errorMSG = { msg: 'cannot convert to JSON object', error: [err, err2], str };
      if (throwExcep) { throw err2; } else { console.log(errorMSG); }
      return errorMSG;
    }
  }
};

jsonutil.parse = function (_json_string_, data) {
  if (!_json_string_) {
    return _json_string_;
  }
  if (typeof _json_string_ === 'string') {
    let _json_string_2 = _json_string_;
    if (data !== undefined && getDummyJson() !== undefined) {
      _json_string_2 = getDummyJson().parse(_json_string_, {
        data: { data },
      });
    }
    return parse(_json_string_2);
  }
  return _json_string_;
};

jsonutil.duplicate = function (obj) {
  let retObj = obj;
  if (!obj) {
    console.warn('Cannot dubplicate', obj);
    return retObj;
  }
  try {
    var newString = JSON.stringify(obj);
    retObj = JSON.parse(newString);
  } catch (err) {
    console.error('NOT SAFE', obj, newString);
    retObj = jsonutil.makeCopy(obj, 10);
  }
  return retObj;
};
jsonutil.makeCopy = function (obj, level) {
  if (level) {
    if (jQuery.isPlainObject(obj)) {
      var newObj = {};
    } else if (jQuery.isArray(obj)) {
      var newObj = [];
    } else return obj;
    for (const key in obj) {
      newObj[key] = jsonutil.makeCopy(obj[key], level - 1);
    }
    return newObj;
  }
  return obj;
};


jsonutil.getObjFromQueryParams = str => {
  return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}


export default jsonutil;
