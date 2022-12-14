"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpNext = exports.getRelated = exports.getVideo = exports.getPlaylist = exports.search = void 0;
var parser_1 = __importDefault(require("./common/parser"));
var bent_1 = __importDefault(require("bent"));
var request = bent_1.default("string");
var url = "https://www.youtube.com/";
var searchType = {
    video: "EgIQAQ%3D%3D",
    playlist: "EgIQAw%3D%253D",
    channel: "EgIQAg%3D%253D",
    all: ""
};
__exportStar(require("./common/types"), exports);
/**
 * Start worker for scrapping
 *
 * @param scraper What to scrape
 * @param html the HTML string
 * @param options Scrape options
 */
var scrapeWorker = function (scraper, html, options) {
    return new Promise(function (resolve, reject) {
        var worker = new (require("worker_threads").Worker)(__dirname + "/common/worker.js", {
            workerData: {
                scraper: scraper,
                html: html,
                options: options
            }
        });
        worker.on("message", resolve);
        worker.on("error", reject);
    });
};
/**
 * Search youtube for a list of  based on a search query.
 *
 * @param query Search Query
 * @param options Options for scraper
 */
exports.search = function (query, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var searchUrl, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (query.trim().length === 0)
                        throw (new Error("Query cannot be blank"));
                    if (options === undefined)
                        options = {};
                    options = __assign({ type: "all", useWorkerThread: false, limit: 10, page: 1 }, options);
                    searchUrl = url + "results?sp=" + searchType[options.type] + "&page=" + options.page + "&search_query=" + query;
                    return [4 /*yield*/, request(searchUrl)];
                case 1:
                    html = _a.sent();
                    if (!options.useWorkerThread) return [3 /*break*/, 3];
                    return [4 /*yield*/, scrapeWorker("search", html, options)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: return [2 /*return*/, parser_1.default.parseSearch(html, options)];
            }
        });
    });
};
/**
 * Search youtube for playlist information.
 *
 * @param playlistId Id of the playlist
 * @param options Options for scraper
 */
exports.getPlaylist = function (playlistId, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var playlistUrl, html, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (playlistId.trim().length === 0)
                        throw (new Error("Playlist ID cannot be blank"));
                    if (options === undefined)
                        options = {};
                    options = __assign({ useWorkerThread: false }, options);
                    playlistUrl = url + "playlist?list=" + playlistId;
                    html = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request(playlistUrl)];
                case 2:
                    html = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    // Youtube returns 303 if playlist id is invalid
                    if (err_1.statusCode === 303)
                        return [2 /*return*/, {}];
                    throw (err_1);
                case 4:
                    if (!options.useWorkerThread) return [3 /*break*/, 6];
                    return [4 /*yield*/, scrapeWorker("getPlaylist", html, options)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/, parser_1.default.parseGetPlaylist(html)];
            }
        });
    });
};
/**
 * Search youtube for video information.
 *
 * @param videoId Id of the video
 * @param options Options for scraper
 */
exports.getVideo = function (videoId, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var videoUrl, html, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (videoId.trim().length === 0)
                        throw (new Error("Video ID cannot be blank"));
                    if (options === undefined)
                        options = {};
                    options = __assign({ useWorkerThread: false }, options);
                    videoUrl = url + "watch?v=" + videoId;
                    html = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request(videoUrl)];
                case 2:
                    html = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    // Youtube returns 303 if video id is invalid
                    if (err_2.statusCode === 303)
                        return [2 /*return*/, {}];
                    throw (err_2);
                case 4:
                    if (!options.useWorkerThread) return [3 /*break*/, 6];
                    return [4 /*yield*/, scrapeWorker("getVideo", html, options)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/, parser_1.default.parseGetVideo(html)];
            }
        });
    });
};
/**
 * Search youtube for related videos based on videoId.
 *
 * @param videoId Id of the video
 * @param options Options for scraper
 */
exports.getRelated = function (videoId, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var videoUrl, html, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (videoId.trim().length === 0)
                        throw (new Error("Video ID cannot be blank"));
                    if (options === undefined)
                        options = {};
                    options = __assign({ useWorkerThread: false, limit: 10 }, options);
                    videoUrl = url + "watch?v=" + videoId;
                    html = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request(videoUrl)];
                case 2:
                    html = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    // Youtube returns 303 if video id is invalid
                    if (err_3.statusCode === 303)
                        return [2 /*return*/, []];
                    throw (err_3);
                case 4:
                    if (!options.useWorkerThread) return [3 /*break*/, 6];
                    return [4 /*yield*/, scrapeWorker("getRelated", html, options)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/, parser_1.default.parseGetRelated(html, options.limit || 10)];
            }
        });
    });
};
/**
 * Search youtube for up next video based on videoId.
 *
 * @param videoId Id of the video
 * @param options Options for scraper
 */
exports.getUpNext = function (videoId, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var videoUrl, html, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (videoId.trim().length === 0)
                        throw (new Error("Video ID cannot be blank"));
                    if (options === undefined)
                        options = {};
                    options = __assign({ useWorkerThread: false }, options);
                    videoUrl = url + "watch?v=" + videoId;
                    html = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request(videoUrl)];
                case 2:
                    html = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    // Youtube returns 303 if video id is invalid
                    if (err_4.statusCode === 303)
                        return [2 /*return*/, {}];
                    throw (err_4);
                case 4:
                    if (!options.useWorkerThread) return [3 /*break*/, 6];
                    return [4 /*yield*/, scrapeWorker("getUpNext", html, options)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/, parser_1.default.parseGetUpNext(html)];
            }
        });
    });
};
exports.default = {
    search: exports.search,
    getPlaylist: exports.getPlaylist,
    getVideo: exports.getVideo,
    getRelated: exports.getRelated,
    getUpNext: exports.getUpNext
};
