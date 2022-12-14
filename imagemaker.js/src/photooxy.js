"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoOxy = void 0;
const request_1 = __importDefault(require("request"));
const cheerio_1 = __importDefault(require("cheerio"));
function PhotoOxy(url, text, headers) {
    return new Promise((resolve, reject) => {
        (0, request_1.default)({
            url: url,
            method: "GET",
            followAllRedirects: true,
            headers: headers.ephoto
        }, function (err, res, body) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return reject({
                        success: false
                    });
                const $ = cheerio_1.default.load(body);
                let servidor = $('#build_server').val();
                let servidorId = $('#build_server_id').val();
                let token = $('#token').val();
                // Enviar para o POST
                // @ts-ignore
                let types = [];
                $('.item-input.select_option_wrapper >  label').each((i, elem) => {
                    types.push($(elem).find('input').val());
                });
                let form;
                if (types.length != 0) {
                    form = {
                        'autocomplete0': '',
                        // @ts-ignore
                        'radio0[radio]': types[Math.floor(Math.random() * types.length)],
                        'text': [
                            ...text
                        ],
                        'submit': 'GO',
                        'token': token,
                        'build_server': servidor,
                        'build_server_id': Number(servidorId)
                    };
                }
                else {
                    form = {
                        'autocomplete0': '',
                        'text': [
                            ...text
                        ],
                        'submit': 'GO',
                        'token': token,
                        'build_server': servidor,
                        'build_server_id': Number(servidorId)
                    };
                }
                (0, request_1.default)({
                    url: url,
                    method: "POST",
                    followAllRedirects: true,
                    headers: headers.ephoto,
                    form: form
                }, function (err, res, body) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            return reject({
                                success: false
                            });
                        const $ = cheerio_1.default.load(body);
                        (0, request_1.default)({
                            url: 'https://photooxy.com/effect/create-image',
                            method: 'POST',
                            headers: headers.ephoto,
                            // @ts-ignore
                            form: JSON.parse($('#form_value').first().text())
                        }, function (err, res, body) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    return reject({
                                        success: false
                                    });
                                let parse = JSON.parse(body);
                                resolve({
                                    success: true,
                                    imageUrl: servidor + parse.image,
                                    session_id: parse.session_id
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
exports.PhotoOxy = PhotoOxy;
;
