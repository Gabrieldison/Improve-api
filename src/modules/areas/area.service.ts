import { Area, CreateAreaDTO, UpdateAreaDTO } from "./area.entity";
import { areaRepository } from "./area.repository";

export const areaService = {
  async createArea(data: CreateAreaDTO): Promise<Partial<Area>> {
    if (!data.name || !data.description) {
      throw new Error("Name and description of a area are required");
    }

    const existingArea = await areaRepository.findByName(data.name);

    if (existingArea) {
      throw new Error("Area with this name already exists");
    }

    const area = await areaRepository.create({
      name: data.name,
      description: data.description,
    });

    return {
      id: area.id,
      name: area.name,
      description: area.description,
    };
  },

  async updateArea(id: string, data: UpdateAreaDTO): Promise<Area> {
    const existingArea = await areaRepository.findById(id);

    if (!existingArea) {
      throw new Error("Area not found to update");
    }

    if (!data.name && !data.description) {
      throw new Error("Name and description of a area are required");
    }

    const updatedArea = await areaRepository.update(id, {
      name: data.name ?? existingArea.name,
      description: data.description ?? existingArea.description,
    });

    if (!updatedArea) {
      throw new Error("Failed to update area");
    }

    return {
      id: updatedArea.id,
      name: updatedArea.name,
      description: updatedArea.description,
    };
  },

  async deleteArea(id: string): Promise<{ success: boolean; message: string }> {
    const existingArea = await areaRepository.findById(id);

    if (!existingArea) {
      throw new Error("Area not found to delete");
    }

    await areaRepository.delete(id);

    return {
      success: true,
      message: "Area deleted successfully",
    };
  },

  async getAreaById(id: string): Promise<Area> {
    const area = await areaRepository.findById(id);

    if (!area) {
      throw new Error("Area not found");
    }

    return {
      id: area.id,
      name: area.name,
      description: area.description,
    };
  },

  async getAllAreas(): Promise<Area[]> {
    const areas = await areaRepository.findAll();

    if (areas.length === 0) {
      throw new Error("No areas found");
    }

    return areas.map((area) => ({
      id: area.id,
      name: area.name,
    }));
  },

  async findByName(name: string): Promise<Area> {
    const area = await areaRepository.findByName(name);

    if (!area) {
      throw new Error("Area with this name not found");
    }

    return {
      id: area.id,
      name: area.name,
      description: area.description,
    };
  },
};
