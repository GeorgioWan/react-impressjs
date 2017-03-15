'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _update = require('react/lib/update');

var _update2 = _interopRequireDefault(_update);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultData = {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1
};

var Step = function (_Component) {
    _inherits(Step, _Component);

    function Step(props) {
        _classCallCheck(this, Step);

        var _this = _possibleConstructorReturn(this, (Step.__proto__ || Object.getPrototypeOf(Step)).call(this, props));

        var _this$props = _this.props,
            className = _this$props.className,
            duration = _this$props.duration;


        _this.state = {
            id: _this.gtepID(),
            className: className ? "step " + className : "step",
            data: _this.getData(),
            duration: duration ? duration : 1000,
            isPresented: false
        };
        return _this;
    }

    _createClass(Step, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var initStep = this.props.initStep;


            initStep(this.state);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _state = this.state,
                id = _state.id,
                isPresented = _state.isPresented;


            if (id === nextProps.activeStep.id && !isPresented) this.setState((0, _update2.default)(this.state, {
                isPresented: {
                    $set: true
                }
            }));
        }

        // Step's Event

    }, {
        key: 'handleClick',
        value: function handleClick(e) {
            var goto = this.props.goto;

            var target = e.target;

            while (!target.classList.contains('step') && !target.classList.contains('active') && !target.classList.contains('oi-step-element') && target !== document.documentElement) {
                target = target.parentNode;
            }

            if (target !== document.documentElement) if (target.classList.contains('step')) goto(this.state, this.state.duration);
        }

        // Step's ID, ClassName, Style

    }, {
        key: 'gtepID',
        value: function gtepID() {
            var id = this.props.id;


            var move = new Date().getTime().toString();
            return id || "step-" + move;
        }
    }, {
        key: 'getData',
        value: function getData() {
            var data = this.props.data;


            return data ? {
                x: (0, _util.toNumber)(data.x),
                y: (0, _util.toNumber)(data.y),
                z: (0, _util.toNumber)(data.z),
                rotateX: (0, _util.toNumber)(data.rotateX),
                rotateY: (0, _util.toNumber)(data.rotateY),
                rotateZ: (0, _util.toNumber)(data.rotateZ || data.rotate),
                scale: (0, _util.toNumber)(data.scale, 1)
            } : defaultData;
        }
    }, {
        key: 'getStyle',
        value: function getStyle() {
            var data = this.state.data;


            var _stepStyle = {
                position: 'absolute',
                transform: 'translate(-50%, -50%) ',
                transformStyle: 'preserve-3d'
            };

            _stepStyle.transform += (0, _util.translate)(data ? data : defaultData) + (0, _util.rotate)(data ? data : defaultData) + (0, _util.scale)(data.scale ? data.scale : defaultData);

            return _stepStyle;
        }
    }, {
        key: 'getClassName',
        value: function getClassName() {
            var activeStep = this.props.activeStep;
            var _state2 = this.state,
                id = _state2.id,
                className = _state2.className,
                isPresented = _state2.isPresented;


            if (id === activeStep.id) return className + " active present";else if (isPresented) return className + " past";else return className + " future";
        }
    }, {
        key: 'render',
        value: function render() {
            var children = this.props.children;
            var id = this.state.id;


            var _stepClassName = this.getClassName();
            var _stepStyle = this.getStyle();

            return _react2.default.createElement(
                'div',
                { id: id,
                    className: _stepClassName,
                    style: _stepStyle,
                    onClick: this.handleClick.bind(this) },
                children
            );
        }
    }]);

    return Step;
}(_react.Component);

exports.default = Step;
//# sourceMappingURL=Step.js.map