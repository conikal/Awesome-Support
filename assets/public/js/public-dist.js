!function(a){"use strict";function b(a,c){if(!(this instanceof b)){var d=new b(a,c);return d.open(),d}this.id=b.id++,this.setup(a,c),this.chainCallbacks(b._callbackChain)}if("undefined"==typeof a)return void("console"in window&&window.console.info("Too much lightness, Featherlight needs jQuery."));var c=function(a){if(!a.isDefaultPrevented()){var c=b.current();c&&c.onKeyDown(a)}};b.prototype={constructor:b,namespace:"featherlight",targetAttr:"data-featherlight",variant:null,resetCss:!1,background:null,openTrigger:"click",closeTrigger:"click",filter:null,root:"body",openSpeed:250,closeSpeed:250,closeOnClick:"background",closeOnEsc:!0,closeIcon:"&#10005;",otherClose:null,beforeOpen:a.noop,beforeContent:a.noop,beforeClose:a.noop,afterOpen:a.noop,afterContent:a.noop,afterClose:a.noop,onKeyDown:a.noop,type:null,contentFilters:["jquery","image","html","ajax","text"],setup:function(b,c){"object"!=typeof b||b instanceof a!=0||c||(c=b,b=void 0);var d=a.extend(this,c,{target:b}),e=d.resetCss?d.namespace+"-reset":d.namespace,f=a(d.background||['<div class="'+e+'">','<div class="'+e+'-content">','<span class="'+e+"-close-icon "+d.namespace+'-close">',d.closeIcon,"</span>",'<div class="'+d.namespace+'-inner"></div>',"</div>","</div>"].join("")),g="."+d.namespace+"-close"+(d.otherClose?","+d.otherClose:"");return d.$instance=f.clone().addClass(d.variant),d.$instance.on(d.closeTrigger+"."+d.namespace,function(b){var c=a(b.target);("background"===d.closeOnClick&&c.is("."+d.namespace)||"anywhere"===d.closeOnClick||c.is(g))&&(b.preventDefault(),d.close())}),this},getContent:function(){var b=this,c=this.constructor.contentFilters,d=function(a){return b.$currentTarget&&b.$currentTarget.attr(a)},e=d(b.targetAttr),f=b.target||e||"",g=c[b.type];if(!g&&f in c&&(g=c[f],f=b.target&&e),f=f||d("href")||"",!g)for(var h in c)b[h]&&(g=c[h],f=b[h]);if(!g){var i=f;if(f=null,a.each(b.contentFilters,function(){return g=c[this],g.test&&(f=g.test(i)),!f&&g.regex&&i.match&&i.match(g.regex)&&(f=i),!f}),!f)return"console"in window&&window.console.error("Featherlight: no content filter found "+(i?' for "'+i+'"':" (no target specified)")),!1}return g.process.call(b,f)},setContent:function(b){var c=this;return(b.is("iframe")||a("iframe",b).length>0)&&c.$instance.addClass(c.namespace+"-iframe"),c.$content=b.addClass(c.namespace+"-inner"),c.$instance.find("."+c.namespace+"-inner").slice(1).remove().end().replaceWith(c.$content),c},open:function(d){var e=this;if(!(d&&d.isDefaultPrevented()||e.beforeOpen(d)===!1)){d&&d.preventDefault();var f=e.getContent();if(f)return e.constructor._opened.add(e._openedCallback=function(a,b){e instanceof a&&e.$instance.closest("body").length>0&&(b.currentFeatherlight=e)}),b._keyHandlerInstalled||(a(document).on("keyup."+b.prototype.namespace,c),b._keyHandlerInstalled=!0),e.$instance.appendTo(e.root).fadeIn(e.openSpeed),e.beforeContent(d),a.when(f).done(function(b){e.setContent(b),e.afterContent(d),a.when(e.$instance.promise()).done(function(){e.afterOpen(d)})}),e}return!1},close:function(d){var e=this;return e.beforeClose(d)===!1?!1:(e.constructor._opened.remove(e._openedCallback),b.current()||(a(document).off("keyup."+b.namespace,c),e.constructor._keyHandlerInstalled=!1),void e.$instance.fadeOut(e.closeSpeed,function(){e.$instance.detach(),e.afterClose(d)}))},chainCallbacks:function(b){for(var c in b)this[c]=a.proxy(b[c],this,a.proxy(this[c],this))}},a.extend(b,{id:0,autoBind:"[data-featherlight]",defaults:b.prototype,contentFilters:{jquery:{regex:/^[#.]\w/,test:function(b){return b instanceof a&&b},process:function(b){return a(b).clone(!0)}},image:{regex:/\.(png|jpg|jpeg|gif|tiff|bmp)(\?\S*)?$/i,process:function(b){var c=this,d=a.Deferred(),e=new Image;return e.onload=function(){d.resolve(a('<img src="'+b+'" alt="" class="'+c.namespace+'-image" />'))},e.onerror=function(){d.reject()},e.src=b,d.promise()}},html:{regex:/^\s*<[\w!][^<]*>/,process:function(b){return a(b)}},ajax:{regex:/./,process:function(b){var c=a.Deferred(),d=a("<div></div>").load(b,function(a,b){"error"!==b&&c.resolve(d.contents()),c.fail()});return c.promise()}},text:{process:function(b){return a("<div>",{text:b})}}},functionAttributes:["beforeOpen","afterOpen","beforeContent","afterContent","beforeClose","afterClose"],readElementConfig:function(b){var c=this,d={};return b&&b.attributes&&a.each(b.attributes,function(){var b=this.name.match(/^data-featherlight-(.*)/);if(b){var e=this.value,f=a.camelCase(b[1]);if(a.inArray(f,c.functionAttributes)>=0)e=new Function(e);else try{e=a.parseJSON(e)}catch(g){}d[f]=e}}),d},extend:function(b,c){var d=function(){this.constructor=b};return d.prototype=this.prototype,b.prototype=new d,b.__super__=this.prototype,a.extend(b,this,c),b.defaults=b.prototype,b},attach:function(b,c,d){var e=this;"object"!=typeof c||c instanceof a!=0||d||(d=c,c=void 0),d=a.extend({},d);var f=a.extend({},e.defaults,e.readElementConfig(b[0]),d);return b.on(f.openTrigger+"."+f.namespace,f.filter,function(f){var g=a.extend({$source:b,$currentTarget:a(this)},e.readElementConfig(b[0]),e.readElementConfig(this),d);new e(c,g).open(f)}),b},current:function(){var a={};return this._opened.fire(this,a),a.currentFeatherlight},close:function(){var a=this.current();a&&a.close()},_onReady:function(){var b=this;b.autoBind&&(b.attach(a(document),{filter:b.autoBind}),a(b.autoBind).filter("[data-featherlight-filter]").each(function(){b.attach(a(this))}))},_callbackChain:{onKeyDown:function(a,b){return 27===b.keyCode&&this.closeOnEsc?(this.$instance.find("."+this.namespace+"-close:first").click(),void b.preventDefault()):(console.log("pass"),a(b))}},_opened:a.Callbacks()}),a.featherlight=b,a.fn.featherlight=function(a,c){return b.attach(this,a,c)},a(document).ready(function(){b._onReady()})}(jQuery),!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],a):a(b.jQuery)}(function(a,b){function c(b,c){this.element=a(b),this.wrapperElement=a(),this.toggleElement=a(),this.init(c)}var d="plugin_hideShowPassword",e=["show","innerToggle"],f=32,g=13,h=function(){var a=document.body,b=document.createElement("input"),c=!0;a||(a=document.createElement("body")),b=a.appendChild(b);try{b.setAttribute("type","text")}catch(d){c=!1}return a.removeChild(b),c}(),i={show:"infer",innerToggle:!1,enable:h,className:"hideShowPassword-field",initEvent:"hideShowPasswordInit",changeEvent:"passwordVisibilityChange",props:{autocapitalize:"off",autocomplete:"off",autocorrect:"off",spellcheck:"false"},toggle:{element:'<button type="button">',className:"hideShowPassword-toggle",touchSupport:"undefined"==typeof Modernizr?!1:Modernizr.touch,attachToEvent:"click",attachToTouchEvent:"touchstart mousedown",attachToKeyEvent:"keyup",attachToKeyCodes:!0,styles:{position:"absolute"},touchStyles:{pointerEvents:"none"},position:"infer",verticalAlign:"middle",offset:0,attr:{role:"button","aria-label":"Show Password",tabIndex:0}},wrapper:{element:"<div>",className:"hideShowPassword-wrapper",enforceWidth:!0,styles:{position:"relative"},inheritStyles:["display","verticalAlign","marginTop","marginRight","marginBottom","marginLeft"],innerElementStyles:{marginTop:0,marginRight:0,marginBottom:0,marginLeft:0}},states:{shown:{className:"hideShowPassword-shown",changeEvent:"passwordShown",props:{type:"text"},toggle:{className:"hideShowPassword-toggle-hide",content:"Hide",attr:{"aria-pressed":"true"}}},hidden:{className:"hideShowPassword-hidden",changeEvent:"passwordHidden",props:{type:"password"},toggle:{className:"hideShowPassword-toggle-show",content:"Show",attr:{"aria-pressed":"false"}}}}};c.prototype={init:function(b){this.update(b,i)&&(this.element.addClass(this.options.className),this.options.innerToggle&&(this.wrapElement(this.options.wrapper),this.initToggle(this.options.toggle),"string"==typeof this.options.innerToggle&&(this.toggleElement.hide(),this.element.one(this.options.innerToggle,a.proxy(function(){this.toggleElement.show()},this)))),this.element.trigger(this.options.initEvent,[this]))},update:function(a,b){return this.options=this.prepareOptions(a,b),this.updateElement()&&this.element.trigger(this.options.changeEvent,[this]).trigger(this.state().changeEvent,[this]),this.options.enable},toggle:function(a){return a=a||"toggle",this.update({show:a})},prepareOptions:function(b,c){var d,e=[];if(c=c||this.options,b=a.extend(!0,{},c,b),b.enable&&("toggle"===b.show?b.show=this.isType("hidden",b.states):"infer"===b.show&&(b.show=this.isType("shown",b.states)),"infer"===b.toggle.position&&(b.toggle.position="rtl"===this.element.css("text-direction")?"left":"right"),!a.isArray(b.toggle.attachToKeyCodes))){if(b.toggle.attachToKeyCodes===!0)switch(d=a(b.toggle.element),d.prop("tagName").toLowerCase()){case"button":case"input":break;case"a":if(d.filter("[href]").length){e.push(f);break}default:e.push(f,g)}b.toggle.attachToKeyCodes=e}return b},updateElement:function(){return!this.options.enable||this.isType()?!1:(this.element.prop(a.extend({},this.options.props,this.state().props)).addClass(this.state().className).removeClass(this.otherState().className),this.updateToggle(),!0)},isType:function(a,c){return c=c||this.options.states,a=a||this.state(b,b,c).props.type,c[a]&&(a=c[a].props.type),this.element.prop("type")===a},state:function(a,c,d){return d=d||this.options.states,a===b&&(a=this.options.show),"boolean"==typeof a&&(a=a?"shown":"hidden"),c&&(a="shown"===a?"hidden":"shown"),d[a]},otherState:function(a){return this.state(a,!0)},wrapElement:function(b){var c,d=b.enforceWidth;return this.wrapperElement.length||(c=this.element.outerWidth(),a.each(b.inheritStyles,a.proxy(function(a,c){b.styles[c]=this.element.css(c)},this)),this.element.css(b.innerElementStyles).wrap(a(b.element).addClass(b.className).css(b.styles)),this.wrapperElement=this.element.parent(),d===!0&&(d=this.wrapperElement.outerWidth()===c?!1:c),d!==!1&&this.wrapperElement.css("width",d)),this.wrapperElement},initToggle:function(b){return this.toggleElement.length||(this.toggleElement=a(b.element).attr(b.attr).addClass(b.className).css(b.styles).appendTo(this.wrapperElement),this.updateToggle(),this.positionToggle(b.position,b.verticalAlign,b.offset),b.touchSupport?(this.toggleElement.css(b.touchStyles),this.element.on(b.attachToTouchEvent,a.proxy(this.toggleTouchEvent,this))):this.toggleElement.on(b.attachToEvent,a.proxy(this.toggleEvent,this)),b.attachToKeyCodes.length&&this.toggleElement.on(b.attachToKeyEvent,a.proxy(this.toggleKeyEvent,this))),this.toggleElement},positionToggle:function(a,b,c){var d={};switch(d[a]=c,b){case"top":case"bottom":d[b]=c;break;case"middle":d.top="50%",d.marginTop=this.toggleElement.outerHeight()/-2}return this.toggleElement.css(d)},updateToggle:function(a,b){var c,d;return this.toggleElement.length&&(c="padding-"+this.options.toggle.position,a=a||this.state().toggle,b=b||this.otherState().toggle,this.toggleElement.attr(a.attr).addClass(a.className).removeClass(b.className).html(a.content),d=this.toggleElement.outerWidth()+2*this.options.toggle.offset,this.element.css(c)!==d&&this.element.css(c,d)),this.toggleElement},toggleEvent:function(a){a.preventDefault(),this.toggle()},toggleKeyEvent:function(b){a.each(this.options.toggle.attachToKeyCodes,a.proxy(function(a,c){return b.which===c?(this.toggleEvent(b),!1):void 0},this))},toggleTouchEvent:function(a){var b,c,d,e=this.toggleElement.offset().left;e&&(b=a.pageX||a.originalEvent.pageX,"left"===this.options.toggle.position?(e+=this.toggleElement.outerWidth(),c=b,d=e):(c=e,d=b),d>=c&&this.toggleEvent(a))}},a.fn.hideShowPassword=function(){var b={};return a.each(arguments,function(c,d){var f={};if("object"==typeof d)f=d;else{if(!e[c])return!1;f[e[c]]=d}a.extend(!0,b,f)}),this.each(function(){var e=a(this),f=e.data(d);f?f.update(b):e.data(d,new c(this,b))})},a.each({show:!0,hide:!1,toggle:"toggle"},function(b,c){a.fn[b+"Password"]=function(a,b){return this.hideShowPassword(c,a,b)}})},this),function(a){"use strict";function b(a){return"true"===(a+"").toLowerCase()}a(function(){function c(a){a.wrap("<form>").parent("form").trigger("reset"),a.unwrap()}if("undefined"!=typeof tinyMCE?a(".wpas-form").submit(function(b){var c=a('[type="submit"]',a(this)),d=tinyMCE.activeEditor.getContent();return a('input[name="wpas_close_ticket"]:checked').length||""!==d&&null!==d?void c.prop("disabled",!0).text(wpas.translations.onSubmit):(a(tinyMCE.activeEditor.getBody()).css("background-color","#ffeeee"),alert(wpas.translations.emptyEditor),a(tinyMCE.activeEditor.getBody()).css("background-color",""),tinyMCE.activeEditor.focus(),!1)}):a(".wpas-form").submit(function(b){var c=a('[type="submit"]',a(this)),d=c.attr("data-onsubmit")?c.attr("data-onsubmit"):wpas.translations.onSubmit;c.prop("disabled",!0).text(d)}),a(".wpas-modal-trigger").featherlight(),a("#wpas_form_registration").on("change",'input[name="wpas_pwdshow[]"]',function(b){b.preventDefault(),a("#wpas_password").hideShowPassword(a(this).prop("checked"))}),"undefined"!=typeof wpas&&b(wpas.emailCheck)){var d=a('input[name="email"]'),e=a("#email-validation");d.change(function(){var b={action:"email_validation",email:d.val()};a.post(wpas.ajaxurl,b,function(a){e.html(a).show()})}),e.on("click","strong",function(){d.val(a(this).html()),e.hide()})}if("undefined"!=typeof wpas&&wpas.fileUploadMax){var f=a("#wpas_files");f.on("change",function(b){b.preventDefault();var d=[];a.each(f.get(0).files,function(a,b){b.size>wpas.fileUploadSize&&d.push(b.name)}),0!==d.length&&(alert(wpas.fileUploadMaxSizeError[0]+"\n\n"+d.join("\n")+".\n\n"+wpas.fileUploadMaxSizeError[1]),c(f)),parseInt(f.get(0).files.length)>parseInt(wpas.fileUploadMax,10)&&(alert(wpas.fileUploadMaxError),c(f))})}})}(jQuery);