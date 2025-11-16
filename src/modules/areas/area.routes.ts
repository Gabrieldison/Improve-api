import { app } from "@/shared/infra/http/app";
import { areaController } from "./area.controller";

export function registerAreaRoutes() {
  app.get("/areas", areaController.list);
  app.post("/areas", areaController.create);
  app.put("/areas", areaController.update);
  app.del("/areas", areaController.delete);
}
