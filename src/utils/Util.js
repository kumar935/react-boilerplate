// import zipcelx from 'zipcelx';

const currencySymbolMap = {
  "INR": "0x20B9",
  "USD": "0x0024;",
  "PKR": "8360",
  "LKR": "8360",
  "PHP": "8369",
  "BDT": "2547"
}

const Util = {
  //source: https://stackoverflow.com/a/22583327/3248247
  notify(title,msg) {
    let notification;
    let options = {};
    if(msg) options.body = msg;
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
    }

    else if (Notification.permission === "granted") {
      notification = new Notification(title, options);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          notification = new Notification(title, options);
        }
      });
    }
    return notification;
  },
  param(obj){
    let app = {},
      class2type = {},
      toString = class2type.toString,
      r20 = /%20/g,
      rbracket = /\[\]$/;
    function type(obj) {
      if ( obj == null ) {
        return obj + "";
      }
      // Support: Android < 4.0, iOS < 6 (functionish RegExp)
      return typeof obj === "object" || typeof obj === "function" ?
        class2type[ toString.call(obj) ] || "object" :
        typeof obj;
    }
    function isFunction(obj) {
      return type(obj) === "function";
    }
    function buildParams(prefix, obj, add) {
      var name, key, value;

      if(Array.isArray(obj)) {
        for(var key in obj) {
          value = obj[key]
          if(rbracket.test(prefix))
            add(prefix, value);
          else
            buildParams(prefix + "[" + (typeof v === "object"? i: "") + "]", value, add );
        }
      } else if(type(obj) === 'object') {
        for(name in obj)
          buildParams(prefix + "[" + name + "]", obj[name], add);
      } else
        add(prefix, obj);
    }
    function param(obj){
      var prefix, key, value,
      serialized = [],
      add = function(key, value) {
        value = isFunction(value)? value() : (value == null ? "" : value );
        serialized[serialized.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
      };

      if(Array.isArray(obj)) {
        for(key in obj) {
          value = obj[key];
          add(key, value);
        }
      } else {
        for(prefix in obj)
          buildParams(prefix, obj[prefix], add);
      }
      return serialized.join('&').replace(r20, '+');
    }
    return param(obj);
  },
  exportToCSV(rows){
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray){
      rowArray = rowArray.map(cell => `"${cell}"`);
      let row = rowArray.join(",");
      csvContent += row + "\r\n"; // add carriage return
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_history.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  },

  debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  },

  toTitleCase(str){
    if(!str) return "";
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  },

  toSentenceCase(str){
    if(!str) return "";
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  },

  toCurrencySymbol(str){
    if(currencySymbolMap[str]){
      return String.fromCharCode(currencySymbolMap[str]);
    } else {
      return str;
    }
  },

  numberWithCommas (x) {
    if(isNaN(x) || x === null) return "";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  round (number, precision) {
    if(precision === undefined) return number;
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  },

  sum (a,b){
    return a + b;
  },

  roundDown(number, precision){
    if(precision === undefined) return number;
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = -Math.round(-tempNumber);
    return roundedTempNumber / factor;
  },

  roundedWithCommas(number, precision){
    if(isNaN(number) || number === null) return "";
    return this.numberWithCommas(this.round(number, precision));
  },

  // exportToXLS(rows){
  //   rows = rows.map(function(rowArray){
  //     return rowArray.map(cell => ({value: cell, type: 'string'}));
  //   });
  //   zipcelx({
  //     filename: 'transaction_history',
  //     sheet: {
  //       data: rows
  //     }
  //   })
  // },

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

}

export default Util;
