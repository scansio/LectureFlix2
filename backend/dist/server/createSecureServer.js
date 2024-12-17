"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverCertificateOptions = void 0;
exports.default = createSecureServer;
exports.addHtAccessRule = addHtAccessRule;
exports.onClose = onClose;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const https = __importStar(require("https"));
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const serverTerminatorEvent_1 = require("./serverTerminatorEvent");
const path_1 = __importDefault(require("path"));
const common_1 = require("../common");
const SharedConfig_1 = __importDefault(require("../libs/SharedConfig"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const serverConfig_1 = __importDefault(require("./serverConfig"));
const Logger_1 = __importDefault(require("../miscs/Logger"));
const serverCertificateOptions = () => {
    const caDir = path_1.default.resolve(__dirname, '..', '..', 'ca');
    const certPath = path_1.default.resolve(caDir, 'certificate.crt');
    const caPath = path_1.default.resolve(caDir, 'ca_bundle.crt');
    const keyPath = path_1.default.resolve(caDir, 'private.key');
    const cert = fs.readFileSync(certPath);
    const ca = fs.readFileSync(caPath);
    const key = fs.readFileSync(keyPath);
    const options = {
        cert,
        ca,
        key,
    };
    return options;
};
exports.serverCertificateOptions = serverCertificateOptions;
function createSecureServer({ app, router, serverName, scheme, port, }) {
    dotenv_1.default.config();
    const production = process.env.LOCAL_DEVELOPMENT !== 'yes';
    let protocol = 'http';
    const isSocketServer = scheme.includes('socket');
    if (isSocketServer) {
        protocol = production ? 'wss' : 'ws';
    }
    else {
        protocol = production ? 'https' : 'http';
    }
    const ip = process.env.SERVER_IP || '127.0.0.1';
    if (production) {
        //enforce https
        router.use((req, res, next) => {
            if (!req.secure) {
                const url = (0, common_1.getRequestUrl)(req).replace(isSocketServer ? 'ws:' : 'http:', isSocketServer ? 'wss' : 'https:');
                return res.redirect(url);
            }
            next();
        });
    }
    router.use((0, cors_1.default)({
        methods: ['GET', 'POST', 'PATCH', 'DELETE'] /*origin: "http://localhost:3000"*/,
    }));
    const proxifiers = [];
    for (const config of Object.values(serverConfig_1.default)) {
        if (config.scheme !== scheme) {
            const handler = (0, http_proxy_middleware_1.createProxyMiddleware)({
                target: `${protocol}://${ip}:${config.port}`, // The target server (CDN server)
                //changeOrigin: true, // Changes the origin of the host header to the target URL
                pathRewrite: { [`^/${scheme}`]: '' }, //pathRewrite: { [`^/${scheme}/${config.scheme}`]: '' }, // Rewrites the path to remove '/main/cdn'
                logger: Logger_1.default, // Logs for debugging; remove or set to 'error' in production
            });
            const path = `/${config.scheme}`;
            const temp = {
                path,
                handler,
            };
            proxifiers.push(temp);
        }
    }
    app.use((req, res, next) => {
        const pathname = req.url;
        const proxifier = proxifiers.find((prox) => {
            return pathname.startsWith(prox.path);
        });
        if (proxifier) {
            proxifier?.handler(req, res, next);
        }
        else {
            next();
        }
    });
    router.use(express_1.default.json({ limit: '10mb' }));
    router.use(express_1.default.urlencoded({ extended: false }));
    router.use((req, res, next) => {
        SharedConfig_1.default.set('requestUrl', (0, common_1.getRequestUrl)(req));
        const pathname = req.path;
        const proxifier = proxifiers.find((prox) => {
            return pathname.startsWith(prox.path);
        });
        if (proxifier) {
            proxifier?.handler(req, res, next);
        }
        else {
            next();
        }
    });
    app.use(`/${scheme}`, router);
    const options = (0, exports.serverCertificateOptions)();
    const server = production ? https.createServer(options, app) : http.createServer(app);
    (0, serverTerminatorEvent_1.startServerTerminatorListener)(serverName, () => {
        server.close();
        console.log('Server:', serverName, 'has been closed');
        process.exit();
    });
    addHtAccessRule({ scheme, port, protocol, ip });
    return server;
}
function addHtAccessRule({ scheme, port, protocol, ip, }) {
    const REWRITE_RULE = path_1.default.resolve(__dirname, '..', '..', '.htaccess-rewrite-rule');
    const HTACCESS = path_1.default.resolve(__dirname, '..', '..', '.htaccess');
    try {
        const rule = fs.readFileSync(REWRITE_RULE, 'utf8');
        if (!rule) {
            console.log('Error reading rewrite rule: ' + REWRITE_RULE, 'No Rule found');
        }
        else {
            const newRule = rule
                .replace(/\[SCHEME\]/g, scheme)
                .replace(/\[PROTOCOL\]/g, protocol)
                .replace(/\[PORT\]/g, `${port}`)
                .replace(/\[IP\]/g, `${ip}`);
            try {
                const htaccess = fs.readFileSync(HTACCESS, 'utf8');
                if (!htaccess) {
                    console.log('Error reading htaccess rule: ' + HTACCESS, 'No rule found in htaccess file');
                }
                else {
                    const modifiedHtaccess = htaccess
                        .split('\n')
                        .map((currentRule) => (currentRule.includes(scheme) ? newRule : currentRule))
                        .join('\n');
                    try {
                        fs.writeFileSync(HTACCESS, modifiedHtaccess);
                    }
                    catch (error) {
                        console.log('Error writing htaccess rule: ' + HTACCESS, error);
                    }
                }
            }
            catch (error) {
                console.log('Error reading htaccess rule: ' + HTACCESS, error);
            }
        }
    }
    catch (error) {
        console.log('Error reading rewrite rule: ' + REWRITE_RULE, error);
    }
}
function onClose(server, listener = async () => { }) {
    server.on('close', async () => await listener());
}
