import { pool } from "@/shared/infra/database/connection";
import { Area, CreateAreaDTO, UpdateAreaDTO } from "./area.entity";

export const areaRepository = {
  async create(data: CreateAreaDTO): Promise<Area> {
    const result = await pool.query(
      "INSERT INTO areas (name, description) VALUES ($1, $2) RETURNING *",
      [data.name, data.description || null]
    );
    return result.rows[0];
  },

  async findAll(): Promise<Area[]> {
    const result = await pool.query("SELECT * FROM areas");
    return result.rows;
  },

  async findById(id: string): Promise<Area> {
    const result = await pool.query("SELECT * FROM areas WHERE id = $1", [id]);
    return result.rows[0];
  },

  async findByName(name: string): Promise<Area> {
    const result = await pool.query("SELECT * FROM areas WHERE name = $1", [
      name,
    ]);
    return result.rows[0];
  },

  async update(id: string, data: UpdateAreaDTO): Promise<Area> {
    const fields = Object.keys(data);

    if (fields.length === 0) {
      throw new Error("No fields provided for update");
    }

    const setClauses = fields.map((field, index) => `${field} = $${index + 1}`);

    const values = Object.values(data);

    const query = `
      UPDATE areas
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);

    return result.rows[0];
  },

  async delete(id: string): Promise<Area> {
    const result = await pool.query("DELETE FROM areas WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      throw new Error("Area not found to delete");
    }

    return result.rows[0];
  },
};
