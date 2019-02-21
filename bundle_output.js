
    (function(modules){
        function require(id) {
            const [fn, mapping] = modules[id];

            function localRequire(relativePath) {
                return require(mapping[relativePath]);
            }
            const module = { exports: {} };

            fn(localRequire, module, module.exports)

            return module.exports;
        }

        require(0);
    })({
            0 : [
                function(require, module, exports) {
                    "use strict";

var _message = require("./message.mjs");

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_message2.default);
                },
                {"./message.mjs":1}
            ],
        
            1 : [
                function(require, module, exports) {
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _name = require("./name.mjs");

var _name2 = _interopRequireDefault(_name);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = "Hello " + _name2.default + "!!!";
                },
                {"./name.mjs":2}
            ],
        
            2 : [
                function(require, module, exports) {
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lname = require("./lname.mjs");

var _lname2 = _interopRequireDefault(_lname);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var name = void 0;
exports.default = name = "Raviteja " + _lname2.default;
                },
                {"./lname.mjs":3}
            ],
        
            3 : [
                function(require, module, exports) {
                    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var lname = void 0;
exports.default = lname = "Giduturi";
                },
                {}
            ],
        })
    