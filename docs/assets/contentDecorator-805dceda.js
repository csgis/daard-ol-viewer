const o=t=>typeof t=="number"?`${t} €`:t,s=t=>/^(http|https):\/\/[^ "]+$/.test(t)?`<a href="${t}" x-tooltip.placement.top="'Link opens in new window'" target="_blank" class="link-secondary">${t}</a>`:t,i=t=>{try{return typeof t=="string"&&decodeURIComponent(t)!==t?decodeURIComponent(t):t}catch{return t}},c=t=>/\.(jpeg|jpg|gif|png)$/.test(t)?`<img src="${t}" alt="Image" style="max-height: 100px; max-width: 100px;" />`:t,p=t=>typeof t=="string"&&t.toLowerCase()==="months"?(alert("found it"),"months"):t,a=t=>typeof t=="string"&&t.toLowerCase()==="true"?"true":typeof t=="string"&&t.toLowerCase()==="false"?"false":t,f=t=>typeof t=="string"&&t.toLowerCase()==="unknown"?"unknown":t,g=t=>{const r=/<li>.*?<\/li>/gs,n=t.match(r);return n&&n.length===1?t.replace(/<\/?ul>/g,"").replace(/<\/?li>/g,""):t},m=t=>t.replaceAll("●","<br>"),h={appendEuroToNumber:o,createLinkForUrl:s,formatImageTag:c,decodeUrl:i,replaceBullet:m,harmonizeUnknown:f,harmonizeTrueFalse:a,harmonizeMonth:p,removeListIfOnlyOneLi:g},d=(t,r=[])=>(Object.entries(h).forEach(([n,e])=>{r.includes(n)&&(t=e(t))}),t);export{d};
//# sourceMappingURL=contentDecorator-805dceda.js.map