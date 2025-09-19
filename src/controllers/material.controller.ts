import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { MaterialService } from '../services/material.service';

export class MaterialController {
  private _materialService: MaterialService;

  constructor(materialService: MaterialService) {
    this._materialService = materialService;

    autoBind(this);
  }

  async addMaterial(req: Request, res: Response) {
    const { class_id, title, content } = req.body;
    const { id: credentialId } = req.user;

    /**
     * - Add material
     * - Generate questions
     */

    return res.status(201).json({ id: 'material-id', message: 'successfully added the material' });
  }

  async getMaterials(req: Request, res: Response) {
    const { classId } = req.params;

    return res.status(200).json({ data: { materials: [] } });
  }

  async getMaterial(req: Request, res: Response) {
    const { materialId } = req.params;

    return res.status(200).json({ data: { material: {} } });
  }
}
