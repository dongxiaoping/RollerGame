export class Http {
    /*  
   * 网络请求之GET  
   * url 请求的网络地址  
   * callback 回调参数  
   * */
    getWithUrl(url: string, callback: any) {
        let err = false
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url, true);
      //  xhr.setRequestHeader('cache-control','no-cache');
        xhr["onloadend"] = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                err = false;
            } else {
                err = true;
            }
            var response = ''
            try {
                response = JSON.parse(xhr.responseText)
            } catch (e) { console.log(e) }
            callback(err, response);
        };
        xhr.send();
    }

    /*  
     * 网络请求之POST  
     * url 请求的网络地址  
     * params  请求参数  ("id=1&id=2&id=3")  
     * callback 回调参数  
    ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout']  
    * */
    sendWithUrl(url: string, params: string, callback: any) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
       // xhr.setRequestHeader('cache-control','no-cache');
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr["onloadend"] = function () {
            var sc = -1
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                sc = 0;
            }
            var json = JSON.parse(xhr.responseText)
            var rc = parseInt(json["code"])
            callback(sc, rc, json);
        }
        xhr.send(params);
    }
}

export default new Http()
