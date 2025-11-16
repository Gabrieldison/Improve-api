import http from "http";

type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => Promise<void>;

async function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", reject);
  });
}

function createApp() {
  const routes: Record<string, RouteHandler> = {}; // Record is a type that represents a record of a key-value pair, where the key is a string and the value is a RouteHandler (function)

  let server: http.Server;

  server = http.createServer(async (req, res) => {
    const method = req.method || "GET";
    const url = req.url?.split("?")[0] || "/";
    const routeKey = `${method} ${url}`;

    const handler = routes[routeKey];

    if (!handler) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });

  const get = (path: string, handler: RouteHandler) => {
    routes[`GET ${path}`] = handler;
  };

  const post = (path: string, handler: RouteHandler) => {
    routes[`POST ${path}`] = handler;
  };

  const put = (path: string, handler: RouteHandler) => {
    routes[`PUT ${path}`] = handler;
  };

  const del = (path: string, handler: RouteHandler) => {
    routes[`DELETE ${path}`] = handler;
  };

  const patch = (path: string, handler: RouteHandler) => {
    routes[`PATCH ${path}`] = handler;
  };

  const listen = (port: number, callback?: () => void) => {
    server.listen(port, callback);
  };

  return {
    get,
    post,
    listen,
    put,
    del,
    patch,
  };
}

export const app = createApp();

export { readBody };

