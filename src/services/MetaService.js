import DataService from './DataService';
import Util from "../utils/Util";


const MetaService = {
  metaData: {},
  prefix: 'api/meta',
  post(url, data, config){
    let urlKey = `post_${url}`;
    if(this.metaData[urlKey]) return this.metaData[urlKey];
    return DataService.post(url, data, config).then(resp => {
      this.metaData[urlKey] = new Promise(resolve => resolve(resp));
      return resp;
    });
  },
  postFormData(url, _data, config){
    let data = _data || {};
    let urlKey = `post_${url}`;
    if(this.metaData[urlKey]) return this.metaData[urlKey];
    const params = Util.param(data);
    return this.post(url, params, {
      headers: {
        'Content-Type' :'application/x-www-form-urlencoded',
      },
      ...config
    }).then(resp => {
      this.metaData[urlKey] = new Promise(resolve => resolve(resp));
      return resp;
    });
  },
  get(url, data, config){
    let urlKey = `get_${url}`;
    if(this.metaData[urlKey]) return this.metaData[urlKey];
    return DataService.get(url, data, config).then(resp => {
      this.metaData[urlKey] = new Promise(resolve => resolve(resp));
      return resp;
    });
  },
  clear(url){
    delete this.metaData[`get_${url}`];
    delete this.metaData[`post_${url}`];
  },
  reset(){
    this.metaData = {};
  }
}

export default MetaService;
