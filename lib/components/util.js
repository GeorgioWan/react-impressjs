'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toNumber = toNumber;
exports.translate = translate;
exports.rotate = rotate;
exports.scale = scale;
exports.perspective = perspective;
exports.computeWindowScale = computeWindowScale;
exports.css = css;
exports.throttle = throttle;
exports.getElementFromHash = getElementFromHash;
function toNumber(numeric, fallback) {
    return isNaN(numeric) ? fallback || 0 : Number(numeric);
}
function translate(data) {
    return ' translate3d(' + toNumber(data.x) + 'px, ' + toNumber(data.y) + 'px, ' + toNumber(data.z) + 'px)';
}
function rotate(data, revert) {
    var rX = " rotateX(" + toNumber(data.rotateX) + "deg) ",
        rY = " rotateY(" + toNumber(data.rotateY) + "deg) ",
        rZ = " rotateZ(" + toNumber(data.rotateZ) + "deg) ";

    return revert ? rZ + rY + rX : rX + rY + rZ;
}
function scale(data) {
    return ' scale(' + toNumber(data, 1) + ')';
}
function perspective(p) {
    return " perspective(" + p + "px) ";
}
function computeWindowScale(config) {
    var hScale = window.innerHeight / config.height,
        wScale = window.innerWidth / config.width,
        scale = hScale > wScale ? wScale : hScale;

    if (config.maxScale && scale > config.maxScale) {
        scale = config.maxScale;
    }

    if (config.minScale && scale < config.minScale) {
        scale = config.minScale;
    }

    return scale;
}
var pfx = exports.pfx = function () {
    var style = document.createElement("dummy").style,
        prefixes = "Webkit Moz O ms Khtml".split(" "),
        memory = {};

    return function (prop) {
        if (typeof memory[prop] === "undefined") {
            var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                props = (prop + " " + prefixes.join(ucProp + " ") + ucProp).split(" ");

            memory[prop] = null;
            for (var i in props) {
                if (style[props[i]] !== undefined) {
                    memory[prop] = props[i];
                    break;
                }
            }
        }

        return memory[prop];
    };
}();
function css(el, props) {
    for (var key in props) {
        if (props.hasOwnProperty(key)) {
            var pkey = pfx(key);
            if (pkey !== null) {
                el.style[pkey] = props[key];
            }
        }
    }
    return el;
}
function throttle(fn, delay) {
    var timer = null;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}
function getElementFromHash(stepsData) {
    var id = window.location.hash.replace(/^#\/?/, "");
    return stepsData[id];
}
//# sourceMappingURL=util.js.map