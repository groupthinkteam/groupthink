(this.webpackJsonpgroupthink=this.webpackJsonpgroupthink||[]).push([[12],{505:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==u(t)&&"function"!==typeof t)return{default:t};var e=i();if(e&&e.has(t))return e.get(t);var r={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var a=n?Object.getOwnPropertyDescriptor(t,o):null;a&&(a.get||a.set)?Object.defineProperty(r,o,a):r[o]=t[o]}r.default=t,e&&e.set(t,r);return r}(r(0)),o=r(90),a=r(242);function i(){if("function"!==typeof WeakMap)return null;var t=new WeakMap;return i=function(){return t},t}function u(t){return(u="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function c(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){P(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"===typeof Symbol||!(Symbol.iterator in Object(t)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,u=t[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(l){o=!0,a=l}finally{try{n||null==u.return||u.return()}finally{if(o)throw a}}return r}(t,e)||function(t,e){if(!t)return;if("string"===typeof t)return f(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return f(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function y(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function p(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function h(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=m(t);if(e){var o=m(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return b(this,r)}}function b(t,e){return!e||"object"!==u(e)&&"function"!==typeof e?v(t):e}function v(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function m(t){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function P(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var g=/list=([a-zA-Z0-9_-]+)/,O=/user\/([a-zA-Z0-9_-]+)\/?/,w=/youtube-nocookie\.com/,j=function(t){!function(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(l,t);var e,r,i,u=h(l);function l(){var t;y(this,l);for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];return P(v(t=u.call.apply(u,[this].concat(r))),"callPlayer",o.callPlayer),P(v(t),"parsePlaylist",(function(e){return e instanceof Array?{listType:"playlist",playlist:e.map(t.getID).join(",")}:g.test(e)?{listType:"playlist",list:s(e.match(g),2)[1]}:O.test(e)?{listType:"user_uploads",list:s(e.match(O),2)[1]}:{}})),P(v(t),"onStateChange",(function(e){var r=e.data,n=t.props,o=n.onPlay,a=n.onPause,i=n.onBuffer,u=n.onBufferEnd,l=n.onEnded,c=n.onReady,s=n.loop,f=n.config,y=f.playerVars,p=f.onUnstarted,d=window.YT.PlayerState,h=d.UNSTARTED,b=d.PLAYING,v=d.PAUSED,m=d.BUFFERING,P=d.ENDED,g=d.CUED;if(r===h&&p(),r===b&&(o(),u()),r===v&&a(),r===m&&i(),r===P){var O=!!t.callPlayer("getPlaylist");s&&!O&&(y.start?t.seekTo(y.start):t.play()),l()}r===g&&c()})),P(v(t),"mute",(function(){t.callPlayer("mute")})),P(v(t),"unmute",(function(){t.callPlayer("unMute")})),P(v(t),"ref",(function(e){t.container=e})),t}return e=l,(r=[{key:"componentDidMount",value:function(){this.props.onMount&&this.props.onMount(this)}},{key:"getID",value:function(t){return!t||t instanceof Array?null:t.match(a.MATCH_URL_YOUTUBE)[1]}},{key:"load",value:function(t,e){var r=this,n=this.props,a=n.playing,i=n.muted,u=n.playsinline,l=n.controls,s=n.loop,f=n.config,y=n.onError,p=f.playerVars,d=f.embedOptions,h=this.getID(t);if(e)return g.test(t)||O.test(t)||t instanceof Array?void this.player.loadPlaylist(this.parsePlaylist(t)):void this.player.cueVideoById({videoId:h,startSeconds:(0,o.parseStartTime)(t)||p.start,endSeconds:(0,o.parseEndTime)(t)||p.end});(0,o.getSDK)("https://www.youtube.com/iframe_api","YT","onYouTubeIframeAPIReady",(function(t){return t.loaded})).then((function(e){r.container&&(r.player=new e.Player(r.container,c({width:"100%",height:"100%",videoId:h,playerVars:c(c({autoplay:a?1:0,mute:i?1:0,controls:l?1:0,start:(0,o.parseStartTime)(t),end:(0,o.parseEndTime)(t),origin:window.location.origin,playsinline:u?1:0},r.parsePlaylist(t)),p),events:{onReady:function(){s&&r.player.setLoop(!0),r.props.onReady()},onStateChange:r.onStateChange,onError:function(t){return y(t.data)}},host:w.test(t)?"https://www.youtube-nocookie.com":void 0},d)))}),y)}},{key:"play",value:function(){this.callPlayer("playVideo")}},{key:"pause",value:function(){this.callPlayer("pauseVideo")}},{key:"stop",value:function(){document.body.contains(this.callPlayer("getIframe"))&&this.callPlayer("stopVideo")}},{key:"seekTo",value:function(t){this.callPlayer("seekTo",t),this.props.playing||this.pause()}},{key:"setVolume",value:function(t){this.callPlayer("setVolume",100*t)}},{key:"setPlaybackRate",value:function(t){this.callPlayer("setPlaybackRate",t)}},{key:"setLoop",value:function(t){this.callPlayer("setLoop",t)}},{key:"getDuration",value:function(){return this.callPlayer("getDuration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("getCurrentTime")}},{key:"getSecondsLoaded",value:function(){return this.callPlayer("getVideoLoadedFraction")*this.getDuration()}},{key:"render",value:function(){var t={width:"100%",height:"100%",display:this.props.display};return n.default.createElement("div",{style:t},n.default.createElement("div",{ref:this.ref}))}}])&&p(e.prototype,r),i&&p(e,i),l}(n.Component);e.default=j,P(j,"displayName","YouTube"),P(j,"canPlay",a.canPlay.youtube)}}]);