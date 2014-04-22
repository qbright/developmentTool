(function () {
    var qValid = {};

    var root, o_qValid;

    root = this;

    if (root != null) {
        o_qValid = root.qValid;
    }

    qValid.noConflict = function () {
        root.qValid = o_qValid;
        return qValid;
    }

////////////////////////////////////////////////////////

    var regExp = {
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
        ipV4Maybe: /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/,
        ipV6: /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/,
        creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        alpha: /^[a-zA-Z]+$/,
        alphanumeric: /^[a-zA-Z0-9]+$/,
        numeric: /^-[0-9]+$/,
        int: /^(?:-?(?:0|[1-9][0-9]*))$/,
        float: /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
        hexadecimal: /^[0-9a-fA-F]+$/,
        hexcolor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        ascii: /^[\x00-\x7F]+$/,
        multibyte: /[^\x00-\x7F]/,
        fullWidth: /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/,
        halfWidth: /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/,
        url: "^(({$1}):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)|)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?$",
        urlNoprotocol: /((\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        base64: /[^a-zA-Z0-9\/\+=]/i

    }


    qValid.validData = function (data, validType, callback) {

    }

    qValid.validMap = function (mapData, validMap, callback) {
        var errorStack = [];
        var pushError = function(errorStack,item,data,validMethod){
            errorStack.push({
                item:item,
                validMethod:validMethod,
                validMsg:"the data '" + data + "' was invalid by the method '" + validMethod +"'"
            });
        }

        for(var item in validMap){
            var data = mapData[item],
                valid = validMap[item];

            var result = qValid.runValid(data,valid);
            if(result === false){
                pushError(errorStack,item,data,valid[0]);
            }else  if(result.length && result.length !== 0){
                for(var i = 0,result_;result_ = result[i]; i ++) {
                    pushError(errorStack,item,data,valid[0]);
                }
            }

        }

       callback && callback.call(this,errorStack);

    }

    qValid.runValid = function(data,valid){

        if(valid[0] instanceof  Array){
            var errorStack = [];
            for(var i = 0, valid_; valid_ = valid[i];i ++){
                var result = qValid.runValid(data,valid_);
                !result && errorStack.push(result);
            }
            return errorStack;


        }else{
            if(qValid[valid[0]]){
                var param = valid.splice(1);
                    param.unshift(data);
                console.log(param);
                return qValid[valid[0]].apply(this,param);
            }
        }

    };

    qValid.extend = function (name, fn) {
        qValid[name] = function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(qValid, args);
        }
    }


    qValid.toString = function (input) {
        if (typeof input === "obj" && input !== null & input.toString) {
            input = input.toString();
        } else if (input === null || typeof input === "undefined" || (isNaN(input)) && !input.length) {
            input = "";
        } else if (typeof input !== "string") {
            input += "";
        }
        return input;
    }

    qValid.isNumber = function (str) {
        return regExp.numeric.test(str);
    }

    qValid.isLength = function(str,min,max){
        return str.length >= min && (typeof max === "undefined" || str.length <= max);
    }

    qValid.isEmail = function (str) {
        return regExp.email.test(str);
    }

    qValid.isIP = function (str, version) {
        version = qValid.toString(version);

        if (!version) {
            return qValid.isIP(str, 4) || qValid.isIP(str, 6);
        } else if (version === "4") {
            if (!regExp.ipV4Maybe.test(str)) {
                return false;
            }
            var parts = str.split(".").sort();
            return parts[3] <= 255;
        }
        return version === "6" && regExp.ipV6.test(str);
    }

    qValid.isUrl = function (str, protocolArr) {
        if (protocolArr && protocolArr.length == 0) {

            return regExp.urlNoprotocol.test(str);

        } else if (!protocolArr) {

            protocolArr = ["http", "https", "ftp"];

        }
        protocolArr = protocolArr.join("|");
        var urlRegExp = new RegExp(regExp.url.replace("{$1}", protocolArr));

        return urlRegExp.test(str);

    }


    qValid.isJSON = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            if (e instanceof SyntaxError) {
                return false;
            }
        }
        return true;
    }

    qValid.isEmpty = function(str){
           return qValid.trim(str) === "";
    }


    //Tool

    qValid.trim = function(str){
       if(String.prototype.trim) {
           return str.trim();
       }else{
           var regExp = /(^\s*)|(\s*$)/g;
           return str.replace(regExp,"");
       }
    }

////////////////////////////////////////////////////////


    //SEAJS
    if (typeof define !== "undefined" && define.cmd) {
        define([], function () {
            return qValid;
        });
    }
    // NODEJS
    else if (typeof module !== "undefined" && module.exports) {
        module.exports = qValid;
    }
    // <script> TAR
    else {
        root.qValid = qValid;
    }


})()
