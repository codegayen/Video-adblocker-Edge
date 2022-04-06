var constant = `
  (function() {
    const chain = '{{1}}';
    let AdsValue = '{{2}}';
    const thisScript = document.currentScript;
    if ( AdsValue === 'undefined' ) {
        AdsValue = undefined;
    } else if ( AdsValue === 'false' ) {
        AdsValue = false;
    } else if ( AdsValue === 'true' ) {
        AdsValue = true;
    } else if ( AdsValue === 'null' ) {
        AdsValue = null;
    } else if ( AdsValue === 'noopFunc' ) {
        AdsValue = function(){};
    } else if ( AdsValue === 'trueFunc' ) {
        AdsValue = function(){ return true; };
    } else if ( AdsValue === 'falseFunc' ) {
        AdsValue = function(){ return false; };
    } else if ( /^\d+$/.test(AdsValue) ) {
        AdsValue = parseFloat(AdsValue);
        if ( isNaN(AdsValue) ) { return; }
        if ( Math.abs(AdsValue) > 0x7FFF ) { return; }
    } else if ( AdsValue === "''" ) {
        AdsValue = '';
    } else {
        return;
    }
    let aborted = false;
    const mustAbort = function(v) {
        if ( aborted ) { return true; }
        aborted =
            (v !== undefined && v !== null) &&
            (AdsValue !== undefined && AdsValue !== null) &&
            (typeof v !== typeof AdsValue);
        return aborted;
    };
    const trapProp = function(owner, prop, configurable, handler) {
        if ( handler.init(owner[prop]) === false ) { return; }
        const odesc = Object.getOwnPropertyDescriptor(owner, prop);
        let prevGetter, prevSetter;
        if ( odesc instanceof Object ) {
            if ( odesc.configurable === false ) { return; }
            if ( odesc.get instanceof Function ) {
                prevGetter = odesc.get;
            }
            if ( odesc.set instanceof Function ) {
                prevSetter = odesc.set;
            }
        }
        Object.defineProperty(owner, prop, {
            configurable,
            get() {
                if ( prevGetter !== undefined ) {
                    prevGetter();
                }
                return handler.getter(); // AdsValue
            },
            set(a) {
                if ( prevSetter !== undefined ) {
                    prevSetter(a);
                }
                handler.setter(a);
            }
        });
    };
    const trapChain = function(owner, chain) {
        const pos = chain.indexOf('.');
        if ( pos === -1 ) {
            trapProp(owner, chain, false, {
                v: undefined,
                init: function(v) {
                    if ( mustAbort(v) ) { return false; }
                    this.v = v;
                    return true;
                },
                getter: function() {
                    return document.currentScript === thisScript
                        ? this.v
                        : AdsValue;
                },
                setter: function(a) {
                    if ( mustAbort(a) === false ) { return; }
                    AdsValue = a;
                }
            });
            return;
        }
        const prop = chain.slice(0, pos);
        const v = owner[prop];
        chain = chain.slice(pos + 1);
        if ( v instanceof Object || typeof v === 'object' && v !== null ) {
            trapChain(v, chain);
            return;
        }
        trapProp(owner, prop, true, {
            v: undefined,
            init: function(v) {
                this.v = v;
                return true;
            },
            getter: function() {
                return this.v;
            },
            setter: function(a) {
                this.v = a;
                if ( a instanceof Object ) {
                    trapChain(a, chain);
                }
            }
        });
    };
    trapChain(window, chain);
  })();
`;
var config = {
  "scriptlets": {
    "build": function () {
      var script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      //
      script.textContent = `
        (function () {
          var pruner = function (o) {
            delete o.playerAds;
            delete o.adPlacements;
            //
            if (o.playerResponse) {
              delete o.playerResponse.playerAds;
              delete o.playerResponse.adPlacements;
            }
            //
            return o;
          }
          //
          JSON.parse = new Proxy(JSON.parse, {
            apply: function () {
              return pruner(Reflect.apply(...arguments));
            }
          });
          //
          Response.prototype.json = new Proxy(Response.prototype.json, {
            apply: function () {
              return Reflect.apply(...arguments).then(o => pruner(o));
            }
          });
        })();
        //
        ${constant.replace("{{1}}", "playerResponse.adPlacements").replace("{{2}}", "undefined")};
        ${constant.replace("{{1}}", "ytInitialPlayerResponse.adPlacements").replace("{{2}}", "undefined")};
      `;
      //
      document.documentElement.appendChild(script);
      script.remove();
    }
  }
};
config.scriptlets.build();