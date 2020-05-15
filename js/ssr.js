var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var SSR = /** @class */ (function () {
    function SSR(configFilePath) {
        this.wrapper = null;
        this.wrapper = document.querySelector('#SSR__contentWrapper');
        this.configFilePath = configFilePath;
        this.configuration = null;
        this.SSRLinks = document.querySelectorAll('[data-SSR-link]');
        this.name = this.getLinkedSSRName(window.location.href);
        this.path = window.location.pathname + window.location.search;
        this.audioElement = document.querySelector('audio#[data-SSR-audio]');
        this.printContent();
        if (this.SSRLinks.length !== 0)
            this.listenOnLinks();
    }
    SSR.prototype.getLinkedSSRName = function (url) {
        return new URL(url).searchParams.get('SSR');
    };
    SSR.prototype.setConfigutation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.configFilePath || typeof this.configFilePath !== 'string')
                            return [2 /*return*/, console.error('[SSR]: No valid reference to the configuration file')];
                        _a = this;
                        return [4 /*yield*/, fetch(this.configFilePath)];
                    case 1: return [4 /*yield*/, (_b.sent()).json()];
                    case 2:
                        _a.configuration = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SSR.prototype.printContent = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var match, file;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.configuration) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setConfigutation()
                            // search dedicated path
                        ];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        match = this.configuration.find(function (config) {
                            var _a, _b;
                            return ((_a = config.path) === null || _a === void 0 ? void 0 : _a.includes(_this.path)) ||
                                ((_b = config.name) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase()) === _this.name;
                        });
                        if (!match)
                            return [2 /*return*/, console.error("[SSR]: Couldn't find any configuration'.\n         Please check the configuration file '" + this.configFilePath + "' and the given paths.")
                                // fetch dedicated file
                            ];
                        return [4 /*yield*/, fetch(match.dedicatedPath)];
                    case 3: return [4 /*yield*/, (_b.sent()).text()
                        // convert dedicated file if necessary
                    ];
                    case 4:
                        file = _b.sent();
                        // convert dedicated file if necessary
                        if (/.*.md$/.test(match.dedicatedPath.toString()))
                            // @ts-ignore
                            file = window.markdownit().render(file);
                        // display content
                        this.wrapper.innerHTML = file;
                        // play audio
                        this.audioElement.src = match.audio;
                        (_a = this.audioElement) === null || _a === void 0 ? void 0 : _a.play();
                        if (match)
                            // update link
                            this.updateLinks();
                        return [2 /*return*/];
                }
            });
        });
    };
    SSR.prototype.updateLinks = function () {
        var _this = this;
        var _a;
        console.log(this.path);
        (_a = this.SSRLinks) === null || _a === void 0 ? void 0 : _a.forEach(function (link) {
            if (_this.name === _this.getLinkedSSRName(link.href) ||
                _this.path === link.pathname + link.search) {
                // if link is called, add given class
                link.classList.add(link.getAttribute('data-SSR-link'));
            }
            else {
                link.classList.remove(link.getAttribute('data-SSR-link'));
            }
        });
    };
    SSR.prototype.listenOnLinks = function () {
        var _this = this;
        this.SSRLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                // prevent site switch
                e.preventDefault();
                _this.path = link.pathname + link.search;
                _this.name = _this.getLinkedSSRName(link.href);
                _this.printContent();
            });
        });
    };
    return SSR;
}());
export default SSR;
