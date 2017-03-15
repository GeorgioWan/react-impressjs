'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _update = require('react/lib/update');

var _update2 = _interopRequireDefault(_update);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var body = document.body,
    ua = navigator.userAgent.toLowerCase();

var defaults = {
    width: 1024,
    height: 768,
    maxScale: 1,
    minScale: 0,
    perspective: 1000,
    transitionDuration: 1000
};

var rootStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "top left",
    transition: "all 0s ease-in-out",
    transformStyle: "preserve-3d"
};

var windowScale = null,
    config = null;

var _impressSupported = void 0,
    _lastHash = "",
    _stepsData = {},
    _activeStep = void 0;

var Impress = function (_Component) {
    _inherits(Impress, _Component);

    function Impress(props) {
        _classCallCheck(this, Impress);

        // impress & canvas state
        var _this = _possibleConstructorReturn(this, (Impress.__proto__ || Object.getPrototypeOf(Impress)).call(this, props));

        _this.state = {
            activeStep: {},
            stepsData: {},
            rootStyles: rootStyles,
            canvasStyles: rootStyles,
            currentState: {
                x: 0, y: 0, z: 0,
                rotateX: 0, rotateY: 0, rotateZ: 0,
                scale: 1
            }
        };
        return _this;
    }

    _createClass(Impress, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            // Init impress
            var rootData = this.props.rootData;

            this.init(rootData || {});
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.setState((0, _update2.default)(this.state, {
                activeStep: {
                    $set: _activeStep
                },
                stepsData: {
                    $set: _stepsData
                }
            }));

            // 2017/2/28 暫時想不到好方法
            this.goto(_activeStep, 500);

            document.addEventListener("keyup", (0, _util.throttle)(function (e) {
                if (e.keyCode === 9 || e.keyCode >= 32 && e.keyCode <= 34 || e.keyCode >= 37 && e.keyCode <= 40) {
                    switch (e.keyCode) {
                        case 33: // Page up
                        case 37: // Left
                        case 38:
                            // Up
                            _this2.prev();
                            break;
                        case 9: // Tab
                        case 32: // Space
                        case 34: // Page down
                        case 39: // Right
                        case 40:
                            // Down
                            _this2.next();
                            break;
                        default:
                            break;
                    }
                }

                //this.state.stepsData[ Object.keys( this.state.stepsData ) ]
            }, 250), false);

            window.addEventListener("resize", (0, _util.throttle)(function () {
                _this2.goto(_this2.state.activeStep, 500);
            }, 250), false);

            window.addEventListener("hashchange", (0, _util.throttle)(function () {
                if (window.location.hash !== _lastHash) _this2.goto((0, _util.getElementFromHash)(_stepsData), 500);
            }, 250), false);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener("keydown", function (event) {
                console.log(event.keyCode);
            }, false);
        }
    }, {
        key: 'init',
        value: function init(rootData) {
            // Check impress support or not.
            _impressSupported =
            // Browser should support CSS 3D transtorms
            (0, _util.pfx)("perspective") !== null &&
            // Browser should support `classList` and `dataset` APIs
            body.classList && body.dataset &&
            // But some mobile devices need to be blacklisted,
            // because their CSS 3D support or hardware is not
            // good enough to run impress.js properly, sorry...
            ua.search(/(iphone)|(ipod)|(android)/) === -1;

            if (!_impressSupported) {
                // We can't be sure that `classList` is supported
                body.className += " impress-not-supported ";
            } else {
                body.classList.remove("impress-not-supported");
                body.classList.add("impress-supported");
            }
            // Config
            config = {
                width: (0, _util.toNumber)(rootData.width, defaults.width),
                height: (0, _util.toNumber)(rootData.height, defaults.height),
                maxScale: (0, _util.toNumber)(rootData.maxScale, defaults.maxScale),
                minScale: (0, _util.toNumber)(rootData.minScale, defaults.minScale),
                perspective: (0, _util.toNumber)(rootData.perspective, defaults.perspective),
                transitionDuration: (0, _util.toNumber)(rootData.transitionDuration, defaults.transitionDuration)
            };
            windowScale = (0, _util.computeWindowScale)(config);
            // HTML height
            document.documentElement.style.height = "100%";
            // Body style
            (0, _util.css)(body, {
                height: "100%",
                overflow: "hidden"
            });

            this.setState((0, _update2.default)(this.state, {
                rootStyles: {
                    $merge: {
                        'transform': (0, _util.perspective)(config.perspective / windowScale) + (0, _util.scale)(windowScale)
                    }
                }
            }));

            body.classList.add("impress-enabled");
        }
    }, {
        key: 'initStep',
        value: function initStep(step) {
            if (!_activeStep) _activeStep = step;

            _stepsData = (0, _update2.default)(_stepsData, {
                $merge: _defineProperty({}, step.id, {
                    id: step.id,
                    className: step.className,
                    data: step.data,
                    duration: step.duration
                })
            });
        }
    }, {
        key: 'goto',
        value: function goto(step) {
            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
            var _state = this.state,
                activeStep = _state.activeStep,
                currentState = _state.currentState;


            window.scrollTo(0, 0);

            if (activeStep) body.classList.remove("impress-on-" + activeStep.id);

            body.classList.add("impress-on-" + step.id);

            var target = {
                x: -step.data.x,
                y: -step.data.y,
                z: -step.data.z,
                rotateX: -step.data.rotateX,
                rotateY: -step.data.rotateY,
                rotateZ: -step.data.rotateZ,
                scale: 1 / step.data.scale
            };

            var zoomin = target.scale >= currentState.scale;

            duration = (0, _util.toNumber)(duration, config.transitionDuration);
            var delay = duration / 2;

            if (step.id === activeStep.id) windowScale = (0, _util.computeWindowScale)(config);

            var targetScale = target.scale * windowScale;

            this.setState((0, _update2.default)(this.state, {
                activeStep: {
                    $set: step
                },
                currentState: {
                    $set: target
                },
                rootStyles: {
                    transform: {
                        $set: (0, _util.perspective)(config.perspective / targetScale) + (0, _util.scale)(targetScale)
                    },
                    transitionDuration: {
                        $set: duration + "ms"
                    },
                    transitionDelay: {
                        $set: (zoomin ? delay : 0) + "ms"
                    }
                },
                canvasStyles: {
                    transform: {
                        $set: (0, _util.rotate)(target, true) + (0, _util.translate)(target)
                    },
                    transitionDuration: {
                        $set: duration + "ms"
                    },
                    transitionDelay: {
                        $set: (zoomin ? 0 : delay) + "ms"
                    }
                }
            }));

            window.location.hash = _lastHash = "#/" + step.id;
        }
    }, {
        key: 'prev',
        value: function prev() {
            var activeStep = this.state.activeStep;

            var stepsDataEntries = Object.entries(_stepsData);
            var prev = stepsDataEntries.findIndex(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    k = _ref2[0],
                    v = _ref2[1];

                return k === activeStep.id;
            }) - 1;
            prev = prev >= 0 ? stepsDataEntries[prev][1] : stepsDataEntries[stepsDataEntries.length - 1][1];

            this.goto(prev, prev.duration);
        }
    }, {
        key: 'next',
        value: function next() {
            var activeStep = this.state.activeStep;

            var stepsDataEntries = Object.entries(_stepsData);
            var next = stepsDataEntries.findIndex(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    k = _ref4[0],
                    v = _ref4[1];

                return k === activeStep.id;
            }) + 1;
            next = next < stepsDataEntries.length ? stepsDataEntries[next][1] : stepsDataEntries[0][1];

            this.goto(next, next.duration);
        }
    }, {
        key: 'stepComponent',
        value: function stepComponent(step, index) {
            var activeStep = this.state.activeStep;


            return _react2.default.cloneElement(step, {
                key: index,
                activeStep: activeStep,
                initStep: this.initStep.bind(this),
                goto: this.goto.bind(this)
            }, step.props.children);
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                rootStyles = _state2.rootStyles,
                canvasStyles = _state2.canvasStyles;

            var steps = _react2.default.Children.map(this.props.children, this.stepComponent.bind(this));

            return _react2.default.createElement(
                'div',
                { id: 'impress', style: rootStyles },
                _react2.default.createElement(
                    'div',
                    { style: canvasStyles },
                    _impressSupported ? steps : _react2.default.createElement(
                        'h1',
                        null,
                        'Sorry, your media or browser doesn\'t support this.'
                    )
                )
            );
        }
    }]);

    return Impress;
}(_react.Component);

exports.default = Impress;
//# sourceMappingURL=Impress.js.map