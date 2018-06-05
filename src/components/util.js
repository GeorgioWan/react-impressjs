export function toNumber(numeric, fallback) {
  return isNaN(numeric) ? (fallback || 0) : Number(numeric);
}

export function translate(data) {
  return ' translate3d(' + toNumber(data.x) + 'px, ' + toNumber(data.y) +
      'px, ' + toNumber(data.z) + 'px)';
}

export function rotate(data, revert) {
  let rX = ' rotateX(' + toNumber(data.rotateX) + 'deg) ',
      rY = ' rotateY(' + toNumber(data.rotateY) + 'deg) ',
      rZ = ' rotateZ(' + toNumber(data.rotateZ) + 'deg) ';

  return revert ? rZ + rY + rX : rX + rY + rZ;
}

export function scale(data) {
  return ' scale(' + toNumber(data, 1) + ')';
}

export function perspective(p) {
  return ' perspective(' + p + 'px) ';
}

export function computeWindowScale(config) {
  let hScale = window.innerHeight / config.height,
      wScale = window.innerWidth / config.width,
      scale  = hScale > wScale ? wScale : hScale;

  if (config.maxScale && scale > config.maxScale) {
    scale = config.maxScale;
  }

  if (config.minScale && scale < config.minScale) {
    scale = config.minScale;
  }

  return scale;
}

export const pfx = (() => {
  let style    = document.createElement('dummy').style,
      prefixes = 'Webkit Moz O ms Khtml'.split(' '),
      memory   = {};

  return (prop) => {
    if (typeof memory[prop] === 'undefined') {
      let ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
          props  = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(
              ' ');

      memory[prop] = null;
      for (let i in props) {
        if (style[props[i]] !== undefined) {
          memory[prop] = props[i];
          break;
        }
      }
    }

    return memory[prop];
  };
})();

export function css(el, props) {
  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      let pkey = pfx(key);
      if (pkey !== null) {
        el.style[pkey] = props[key];
      }
    }
  }
  return el;
}

export function throttle(fn, delay) {
  let timer = null;
  return function() {
    let context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

export function getElementFromHash(stepsData) {
  let id = window.location.hash.replace(/^#\/?/, '');
  return stepsData[id];
}
