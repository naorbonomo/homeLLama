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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
var vscode = require("vscode");
var axios_1 = require("axios");
var timeout;
function activate(context) {
    var _this = this;
    console.log('Congratulations, your extension "HomeLlama" is now active!');
    // Register command for chat-like interaction
    var disposable = vscode.commands.registerCommand('homellama.askLlama', function () { return __awaiter(_this, void 0, void 0, function () {
        var prompt, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showInputBox({
                        placeHolder: "Ask HomeLlama something...",
                    })];
                case 1:
                    prompt = _a.sent();
                    if (!prompt) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log('Sending POST request to Ollama with prompt:', prompt);
                    return [4 /*yield*/, axios_1.default.post('http://127.0.0.1:11434/api/generate', {
                            model: "llama3.1:8b-instruct-fp16",
                            prompt: prompt
                        })];
                case 3:
                    response = _a.sent();
                    vscode.window.showInformationMessage("Ollama says: ".concat(response.data.response));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    vscode.window.showErrorMessage("Error: ".concat(error_1.message));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    // Register inline completion provider for JavaScript and TypeScript
    var inlineProvider = vscode.languages.registerInlineCompletionItemProvider(['javascript', 'typescript'], {
        provideInlineCompletionItems: function (document, position, context, token) {
            return __awaiter(this, void 0, void 0, function () {
                var currentLine;
                var _this = this;
                return __generator(this, function (_a) {
                    currentLine = document.lineAt(position).text.substring(0, position.character).trim();
                    console.log('Inline completion provider triggered. Current line:', currentLine);
                    // Clear the previous timeout
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var prompt_1, response, rawResponse, codeMatch, codeSnippet, inlineItem, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            prompt_1 = "Provide a concise JavaScript code snippet to complete the following line:\n".concat(currentLine);
                                            console.log('Sending POST request to Ollama with prompt:', prompt_1);
                                            return [4 /*yield*/, axios_1.default.post('http://127.0.0.1:11434/api/generate', {
                                                    model: "llama3.1:8b-instruct-fp16",
                                                    prompt: prompt_1,
                                                    stream: false // We'll handle streaming differently below
                                                })];
                                        case 1:
                                            response = _a.sent();
                                            console.log('Response from Ollama:', response.data);
                                            rawResponse = response.data.response.trim();
                                            codeMatch = rawResponse.match(/```javascript\s*([\s\S]*?)```/i) ||
                                                rawResponse.match(/```js\s*([\s\S]*?)```/i) ||
                                                [null, rawResponse];
                                            codeSnippet = codeMatch[1] ? codeMatch[1].trim() : rawResponse;
                                            if (codeSnippet) {
                                                inlineItem = new vscode.InlineCompletionItem(new vscode.SnippetString(codeSnippet));
                                                resolve(new vscode.InlineCompletionList([inlineItem]));
                                            }
                                            else {
                                                resolve(undefined);
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            error_2 = _a.sent();
                                            console.error('Error fetching completion:', error_2.message);
                                            resolve(undefined);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, 300); // Debounce delay
                        })];
                });
            });
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(inlineProvider);
}
function deactivate() { }
