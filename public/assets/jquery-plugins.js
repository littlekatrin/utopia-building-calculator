/*
    Watermark v3.0.6 (June 21, 2010) plugin for jQuery
    http://jquery-watermark.googlecode.com/
    Copyright (c) 2009-2010 Todd Northrop
    http://www.speednet.biz/
    Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function(b){var l="function",j="password",d="maxLength",f="type",c=true,a="",e=false,t="watermark",u,m=t,i="watermarkClass",q="watermarkFocus",k="watermarkSubmit",o="watermarkMaxLength",h="watermarkPassword",g="watermarkText",s=":data("+m+")",n=":text,:password,:search,textarea",p=["Page_ClientValidate"],r=e;b.extend(b.expr[":"],{search:function(b){return "search"===(b.type||a)},data:function(g,i,h){var f,d=/^((?:[^=!^$*]|[!^$*](?!=))+)(?:([!^$*]?=)(.*))?$/.exec(h[3]);if(d){f=b(g).data(d[1]);if(f!==u){if(d[2]){f=a+f;switch(d[2]){case "=":return f==d[3];case "!=":return f!=d[3];case "^=":return f.slice(0,d[3].length)==d[3];case "$=":return f.slice(-d[3].length)==d[3];case "*=":return f.indexOf(d[3])!==-1}}return c}}return e}});b.watermark={version:"3.0.6",options:{className:t,useNative:c},hide:function(a){b(a).filter(s).each(function(){b.watermark._hide(b(this))})},_hide:function(b,n){var m=b.val()||a,k=b.data(g)||a,l=b.data(o)||0,j=b.data(i);if(k.length&&m==k){b.val(a);if(b.data(h))if((b.attr(f)||a)==="text"){var e=b.data(h)||[],c=b.parent()||[];if(e.length&&c.length){c[0].removeChild(b[0]);c[0].appendChild(e[0]);b=e}}if(l){b.attr(d,l);b.removeData(o)}if(n){b.attr("autocomplete","off");window.setTimeout(function(){b.select()},1)}}j&&b.removeClass(j)},show:function(a){b(a).filter(s).each(function(){b.watermark._show(b(this))})},_show:function(e){var t=e.val()||a,k=e.data(g)||a,p=e.attr(f)||a,s=e.data(i);if((t.length==0||t==k)&&!e.data(q)){r=c;if(e.data(h))if(p===j){var n=e.data(h)||[],m=e.parent()||[];if(n.length&&m.length){m[0].removeChild(e[0]);m[0].appendChild(n[0]);e=n;e.attr(d,k.length)}}if(p==="text"||p==="search"){var l=e.attr(d)||0;if(l>0&&k.length>l){e.data(o,l);e.attr(d,k.length)}}s&&e.addClass(s);e.val(k)}else b.watermark._hide(e)},hideAll:function(){if(r){b.watermark.hide(n);r=e}},showAll:function(){b.watermark.show(n)}};b.fn.watermark=function(r,o){var p="string";if(!this.length)return this;var s=e,t=typeof r===p;if(typeof o==="object"){s=typeof o.className===p;o=b.extend({},b.watermark.options,o)}else if(typeof o===p){s=c;o=b.extend({},b.watermark.options,{className:o})}else o=b.watermark.options;if(typeof o.useNative!==l)o.useNative=o.useNative?function(){return c}:function(){return e};return this.each(function(){var v="dragleave",u="dragenter",x=this,e=b(x);if(!e.is(n))return;if(e.data(m)){if(t||s){b.watermark._hide(e);t&&e.data(g,r);s&&e.data(i,o.className)}}else{if(o.useNative.call(x,e))if((a+e.css("-webkit-appearance")).replace("undefined",a)!==a&&(e.attr("tagName")||a)!=="TEXTAREA"){t&&e.attr("placeholder",r);return}e.data(g,t?r:a);e.data(i,o.className);e.data(m,1);if((e.attr(f)||a)===j){var y=e.wrap("<span>").parent(),l=b(y.html().replace(/type=["']?password["']?/i,'type="text"'));l.data(g,e.data(g));l.data(i,e.data(i));l.data(m,1);l.attr(d,r.length);l.focus(function(){b.watermark._hide(l,c)}).bind(u,function(){b.watermark._hide(l)}).bind("dragend",function(){window.setTimeout(function(){l.blur()},1)});e.blur(function(){b.watermark._show(e)}).bind(v,function(){b.watermark._show(e)});l.data(h,e);e.data(h,l)}else e.focus(function(){e.data(q,1);b.watermark._hide(e,c)}).blur(function(){e.data(q,0);b.watermark._show(e)}).bind(u,function(){b.watermark._hide(e)}).bind(v,function(){b.watermark._show(e)}).bind("dragend",function(){window.setTimeout(function(){b.watermark._show(e)},1)}).bind("drop",function(c){var b=c.originalEvent.dataTransfer.getData("Text");e.val().replace(b,a)===e.data(g)&&e.val(b);e.focus()});if(x.form){var p=x.form,w=b(p);if(!w.data(k)){w.submit(b.watermark.hideAll);if(p.submit){w.data(k,p.submit);p.submit=function(c,a){return function(){var d=a.data(k);b.watermark.hideAll();if(d.apply)d.apply(c,Array.prototype.slice.call(arguments));else d()}}(p,w)}else{w.data(k,1);p.submit=function(a){return function(){b.watermark.hideAll();delete a.submit;a.submit()}}(p)}}}}b.watermark._show(e)})};p.length&&b(function(){for(var a,c,d=p.length-1;d>=0;d--){a=p[d];c=window[a];if(typeof c===l)window[a]=function(a){return function(){b.watermark.hideAll();return a.apply(null,Array.prototype.slice.call(arguments))}}(c)}})})(jQuery);


/**
sprintf() for JavaScript 0.6

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Changelog:
2007.04.03 - 0.1:
 - initial release
2007.09.11 - 0.2:
 - feature: added argument swapping
2007.09.17 - 0.3:
 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)
2007.10.21 - 0.4:
 - unit test and patch (David Baird)
2010.05.09 - 0.5:
 - bug fix: 0 is now preceeded with a + sign
 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
 - switched from GPL to BSD license
2010.05.22 - 0.6:
 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
 Note:
 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
 who warned me about a bug in 0.5, I discovered that the last update was
 a regress. I appologize for that.
**/

function str_repeat(i, m) {
    for (var o = []; m > 0; o[--m] = i);
    return o.join('');
}

function sprintf() {
    var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
    while (f) {
        if (m = /^[^\x25]+/.exec(f)) {
            o.push(m[0]);
        }
        else if (m = /^\x25{2}/.exec(f)) {
            o.push('%');
        }
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
            if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                throw('Too few arguments.');
            }
            if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                throw('Expecting number but found ' + typeof(a));
            }
            switch (m[7]) {
                case 'b': a = a.toString(2); break;
                case 'c': a = String.fromCharCode(a); break;
                case 'd': a = parseInt(a); break;
                case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                case 'o': a = a.toString(8); break;
                case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                case 'u': a = Math.abs(a); break;
                case 'x': a = a.toString(16); break;
                case 'X': a = a.toString(16).toUpperCase(); break;
            }
            a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length - s.length;
            p = m[5] ? str_repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
        }
        else {
            throw('Huh ?!');
        }
        f = f.substring(m[0].length);
    }
    return o.join('');
}

/* http://delete.me.uk/2005/03/iso8601.html */
Date.prototype.setISO8601 = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    this.setTime(Number(time));
}