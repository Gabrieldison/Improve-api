import { readBody } from "@/shared/utils/ready-body";
import * as http from "http";
import { areaService } from "./area.service";

export const areaController = {
  async create(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const area = await areaService.createArea(
        JSON.parse(await readBody(req))
      );

      res.writeHead(201, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: true,
          message: "Area created successfully",
          data: area,
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: false,
          message: "Failed to create area",
          error: (error as Error).message,
        })
      );
    }
  },

  async show(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const area = await areaService.getAreaById(
        (JSON.parse(await readBody(req)) as { id: string }).id
      );

      res.writeHead(200, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: true,
          message: "Area fetched successfully",
          data: area,
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Failed to fetch area",
          error: (error as Error).message,
        })
      );
    }
  },

  async list(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const areas = await areaService.getAllAreas();

      res.writeHead(200, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: true,
          message: "Areas fetched successfully",
          data: areas,
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Failed to fetch areas",
          error: (error as Error).message,
        })
      );
    }
  },

  async update(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const { id, ...data } = JSON.parse(await readBody(req)) as {
        id: string;
        name: string;
        description?: string;
      };

      const area = await areaService.updateArea(id, data);

      res.writeHead(200, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: true,
          message: "Area updated successfully",
          data: area,
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "Failed to update area",
          error: (error as Error).message,
        })
      );
    }
  },

  async delete(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      const { id } = JSON.parse(await readBody(req)) as { id: string };

      const { success, message } = await areaService.deleteArea(id);

      res.writeHead(200, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: true,
          message: "Area deleted successfully",
          data: { success, message },
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });

      res.end(
        JSON.stringify({
          success: false,
          message: "Failed to delete area",
          error: (error as Error).message,
        })
      );
    }
  },
};
