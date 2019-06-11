// 计算屏幕适配
(function(doc){
    var obj = {};
    obj.resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    obj.Html = doc.getElementsByTagName("html")[0];
    obj.widthProportion = function(){
        var p = Number((doc.body && doc.body.clientWidth || obj.Html.offsetWidth) / 750);
        return p > 1 ? 1 : p < 0.5 ? 0.5 : p;
    };
    obj.changePage = function(){
        obj.Html.setAttribute("style", "font-size:" + (obj.widthProportion() * 100).toFixed(2) + "px !important");
    };
    obj.changePage();
    if (!document.addEventListener) return;
    window.addEventListener(obj.resizeEvt, obj.changePage, false);
    document.addEventListener('DOMContentLoaded', obj.changePage, false);
})(document);

