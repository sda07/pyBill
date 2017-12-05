(function() {
    "use strict";
    window.site = {
        getPlatform: function(ua, pf) {
            pf = pf === "" ? "" : pf || navigator.platform;
            ua = ua || navigator.userAgent;
            if (/Win(16|9[x58]|NT( [1234]| 5\.0| [^0-9]|[^ -]|$))/.test(ua) || /Windows ([MC]E|9[x58]|3\.1|4\.10|NT( [1234]\D| 5\.0| [^0-9]|[^ ]|$))/.test(ua) || /Windows_95/.test(ua)) {
                return "oldwin"
            }
            if (pf.indexOf("Win32") !== -1 || pf.indexOf("Win64") !== -1) {
                return "windows"
            }
            if (/android/i.test(ua)) {
                return "android"
            }
            if (/linux/i.test(pf) || /linux/i.test(ua)) {
                return "linux"
            }
            if (pf.indexOf("MacPPC") !== -1) {
                return "oldmac"
            }
            if (/Mac OS X 10.[0-8]\D/.test(ua)) {
                return "oldmac"
            }
            if (pf.indexOf("iPhone") !== -1 || pf.indexOf("iPad") !== -1 || pf.indexOf("iPod") !== -1) {
                return "ios"
            }
            if (ua.indexOf("Mac OS X") !== -1) {
                return "osx"
            }
            if (ua.indexOf("MSIE 5.2") !== -1) {
                return "oldmac"
            }
            if (pf.indexOf("Mac") !== -1) {
                return "oldmac"
            }
            if (pf === "" && /Firefox/.test(ua)) {
                return "fxos"
            }
            return "other"
        },
        getPlatformVersion: function(ua) {
            ua = ua || navigator.userAgent;
            var match = ua.match(/Windows\ NT\ (\d+\.\d+)/) || ua.match(/Mac\ OS\ X\ (\d+[\._]\d+)/) || ua.match(/Android\ (\d+\.\d+)/);
            return match ? match[1].replace("_", ".") : undefined
        },
        getArchType: function(ua, pf) {
            pf = pf === "" ? "" : pf || navigator.platform;
            ua = ua || navigator.userAgent;
            var re;
            if (/Windows/.test(ua) && /ARM/.test(ua)) {
                return "armv7"
            }
            if (navigator.cpuClass) {
                return navigator.cpuClass.toLowerCase()
            }
            re = /armv\d+/i;
            if (re.test(pf) || re.test(ua)) {
                return RegExp.lastMatch.toLowerCase()
            }
            if (/aarch64/.test(pf)) {
                return "armv8"
            }
            re = /PowerPC|PPC/i;
            if (re.test(pf) || re.test(ua)) {
                return "ppc"
            }
            return "x86"
        },
        getArchSize: function(ua, pf) {
            pf = pf === "" ? "" : pf || navigator.platform;
            ua = ua || navigator.userAgent;
            var re = /x64|x86_64|Win64|WOW64|aarch64/i;
            if (re.test(pf) || re.test(ua)) {
                return 64
            }
            return 32
        },
        needsSha1: function(ua) {
            ua = ua || navigator.userAgent;
            var os = /Windows (?:NT 5.1|XP|NT 5.2|NT 6.0)/;
            var ff = /\sFirefox/;
            return os.test(ua) && !ff.test(ua)
        },
        platform: "other",
        platformVersion: undefined,
        archType: "x64",
        archSize: 32
    };
    (function() {
        var h = document.documentElement;
        var platform = window.site.platform = window.site.getPlatform();
        var version = window.site.platformVersion = window.site.getPlatformVersion();
        if (platform === "windows") {
            if (version && parseFloat(version) >= 6.1) {
                h.className += " win7up"
            } else if (window.site.needsSha1()) {
                h.className += " sha-1"
            }
        } else {
            h.className = h.className.replace("windows", platform)
        }
        var archType = window.site.archType = window.site.getArchType();
        var archSize = window.site.archSize = window.site.getArchSize();
        var isARM = archType.match(/armv(\d+)/);
        if (archType !== "x86") {
            h.className = h.className.replace("x86", archType);
            if (isARM) {
                h.className += " arm";
                if (parseFloat(isARM[1]) >= 7) {
                    h.className += " armv7up"
                }
            }
        }
        if (archSize === 64) {
            h.className += " x64"
        }
        h.className = h.className.replace(/\bno-js\b/, "js")
    })()
})();
if (typeof Mozilla === "undefined") {
    var Mozilla = {}
}
Mozilla.dntEnabled = function(dnt, ua) {
    "use strict";
    var dntStatus = dnt || navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    var userAgent = ua || navigator.userAgent;
    var anomalousWinVersions = ["Windows NT 6.1", "Windows NT 6.2", "Windows NT 6.3"];
    var fxMatch = userAgent.match(/Firefox\/(\d+)/);
    var ieRegEx = /MSIE|Trident/i;
    var isIE = ieRegEx.test(userAgent);
    var platform = userAgent.match(/Windows.+?(?=;)/g);
    if (isIE && typeof Array.prototype.indexOf !== "function") {
        return false
    } else if (fxMatch && parseInt(fxMatch[1], 10) < 32) {
        dntStatus = "Unspecified"
    } else if (isIE && platform && anomalousWinVersions.indexOf(platform.toString()) !== -1) {
        dntStatus = "Unspecified"
    } else {
        dntStatus = {
            0: "Disabled",
            1: "Enabled"
        }[dntStatus] || "Unspecified"
    }
    return dntStatus === "Enabled" ? true : false
};
if (typeof Mozilla === "undefined") {
    var Mozilla = {}
}
Mozilla.Cookies = {
    getItem: function(sKey) {
        if (!sKey) {
            return null
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true
    },
    removeItem: function(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true
    },
    hasItem: function(sKey) {
        if (!sKey) {
            return false
        }
        return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie)
    },
    keys: function() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx])
        }
        return aKeys
    },
    enabled: function() {
        try {
            document.cookie = "cookietest=1";
            var ret = document.cookie.indexOf("cookietest=") !== -1;
            document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return ret
        } catch (e) {
            return false
        }
    }
};
if (typeof Mozilla == "undefined") {
    var Mozilla = {}
}(function(Mozilla) {
    var dataLayer = window.dataLayer = window.dataLayer || [];
    var Analytics = {};
    Analytics.getPageId = function(path) {
        var pageId = document.getElementsByTagName("html")[0].getAttribute("data-gtm-page-id");
        var pathName = path ? path : document.location.pathname;
        return pageId ? pageId : pathName.replace(/^(\/\w{2}\-\w{2}\/|\/\w{2,3}\/)/, "/")
    };
    Analytics.getTrafficCopReferrer = function() {
        var referrer;
        if (Mozilla.Cookies && Mozilla.Cookies.hasItem("mozilla-traffic-cop-original-referrer")) {
            referrer = Mozilla.Cookies.getItem("mozilla-traffic-cop-original-referrer");
            Mozilla.Cookies.removeItem("mozilla-traffic-cop-original-referrer")
        }
        return referrer
    };
    Analytics.buildDataObject = function() {
        var dataObj = {
            event: "page-id-loaded",
            pageId: Analytics.getPageId()
        };
        var referrer = Analytics.getTrafficCopReferrer();
        if (referrer) {
            dataObj.customReferrer = referrer
        }
        return dataObj
    };
    dataLayer.push(Analytics.buildDataObject());
    Mozilla.Analytics = Analytics
})(window.Mozilla);