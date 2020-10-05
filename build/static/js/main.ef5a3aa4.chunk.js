(this.webpackJsonpgroupthink=this.webpackJsonpgroupthink||[]).push([[0],{192:function(e,t,n){},256:function(e,t,n){e.exports=n(504)},261:function(e,t,n){},262:function(e,t,n){},274:function(e,t,n){},278:function(e,t,n){},279:function(e,t,n){},280:function(e,t,n){},281:function(e,t,n){},298:function(e,t){},300:function(e,t){},310:function(e,t){},312:function(e,t){},339:function(e,t){},340:function(e,t){},345:function(e,t){},347:function(e,t){},371:function(e,t){},467:function(e,t,n){},470:function(e,t,n){},471:function(e,t,n){e.exports=n.p+"static/media/cursor.3f646017.svg"},472:function(e,t,n){},479:function(e,t,n){e.exports=n.p+"static/media/loader.05c141ad.svg"},480:function(e,t,n){},504:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(26),c=n.n(o),i=(n(261),n(29)),l=n(19);n(262);function u(e){var t=Object(l.h)();return console.log("splashpage says: I was consulted",t),e.pendingAuth?r.a.createElement("div",{id:"splash"},r.a.createElement("h1",{id:"splashText"},"Welcome to groupthink!"),r.a.createElement("blockquote",null,"Unleash your ideas")):r.a.createElement(l.a,{to:{pathname:e.isAuth?"/dashboard":"/login",state:{from:t}}})}var s=n(213),d=n.n(s);n(274);function m(e){var t,n=Object(l.h)(),a="/dashboard";return void 0!=(null===(t=n.state)||void 0===t?void 0:t.from)&&(a=n.state.from.pathname),e.authState.isSignedIn?r.a.createElement(l.a,{to:{pathname:a,state:{from:n}}}):r.a.createElement("div",{id:"login"},r.a.createElement("h1",{id:"title"},"Groupthink"),r.a.createElement("div",{className:"row align-items-center h-100"},r.a.createElement("div",{className:"col-6"},r.a.createElement("img",{src:"https://picsum.photos/200?random=48"})),r.a.createElement("div",{className:"col-6"},r.a.createElement("div",{className:"landing-subtitle"},r.a.createElement("b",null,"Unleash your ideas like never before")),r.a.createElement("div",{className:"landing-text"},r.a.createElement("em",null,"groupthink")," is a real-time collaborative platform that brings the power of the web into a new type of document. Gone are the days of static, unidimensional word docs and spreadsheets. ",r.a.createElement("em",null,"groupthink")," is a live document that seamlessly integrates video, text, images, links, Tweets, Spotify playlists, Charts, and much more in an easy-to-use interface."),r.a.createElement("p",{id:"sign"},"Please sign-in:"),r.a.createElement(d.a,{uiConfig:e.uiConfig,firebaseAuth:e.auth()}))))}var p=n(86),f=function(e){e.path;var t=e.children,n=e.isAuth,a=Object(p.a)(e,["path","children","isAuth"]);return r.a.createElement(l.b,Object.assign({},a,{render:function(e){var a=e.location;return n?t:r.a.createElement(l.a,{to:{pathname:"/",state:{from:a}}})}}))},h=n(14),v=n(10),g=n(12),b=n(8);n(131),n(275),n(276),n(277);b.initializeApp({apiKey:"AIzaSyAjOQlUVvfpaPFKw_dsjVF-ZO9xAFFwLJc",authDomain:"groupthink-fc4b2.firebaseapp.com",databaseURL:"https://groupthink-fc4b2.firebaseio.com",projectId:"groupthink-fc4b2",storageBucket:"groupthink-fc4b2.appspot.com",messagingSenderId:"268412476509",appId:"1:268412476509:web:6a00e11a591b5852d4c1b4",measurementId:"G-94X9F74RYY"});var E=b.auth,j=b.database(),O=b.database.ServerValue.TIMESTAMP,y=b.storage,w=(b.storage().ref(),b.functions()),x={tester:{center:{x:300,y:300},container:{height:"4000px",width:"4000px"},nodes:{root:{children:{dummy:1}}}}},I=r.a.memo((function(e){var t=e.handleClick,n=e.children,a=e.className,o=e.style;return r.a.createElement("button",{onClick:t,className:a,style:o},n)})),k=n(241);n(278);var C=r.a.memo((function(e){return r.a.createElement(k.a,{className:"inline-input",placeholder:"Type something here...",value:e.text,onChange:e.onChange,onBlur:e.onSave})}));n(279),n(280);var P=r.a.memo((function(e){return e.addNew?r.a.createElement("div",{className:"project-card text_card"},r.a.createElement(I,{className:"",handleClick:e.onAddNew},"Add New Card")):r.a.createElement("div",{className:"project-card img_card"},r.a.createElement("img",{onClick:function(){return e.onOpen(e.id)},src:e.card.thumbnailURL,alt:"project thumbnail"}),r.a.createElement(C,{className:"project-card-item",text:e.card.name,onChange:function(t){return e.onChange(e.id,t.target.value)},onSave:function(){return e.onSave(e.id)}}),r.a.createElement(I,{className:"project-card-item",handleClick:function(){return e.onDelete(e.id)}},"Delete"))}));n(281);function A(e){var t=Object(l.g)(),n=Object(a.useState)(null),o=Object(g.a)(n,2),c=o[0],i=o[1],u="users/"+e.currentUser().uid+"/projects/";Object(a.useEffect)((function(){var t=j.ref("users/"+e.currentUser().uid+"/projects/");return t.on("value",(function(e){console.log("triggered listener and updated project list state, snapshot value was",e.val()),i(e.val())})),function(){return t.off("value")}}),[e]);var s=function(t){console.log("about to delete project",t);var n={};n["users/"+e.currentUser().uid+"/projects/"+t+"/"]=null,n["documents/"+t+"/"]=null,w.httpsCallable("createNewProject")(n).then((function(e){return console.log(e)})).catch((function(e){return console.log(e)}));!function e(t){console.log("Path TO Delete",t);var n=y().ref(t);n.listAll().then((function(t){t.prefixes.length>0||t.items.length>0?(t.items.length>0&&t.items.forEach((function(e){var t,a;t=n.fullPath,a=e.name,y().ref(t).child(a).delete().then(console.log("File Deleted")).catch((function(e){return console.log("File Delete Error",e)}))})),t.prefixes.forEach((function(t){e(t.fullPath)}))):console.log("No Files Exist")})).catch((function(e){console.log("List All Error ",e)}))}("root/"+t+"/")},d=function(e){var t=c[e].name;console.log("about to rename project",e,", changing title to",t);var n={};n[u+e+"/name"]=t,n["documents/"+e+"/metadata/name"]=t,j.ref().update(n).then(console.log("successfully renamed project",e,"to",t))},m=function(e){console.log("attempting to open project",e),t.push("/project/"+e)},p=function(e,t){console.log("un-finalized text change in",e,". new text:",t),console.log(Object(v.a)(Object(v.a)({},c),{},Object(h.a)({},e,Object(v.a)(Object(v.a)({},c[e]),{},{name:t})))),i(Object(v.a)(Object(v.a)({},c),{},Object(h.a)({},e,Object(v.a)(Object(v.a)({},c[e]),{},{name:t}))))};return r.a.createElement("div",{id:"project-card-container"},r.a.createElement(P,{addNew:!0,onAddNew:function(){console.log("clicked add new");var t=j.ref().child(u).push().key,n={};n["creator/"+t]=e.currentUser().uid,n[u+t]={access:"rw",name:"New Project",thumbnailURL:"https://picsum.photos/200?random="+Math.floor(100*Math.random())},n["documents/"+t]=Object(v.a)({metadata:{name:"New Project",datecreated:O},users:Object(h.a)({},e.currentUser().uid,"rw")},x.tester),w.httpsCallable("createNewProject")(n).then((function(e){return console.log(e)})).catch((function(e){return console.log(e)}))}}),c?Object.entries(c).map((function(e){var t=Object(g.a)(e,2),n=t[0],a=t[1];return r.a.createElement(P,{key:n,id:n,card:a,onChange:p,onSave:d,onDelete:s,onOpen:m})})):null)}var S=n(27),N=n.n(S),z=n(44),D=n(533),U=n(215),T=n(521),F=n(522),L=n(523),_=n(524),R=n(525),M=n(526),q=n(527),V=n(528),G=n(529),W=n(530),Y=n(531),$=n(532),X=function(e){var t=e.url,n=e.title,a=e.size,o=Object(U.Passers)({url:t,className:"network__share-button"})({className:"network cursor-pointer hover transition--default",title:"Share ".concat(t)})("li");return r.a.createElement("div",{className:"social_link"},r.a.createElement(o,null,r.a.createElement(T.a,{quote:n},r.a.createElement(F.a,{size:a})),r.a.createElement(L.a,{title:n},r.a.createElement(_.a,{size:a})),r.a.createElement(R.a,{title:n,separator:":: "},r.a.createElement(M.a,{size:a})),r.a.createElement(q.a,{title:n,windowWidth:750,windowHeight:600},r.a.createElement(V.a,{size:a})),r.a.createElement(G.a,{url:String(window.location),windowWidth:1e3,windowHeight:730},r.a.createElement(W.a,{size:a})),r.a.createElement(Y.a,{subject:"Groupthink Web Link",body:"Here is the link ".concat(t)},r.a.createElement($.a,{size:a}))))},B=n(122),H=(n(192),function(){var e=Object(z.a)(N.a.mark((function e(t,n,a){var r;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r={})["documents/".concat(t,"/room/")+n+"/name/"]=a,r["documents/".concat(t,"/room/")+n]={X_POS:0,Y_POS:0},e.next=5,j.ref().update(r).then(console.log("Created ROOM")).catch((function(e){return e}));case 5:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}()),J=function(e){var t=Object(a.useState)(!1),n=Object(g.a)(t,2),o=n[0],c=n[1],i=Object(a.useState)(!1),l=Object(g.a)(i,2),u=l[0],s=l[1],d=Object(a.useState)(),m=Object(g.a)(d,2),p=m[0],f=m[1],h=Object(a.useState)(),v=Object(g.a)(h,2),b=v[0],E=v[1],O=Object(a.useState)(),y=Object(g.a)(O,2),w=y[0],x=y[1];var k=function(e){E(e.target.value)},C=function(e){f(e.target.value)},P=function(){c(!1),s(!1),x(null),f(null),E(null)};return r.a.createElement(r.a.Fragment,null,r.a.createElement(I,{className:e.buttonClassName,handleClick:function(){return c(!0)}},"Share"),r.a.createElement(D.a,{show:o,onHide:P},r.a.createElement(D.a.Header,{closeButton:!0},r.a.createElement(D.a.Title,null,"Share Your Project")),r.a.createElement(D.a.Body,null,"Type Of Link To be Shared",r.a.createElement("br",null),r.a.createElement("input",{type:"radio",name:"linkType",value:"public",onChange:function(e){return C(e)},required:!0}),r.a.createElement("label",{htmlFor:"male"},"Public"),r.a.createElement("input",{type:"radio",name:"linkType",value:"private",onChange:function(e){return C(e)},required:!0}),r.a.createElement("label",{htmlFor:"male"},"Private "),r.a.createElement("br",null),r.a.createElement("input",{type:"radio",name:"options",value:"r",onChange:function(e){return k(e)},required:!0}),r.a.createElement("label",{htmlFor:"male"},"Read Only"),r.a.createElement("input",{type:"radio",name:"options",value:"rw",onChange:function(e){return k(e)},required:!0}),r.a.createElement("label",{htmlFor:"male"},"Read and Write "),r.a.createElement("br",null),r.a.createElement(I,{className:"custom_btn",handleClick:function(){if(void 0!=p&&void 0!=b)if(s(!0),"private"===p){H(e.projectID,e.currentUser.uid,e.currentUser.displayName).then("Room Made").catch((function(e){return e}));var t=B.encrypt(b,"grpthink12!").toString(),n=(a="/",r="$",t.replace(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"),r));console.log(t,b,n),x(String(window.location)+"/"+n)}else!function(e,t,n,a){var r="documents/".concat(e,"/"),o={};o[r+"/users/public"]=t,o[r+"/room/"+n+"/name"]=a,o[r+"/room/"+n]={X_POS:0,Y_POS:0},j.ref().update(o).then(console.log("Created Public With Permission",t))}(e.projectID,b,e.currentUser.uid,e.currentUser.displayName),x(String(window.location));else s(!1);var a,r}},"Generate Link"),u?r.a.createElement("div",null,r.a.createElement("br",null),"Copy Your Link :",r.a.createElement("br",null),r.a.createElement("b",{style:{display:"inline-flex"}},w),r.a.createElement("br",null),r.a.createElement(X,{url:w,title:"Groupthink Website",size:"2.5rem"})):r.a.createElement("div",null)),r.a.createElement(D.a.Footer,null,r.a.createElement(I,{className:"custom_btn",handleClick:P},"Close"),r.a.createElement(I,{className:"custom_btn",handleClick:P},"Save Changes"))))};function K(e){var t=e.currentUser();return r.a.createElement("div",{className:"menu-bar topheader"},r.a.createElement("div",{className:"menu-bar-panel menu-bar-panel-left"},r.a.createElement("img",{alt:"",className:"menu-bar-user-profile-picture",src:t.photoURL}),r.a.createElement("div",{className:"menu-bar-user-name"},t.displayName)),r.a.createElement("div",{className:"menu-bar-panel menu-bar-panel-center"},r.a.createElement("div",{className:"menu-bar-site-title"},r.a.createElement(i.b,{to:"/dashboard"},"groupthink"))),r.a.createElement("div",{className:"menu-bar-panel menu-bar-panel-right"},r.a.createElement(I,{className:"menu-action-button",handleClick:e.onLogOut},"Log Out"),e.document&&"rw"===e.document?r.a.createElement(J,{projectID:e.projectID,buttonClassName:"menu-action-button",currentUser:t}):null))}function Q(e){var t=Object(l.h)();return r.a.createElement("div",null,r.a.createElement(K,{onLogOut:function(){return e.signOut(),r.a.createElement(l.a,{to:{pathname:"/dashboard",state:{from:t}}})},currentUser:e.currentUser}),r.a.createElement(A,{currentUser:e.currentUser}))}var Z=n(54),ee=n(211),te=n(65),ne=n.n(te),ae=r.a.memo((function(e){var t,n,a=function(e){return!!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(e)};return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"text-node"},r.a.createElement(C,{onChange:function(t){var n;a((n=t).target.value)?e.typeAPI.changeContent(e.id,{url:n.target.value}):e.typeAPI.changeContent(e.id,{text:n.target.value})},onSave:function(){var t;e.typeAPI.resize(e.id,{width:350,height:400}),e.typeAPI.saveContent(e.id,{url:null===(t=e.content)||void 0===t?void 0:t.url})},text:(null===(t=e.content)||void 0===t?void 0:t.url)||e.content.text,lwidth:"100px"})),a(null===(n=e.content)||void 0===n?void 0:n.url)?r.a.createElement("div",null,r.a.createElement(ne.a,{url:e.content.url,width:"",height:"250px",controls:!0})):null)})),re=(n(393),n(394),r.a.memo((function(e){return r.a.createElement("div",null,void 0===e.content.text?Object.entries(e.content).map((function(e,t){return r.a.createElement("div",{key:e[0]},"File Name : ",e[0].split(">")[0])})):null)}))),oe=n(220),ce=n(89),ie=n(47),le=r.a.memo((function(e){var t=Object(a.useState)(!1),n=Object(g.a)(t,2),o=n[0],c=n[1],i=Object(a.useState)(0),l=Object(g.a)(i,2),u=l[0],s=l[1],d=Object(a.useState)(!1),m=Object(g.a)(d,2),p=m[0],f=m[1],b=Object(a.useCallback)((function(e,t){t.photo;var n=t.index;s(n),f(!0)}),[]),E=function(){s(0),f(!1)};return r.a.createElement("div",null,"number"===typeof o?r.a.createElement(ie.a,{animated:!0,now:o,label:"".concat(Math.floor(o),"%")}):null,r.a.createElement("input",{type:"file",accept:"image/x-png,image/gif,image/jpeg,image/svg,".concat("image/*"),onChange:function(t){return function(t){var n=t.target.files[0];if(void 0!=n)var a={contentType:null===n||void 0===n?void 0:n.type};var r=e.id+"/"+n.name.split(".")[0]+">"+n.lastModified+"/";console.log("path sent from audio:",r),e.typeAPI.requestUpload(r,n,a,(function(t){console.log(t),"complete"===t?(c("uploaded"),e.typeAPI.requestDownload(r,(function(t,n){var a;return e.typeAPI.saveContent(e.id,(a={},Object(h.a)(a,n.name,{url:t,metadata:n}),Object(h.a)(a,"/text",null),a))}))):c(t)}))}(t)}}),void 0===e.content.text?Object.entries(e.content).map((function(e,t){var n,a;return r.a.createElement("div",{key:e[0]},"File Name : ",e[0].split(">")[0],r.a.createElement(oe.a,{photos:[{src:"".concat(null===(n=e[1])||void 0===n?void 0:n.url),width:6,height:7}],onClick:b}),r.a.createElement(ce.b,null,p?r.a.createElement(ce.a,{onClose:E},r.a.createElement(ce.c,{currentIndex:u,views:[{src:"".concat(null===(a=e[1])||void 0===a?void 0:a.url),width:6,height:7}].map((function(e){return Object(v.a)(Object(v.a)({},e),{},{srcset:e.srcSet,caption:e.title})}))})):null))})):null)})),ue=r.a.memo((function(e){var t=Object(a.useState)(!1),n=Object(g.a)(t,2),o=n[0],c=n[1];return r.a.createElement("div",null,"number"===typeof o?r.a.createElement(ie.a,{animated:!0,now:o,label:"".concat(Math.floor(o),"%")}):null,r.a.createElement("input",{type:"file",accept:".odt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",onChange:function(t){return function(t){var n=t.target.files[0];if(void 0!=n)var a={contentType:null===n||void 0===n?void 0:n.type};var r=e.id+"/"+n.name.split(".")[0]+">"+n.lastModified+"/";console.log("path sent from audio:",r),e.typeAPI.requestUpload(r,n,a,(function(t){console.log(t),"complete"===t?(c("uploaded"),e.typeAPI.requestDownload(r,(function(t,n){var a;return e.typeAPI.saveContent(e.id,(a={},Object(h.a)(a,n.name,{url:t,metadata:n}),Object(h.a)(a,"/text",null),a))}))):c(t)}))}(t)}}),void 0===e.content.text?Object.entries(e.content).map((function(e,t){var n;return r.a.createElement("div",{key:e[0]},"File Name :",r.a.createElement("a",{href:null===(n=e[1])||void 0===n?void 0:n.url,target:"_blank"},e[0].split(">")[0]))})):null)})),se=r.a.memo((function(e){var t=Object(a.useState)(!1),n=Object(g.a)(t,2),o=n[0],c=n[1],i=Object(a.useRef)(null);Object(a.useEffect)((function(){var t,n,a,r,o;void 0!=(null===(t=i.current)||void 0===t?void 0:t.props)&&(r=parseInt(null===(n=i.current)||void 0===n?void 0:n.props.width),o=parseInt(null===(a=i.current)||void 0===a?void 0:a.props.height),e.typeAPI.resize(e.id,{width:r,height:o}))}),[i.current]);return r.a.createElement("div",null,"number"===typeof o?r.a.createElement(ie.a,{animated:!0,now:o,label:"".concat(Math.floor(o),"%")}):null,r.a.createElement("input",{type:"file",accept:"video/* ",onChange:function(t){return function(t){var n=t.target.files[0];if(void 0!=n)var a={contentType:null===n||void 0===n?void 0:n.type};var r=e.id+"/"+n.name.split(".")[0]+">"+n.lastModified+"/";console.log("path sent from audio:",r),e.typeAPI.requestUpload(r,n,a,(function(t){console.log(t),"complete"===t?(c("uploaded"),e.typeAPI.requestDownload(r,(function(t,n){var a;return e.typeAPI.saveContent(e.id,(a={},Object(h.a)(a,n.name,{url:t,metadata:n}),Object(h.a)(a,"/text",null),a))}))):c(t)}))}(t)}}),void 0===e.content.text?Object.entries(e.content).map((function(e,t){var n;return r.a.createElement("div",{key:e[0]},"File Name : ",e[0].split(">")[0],r.a.createElement(ne.a,{controls:!0,url:null===(n=e[1])||void 0===n?void 0:n.url,ref:i}))})):null)})),de=n(240),me=(n(466),r.a.memo((function(e){var t=Object(a.useState)(!1),n=Object(g.a)(t,2),o=n[0],c=n[1];return r.a.createElement("div",null,"number"===typeof o?r.a.createElement(ie.a,{animated:!0,now:o,label:"".concat(Math.floor(o),"%")}):null,r.a.createElement("input",{type:"file",accept:"audio/* ",onChange:function(t){return function(t){var n=t.target.files[0];if(void 0!=n)var a={contentType:null===n||void 0===n?void 0:n.type};var r=e.id+"/"+n.name.split(".")[0]+">"+n.lastModified+"/";console.log("path sent from audio:",r),e.typeAPI.requestUpload(r,n,a,(function(t){console.log(t),"complete"===t?(c("uploaded"),e.typeAPI.requestDownload(r,(function(t,n){var a;return e.typeAPI.saveContent(e.id,(a={},Object(h.a)(a,n.name,{url:t,metadata:n}),Object(h.a)(a,"/text",null),a))}))):c(t)}))}(t)}}),void 0===e.content.text?Object.entries(e.content).map((function(e,t){var n;return r.a.createElement("div",{key:e[0]},"File Name : ",e[0].split(">")[0],r.a.createElement(de.a,{src:null===(n=e[1])||void 0===n?void 0:n.url,showDownloadProgress:"false",preload:"metadata"}))})):null)}))),pe=n(235),fe=r.a.memo((function(e){var t,n,a=function(e){return!!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(e)};return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"text-node"},r.a.createElement(C,{onChange:function(t){var n;a((n=t).target.value)?e.typeAPI.changeContent(e.id,{url:n.target.value}):e.typeAPI.changeContent(e.id,{text:n.target.value})},onSave:function(){return a(e.content.url)?e.typeAPI.saveContent(e.id,{url:e.content.url}):null},text:(null===(t=e.content)||void 0===t?void 0:t.url)||e.content.text,lwidth:"100px"})),a(null===(n=e.content)||void 0===n?void 0:n.url)?r.a.createElement("div",null,r.a.createElement(pe.ReactTinyLink,{cardSize:"small",showGraphic:!0,maxLine:2,minLine:1,url:e.content.url})):null)}));var he=r.a.memo((function(e){return r.a.createElement("div",{className:"text-node"},r.a.createElement(C,{onChange:function(t){return n=t,e.typeAPI.changeContent(e.id,{text:n.target.value});var n},onSave:function(){return e.typeAPI.saveContent(e.id,{text:e.content.text})},text:e.content.text,lwidth:"100px"}))})),ve=(n(467),n(236));n(469);var ge=r.a.memo((function(e){var t=Object(a.useState)([]),n=Object(g.a)(t,2),o=n[0],c=n[1],i={text:{height:300,width:350},file:{height:300,width:350},image:{height:300,width:350},VideoFile:{height:300,width:350},VideoLink:{height:300,width:350},pdf:{height:300,width:350},audio:{height:300,width:350},link:{height:300,width:350}},l={process:function(t,n,a,r,o,c,l){var u,s={contentType:null===n||void 0===n?void 0:n.type},d=e.id+"/"+n.name.split(".")[0]+">"+n.lastModified+"/",m=function(e){var t=["image","video","audio","pdf"],n="file",a=e.split("/");console.log(a,a.length);for(var r=a.length-1;r>=0;r--)-1!==t.indexOf(a[r])&&(n=a[r]);return console.log(e,n),"video"===n?"VideoFile":n}(null===n||void 0===n?void 0:n.type);return e.typeAPI.requestUpload(d,n,Object(v.a)(Object(v.a)({},a),s),(function(t,n){u=n,"number"===typeof t?c(!0,t,100):(r(e.id),e.typeAPI.requestDownload(d,(function(t,n){var a;e.typeAPI.changeType(e.id,m,i[m]),e.typeAPI.saveContent(e.id,(a={},Object(h.a)(a,n.name,{url:t,metadata:n}),Object(h.a)(a,"/text",null),a))})))})),{abort:function(){console.log("attempted to cancel upload, success:",u.cancel()),l()}}}};return r.a.createElement("div",null,r.a.createElement(I,{handleClick:function(){return e.typeAPI.changeType(e.id,"text",i.text)}},"Text"),r.a.createElement(C,{onChange:function(t){return function(t){e.typeAPI.changeContent(e.id,{text:t.target.value})}(t)},onSave:function(){var t=function(e){var t;if(t=e,new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(t)){var n="link";return ne.a.canPlay(e)&&(n="VideoLink"),console.log("Detector Extention Type After Loop",n),n}return"NoLink"}(e.content.text);"NoLink"===t?e.typeAPI.saveContent(e.id,{text:e.content.text}):(e.typeAPI.changeType(e.id,t,i[t]),e.typeAPI.saveContent(e.id,{url:e.content.text}))}}),r.a.createElement(ve.FilePond,{files:o,allowMultiple:!1,maxFiles:1,onupdatefiles:function(e){return c(e.map((function(e){return e.file})))},server:l}))}));n(470);Z.a.registerPlugin(ee.a);var be=r.a.memo((function(e){var t,n=function(e){switch(e){case"blank":return ge;case"text":return he;case"VideoLink":return ae;case"video":case"VideoFile":return se;case"image":return le;case"audio":return me;case"link":return fe;case"pdf":return re;case"file":return ue;default:return ge}}(null===(t=e.card)||void 0===t?void 0:t.type,e.card.content);return Object(a.useEffect)((function(){Z.a.to("#".concat(e.id),Object(v.a)(Object(v.a)({},e.card.size),{},{duration:.3}))}),[e.card.size.height,e.card.size.width]),Object(a.useEffect)((function(){Z.a.set("#".concat(e.id),Object(v.a)({opacity:1},e.card.position))}),[e.id,e.card.position]),Object(a.useEffect)((function(){var t=ee.a.create("#".concat(e.id),{autoScroll:1,trigger:"#handle".concat(e.id),onDrag:function(){console.log("now that was a drag"),this.update()},onDragEnd:function(){e.genericAPI.savePosition(e.id,{x:this.x,y:this.y})}});return function(){return t[0].kill()}}),[]),r.a.createElement("div",{id:e.id,className:"generic-card",style:{position:"absolute",opacity:0}},r.a.createElement("div",{id:"handle".concat(e.id),className:"card-handle card-title-bar"},r.a.createElement("button",{className:"card-control-button add",onClick:function(){return e.genericAPI.addChild({x:e.card.position.x+100,y:e.card.position.y+100},{width:e.card.size.width,height:e.card.size.height},e.id,"blank")}},"+"),r.a.createElement("button",{className:"card-control-button lock"},"L"),r.a.createElement("button",{className:"card-control-button delete",onClick:function(){return e.genericAPI.removeCard(e.id,"recursive",e.card.parent)}},"X")),r.a.createElement(n,{typeAPI:e.typeAPI,content:e.card.content,id:e.id}))})),Ee=n(237);function je(e){return Object(a.useEffect)((function(){Ee.a.to("#cursor".concat(e.id),{left:e.x,top:e.y-60,duration:.2}).play()}),[e.x,e.y,e.id]),r.a.createElement("div",{id:"cursor".concat(e.id),style:{position:"absolute",height:45,display:"flex",flexFlow:"column nowrap",justifyContent:"space-between",alignItems:"flex-start",overflow:"visible"}},r.a.createElement("img",{alt:"cursor",src:n(471),style:{userSelect:"none",maxWidth:"25px",maxHeight:"25px"}}),r.a.createElement("div",{style:{marginLeft:10,paddingLeft:5,paddingRight:5,paddingBottom:2,paddingTop:2,backgroundColor:"darkorange",color:"white",fontSize:13,fontFamily:"sans-serif"}},e.name))}Z.a.registerPlugin(ee.a);var Oe=r.a.memo((function(e){var t,n=Object(a.useState)(!1),o=Object(g.a)(n,2),c=o[0],i=o[1];function l(e,t,n,a){var r=.3*Math.abs(n-e),o=e-r,c=n+r;return"M".concat(e," ").concat(t," C ").concat(o," ").concat(t," ").concat(c," ").concat(a," ").concat(n," ").concat(a)}return Object(a.useEffect)((function(){var t=ee.a.create("#nub".concat(e.id),{type:"top,left",activeCursor:"grab",onDragStart:function(){Z.a.set("#nub".concat(e.id),{left:e.tail.x-100,top:e.tail.y-5}),console.log(t),console.log("start coords",this.x,this.y)},onDrag:function(){i({x:this.x,y:this.y})},onDragEnd:function(){e.hits.forEach((function(e){t[0].hitTest("#".concat(e))&&console.log("i hit",e)})),i(!1),console.log("end coords",this.x,this.y)}});return function(){return t[0].kill()}}),[e.hits]),t=c?l(c.x,c.y,e.tail.x+0,e.tail.y):l(e.head.x+0,e.head.y+0,e.tail.x+0,e.tail.y-5),r.a.createElement("div",null,r.a.createElement("svg",{style:{position:"absolute",height:0,width:0,overflow:"visible"}},r.a.createElement("path",{strokeWidth:"3",fill:"none",stroke:"red",d:t}),r.a.createElement("circle",{id:"nub",cx:e.tail.x+0,cy:e.tail.y-5,r:"5",fill:"yellow"})),r.a.createElement("svg",{style:{position:"absolute",height:0,width:0,overflow:"visible"}},r.a.createElement("circle",{style:{position:"absolute"},id:"nub".concat(e.id),cx:c?c.x:e.tail.x+0,cy:c?c.y:e.tail.y-5,r:"5",fill:"blue"})))}));n(472);function ye(e){var t=Date.now();return r.a.createElement("div",{className:"card-container",style:{overflow:"scroll",position:"absolute",zIndex:1,width:"100vw"}},r.a.createElement("div",{className:"container-filler",style:Object(v.a)(Object(v.a)({},e.container),{},{position:"absolute",zIndex:9999999}),onDoubleClick:function(t){if("card-container"===t.target.offsetParent.className){var n=Math.floor(t.clientX+t.target.offsetParent.scrollLeft),a=Math.floor(t.clientY-60+t.target.offsetParent.scrollTop);console.log("double click at",n,",",a),e.genericAPI.addChild({x:n,y:a},{width:310,height:360})}else console.log("registered a double click on a card and did absolutely nothing about it")},onMouseMove:function(t){console.log("triggered mouse move"),t.persist(),e.containerAPI.sendToDatabase(t)}},e.cards?Object.entries(e.cards).filter((function(e){var t=Object(g.a)(e,2),n=t[0];t[1];return n&&"root"!==n})).map((function(t){var n=Object(g.a)(t,2),a=n[0],o=n[1];return r.a.createElement("div",{key:"wrapperdiv".concat(a)},r.a.createElement(be,{key:a,id:a,card:o,genericAPI:e.genericAPI,typeAPI:e.typeAPI}),o.parent&&"root"!==o.parent&&r.a.createElement(Oe,{key:"arrow".concat(a),id:"arrow".concat(a),hits:Object.keys(e.cards),head:e.cards[o.parent].position,tail:o.position}))})):r.a.createElement("p",null,"Double Click to Add a Card"),e.room?Object.entries(e.room).filter((function(n){var a=Object(g.a)(n,2),r=a[0],o=a[1];return r!==e.currentUser().uid&&t-Number(o.time)<6e4})).map((function(t){var n=Object(g.a)(t,2),a=n[0],o=n[1];return r.a.createElement(je,{key:a,id:a,name:o.name,x:o.x,y:o.y,projectID:e.projectID,room:e.room})})):null))}var we=n(238),xe=n.n(we),Ie=function(e,t){var n={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},a={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},r={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},o={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},c={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},i={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},l={type:e,size:t,content:{text:"This is a ".concat(e," Card")}},u={type:e,size:t,content:{text:""}},s={type:e,size:t,content:{text:"This is a ".concat(e," Card")}};switch(e){case"text":return u;case"VideoLink":return a;case"VideoFile":return l;case"image":return i;case"audio":return n;case"link":return c;case"pdf":return r;case"file":return o;default:return s}};function ke(e){var t=Object(a.useState)(!1),n=Object(g.a)(t,2),o=n[0],c=n[1],i=Object(a.useState)({width:600,height:800}),l=Object(g.a)(i,2),u=l[0],s=l[1],d=Object(a.useRef)({});d.current=u;var m=Object(a.useState)(),p=Object(g.a)(m,2),f=p[0],b=p[1],E=Object(a.useState)({}),w=Object(g.a)(E,2),x=w[0],I=w[1],k=j.ref("documents/"+e.projectID+"/nodes");Object(a.useEffect)((function(){var t=j.ref("documents/"+e.projectID);return t.child("nodes").on("value",(function(e){console.log("triggered node listener, received payload",e.val()),I(e.val())})),t.child("center").on("value",(function(e){console.log("triggered center location listener, received payload",e.val())})),t.child("container").on("value",(function(e){console.log("triggered container size listener, received payload",e.val()),s(e.val())})),t.child("room").on("value",(function(e){console.log("Room Details Triggered recieved payload",e.val()),e.val()&&b(e.val())})),c(!0),function(){t.child("nodes").off(),t.child("center").off(),t.child("container").off()}}),[]);var C=function(e,t){I(Object(v.a)(Object(v.a)({},x),{},Object(h.a)({},e,Object(v.a)(Object(v.a)({},x[e]),{},{size:t})))),k.child(e).child("size").set(t).then(console.log("set new size for",e,"to",t))},P=function(e,t){console.log("triggered local content change on",e),I(Object(v.a)(Object(v.a)({},x),{},Object(h.a)({},e,Object(v.a)(Object(v.a)({},x[e]),{},{content:t}))))},A=Object(a.useCallback)(xe()((function(t){f&&j.ref("documents/"+e.projectID+"/room/").child(e.currentUser().uid).set({x:t.clientX,y:t.clientY,time:O,name:e.currentUser().displayName})}),100),[f]),S={savePosition:function(t,n){var a={},r={width:d.current.width,height:d.current.height},o=j.ref("documents/"+e.projectID);n.x>d.current.width&&(console.log("x",n.x,"was greater than width",d.current),r.width=n.x+300),n.y>d.current.height&&(console.log("y",n.y,"was greater than height",u.current),r.height=n.y+300),a["nodes/"+t+"/position/"]=n,r&&(a["container/"]=r),console.log("newcontainer: ",r,"old container: ",d.current),o.update(a).then(console.log("set new position for",t,"to",n,"\nresized container to",r))},changePosition:function(e,t){I(Object(v.a)(Object(v.a)({},x),{},Object(h.a)({},e,Object(v.a)(Object(v.a)({},x[e]),{},{position:t}))))},reparentCard:function(e,t){var n={},a=x[e].parent;n[e+"/parent"]=t,n[a+"/children/"+e]=null,n[t+"/children/"+e]=1,k.update(n).then(console.log("successfully changed the parent of",e,"from",a,"to",t)).catch(console.log("error reparenting"))},removeCard:function(t,n,a){var r={};r[t]=null,r[x[t].parent+"/children/"+t]=null;switch(n){case"recursive":x[t].children&&function(e){for(;e.length>0;){var t=e.pop();r[t]=null,x[t].children&&e.concat(Object.keys(x[t].children))}}(Object.keys(x[t].children));break;case"reparent":Object.keys(x[t].children).forEach((function(e){return r[e+"/parent"]=a}))}var o=["link","blank","VideoLink","text"];if(console.log("Type Of Card ",x[t].type,"\n Exists Storage Types ",!o.includes(x[t].type,0)),o.includes(x[t].type,0))console.log("Its a NOn Storage Card");else{var c="root/"+e.projectID+"/"+t+"/";!function(e){var t=y().ref(e);t.listAll().then((function(e){e.items.length>0?e.items.forEach((function(e){var n,a;n=t.fullPath,a=e.name,y().ref(n).child(a).delete().then(console.log("File Deleted")).catch((function(e){return console.log("Error in Delete File",e)}))})):console.log("No Files Exist")})).catch((function(e){console.log("Error in List All",e)}))}(c)}k.update(r).then(console.log("deleted",t,"successfully"))},addChild:function(e,t,n,a){var r,o=n||"root",c=a||"blank",i={type:c,size:t,position:e,content:{text:"This is a ".concat(c," Card")},parent:o},l=k.push().key,u={};u[o+"/children/"+l]=1,u[l]=i,k.update(u).then(console.log("Added a new child",l,"under",o)),I(Object(v.a)(Object(v.a)({},x),{},(r={},Object(h.a)(r,l,i),Object(h.a)(r,o,Object(v.a)(Object(v.a)({},x[o]),{},{children:Object(v.a)(Object(v.a)({},x[o].children),{},Object(h.a)({},l,1))})),r)))},resize:C},N={saveContent:function(e,t){P(e,t),k.child(e).child("content").update(t).then(console.log("saved new content for",e)).catch((function(e){return console.log("Save COntent Error \n",t,"\n saveContent",e)}))},changeContent:P,requestUpload:function(t,n,a,r){var o=Object(v.a)(Object(v.a)({},a),{},{customMetadata:Object(h.a)({},e.currentUser().uid,e.permission)});console.log("metadata sent was",o);var c="root/"+e.projectID+"/"+t,i=y().ref(c).put(n,o),l=i.on(y.TaskEvent.STATE_CHANGED,(function(e){return r(e.bytesTransferred/e.totalBytes*100,i)}),null,(function(){console.log(),r("complete"),l()}))},requestDownload:function(t,n){var a="root/"+e.projectID+"/"+t,r=y().ref(a);r.getDownloadURL().then((function(e){r.getMetadata().then((function(t){return n(e,JSON.parse(JSON.stringify(t)))})).catch((function(e){return console.log("failed to fetch metadata for",a,"because",e)}))})).catch((function(e){return console.log("failed to fetch download URL for",a,"because",e)}))},changeType:function(e,t,n){var a=Ie(t,n);I(Object(v.a)(Object(v.a)({},x),{},Object(h.a)({},e,Object(v.a)(Object(v.a)({},x[e]),{},{type:a.type,size:a.size,content:a.content}))));var r={};r[e+"/type"]=a.type,r[e+"/size"]=a.size,r[e+"/content"]=a.content,k.update(r).then(console.log("Set new type for",e,"to \n",a)).catch((function(e){return e}))},resize:C},z={sendToDatabase:A};return o?r.a.createElement(ye,{container:u,cards:x,genericAPI:S,typeAPI:N,permission:e.permission,currentUser:e.currentUser,containerAPI:z,room:f,projectID:e.projectID}):r.a.createElement("div",null,"Loading...")}var Ce=n(239),Pe=function(){var e=Object(z.a)(N.a.mark((function e(t,n,a,r){var o,c,i;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if((o={})[t+r]=a,o["documents/".concat(n,"/room/")+r]={X_POS:0,Y_POS:0},"r"!==a&&"rw"!==a){e.next=10;break}return c=w.httpsCallable("createNewProject"),i=c(o).then((function(e){return!0})).catch((function(e){return console.log(e)})),console.log("user Created",i),e.abrupt("return",i);case 10:return e.abrupt("return",!1);case 11:case"end":return e.stop()}}),e)})));return function(t,n,a,r){return e.apply(this,arguments)}}(),Ae=function(){var e=Object(z.a)(N.a.mark((function e(t,n){var a,r;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(a={})["documents/".concat(t,"/room/")+n]={X_POS:0,Y_POS:0},e.next=4,j.ref().update(a).then(console.log("Created ROOM")).catch((function(e){return e}));case 4:return r=e.sent,e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Se=function(){var e=Object(z.a)(N.a.mark((function e(t,n){var a,r,o,c,i,l;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=null===(a=Object(Ce.auth)().currentUser)||void 0===a?void 0:a.uid,e.next=3,j.ref("documents/".concat(t,"/")).once("value").then((function(e){return e.exists()})).catch((function(e){return e}));case 3:return o=e.sent,c="documents/".concat(t,"/users/"),e.next=7,j.ref(c).once("value").then((function(e){if(!o)return null;if(e.hasChild(r))return e.child(r).val();if(e.hasChild("public")){var n=Ae(t,r).then((function(e){return e})).catch((function(e){return e}));return console.log(n),e.child("public").val()}return null})).catch((function(e){return e}));case 7:if(i=e.sent,void 0==n){e.next=16;break}return console.log(n),e.next=12,Pe(c,t,n,r);case 12:return l=e.sent,e.abrupt("return",l);case 16:return e.abrupt("return",i);case 17:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();var Ne=function(){return r.a.createElement("div",null,r.a.createElement("img",{src:n(479),className:"loader",alt:""}))},ze=(n(480),Ne);function De(e){var t=Object(l.h)(),n=Object(l.g)(),o=Object(l.i)().projectID,c=Object(a.useState)(!1),i=Object(g.a)(c,2),u=i[0],s=i[1],d=Object(a.useState)(null),m=Object(g.a)(d,2),p=m[0],f=m[1];Object(a.useEffect)((function(){Object(z.a)(N.a.mark((function e(){var t;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Se(o);case 2:t=e.sent,console.log("Permission",t),setTimeout((function(){return s(!0)}),3e3),null==t?n.push("/dashboard"):f(t);case 6:case"end":return e.stop()}}),e)})))()}),[]);return u?r.a.createElement("div",null,r.a.createElement(K,{style:{position:"absolute",zIndex:0},onLogOut:function(){return e.signOut(),r.a.createElement(l.a,{to:{pathname:"/login",state:{from:t}}})},currentUser:e.currentUser,document:p,projectID:o}),null!=p?r.a.createElement(ke,{projectID:o,currentUser:e.currentUser,permission:p}):r.a.createElement("div",null)):r.a.createElement(ze,null)}var Ue={UI_CONFIG:{signInFlow:"popup",signInOptions:[E.GoogleAuthProvider.PROVIDER_ID,E.FacebookAuthProvider.PROVIDER_ID,E.EmailAuthProvider.PROVIDER_ID,E.PhoneAuthProvider.PROVIDER_ID],callbacks:{signInSuccessWithAuthResult:function(){return!1}}}};var Te=n(127);function Fe(e){var t=Object(l.h)(),n=Object(l.g)(),a=Object(l.i)(),o=a.projectID,c=a.permissionID;return r.a.useEffect((function(){Object(z.a)(N.a.mark((function e(){var a,r;return N.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return void 0!=c&&(i="$",l="/",r=c.replace(new RegExp(i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"),l),a=Te.AES.decrypt(r,"grpthink12!").toString(Te.enc.Utf8),console.log("Permission ID DEcrypt",a,c,r)),e.next=3,Se(o,a);case 3:e.sent?n.push("/project/".concat(o)):n.push("/error",{from:t});case 5:case"end":return e.stop()}var i,l}),e)})))()}),[]),r.a.createElement("div",null,r.a.createElement(ze,null))}function Le(){var e=Object(l.h)();return r.a.createElement("div",null,"Invalid Link Enter :-",r.a.createElement("br",null),e.state.from.pathname)}var _e=function(e){var t=e.path,n=e.children,a=e.isAuth,o=Object(p.a)(e,["path","children","isAuth"]);return console.log(t),r.a.createElement(l.b,Object.assign({},o,{render:function(e){var t=e.location;return a?n:r.a.createElement(l.a,{to:{pathname:"/login",state:{from:t}}})}}))};function Re(){var e=function(){var e=E,t=Ue.UI_CONFIG,n=Object(a.useState)({isSignedIn:!1,pendingAuth:!0,user:null}),r=Object(g.a)(n,2),o=r[0],c=r[1];return Object(a.useEffect)((function(){var e=E().onAuthStateChanged((function(e){c({user:e,pendingAuth:!1,isSignedIn:!!e})}));return function(){return e()}}),[]),{auth:e,uiConfig:t,authState:o}}(),t=e.auth,n=e.uiConfig,o=e.authState;return!o.pendingAuth&&r.a.createElement(i.a,null,r.a.createElement(l.d,null,r.a.createElement(_e,{isAuth:o.isSignedIn,path:"/project/:projectID/:permissionID"},r.a.createElement(Fe,null)),r.a.createElement(f,{isAuth:o.isSignedIn,path:"/project/:projectID"},r.a.createElement(De,{currentUser:function(){return t().currentUser},signOut:function(){return t().signOut()}})),r.a.createElement(l.b,{path:"/login"},r.a.createElement(m,{auth:t,uiConfig:n,authState:o})),r.a.createElement(f,{isAuth:o.isSignedIn,path:"/dashboard"},r.a.createElement(Q,{currentUser:function(){return t().currentUser},signOut:function(){return t().signOut()}})),r.a.createElement(l.b,{path:"/error"},r.a.createElement(Le,null)),r.a.createElement(l.b,{path:"/"},r.a.createElement(u,{pendingAuth:o.pendingAuth,isAuth:o.isSignedIn}))))}var Me=r.a.createContext(),qe=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(Me.Provider,{value:{appname:"groupthink"}},r.a.createElement(Re,null)))};n(503);c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(qe,null)),document.getElementById("root"))}},[[256,13,14]]]);