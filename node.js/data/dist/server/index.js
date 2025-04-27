"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const app = (0, express_1.default)();
// Serve static files from the public directory
app.use(express_1.default.static((0, path_1.join)(__dirname, '../public')));
const port = process.env.PORT || 3001; // Changed to port 3001
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
