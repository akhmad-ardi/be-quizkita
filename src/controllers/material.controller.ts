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
    const { id: credentialId } = req.user;
    const { class_id, title, content } = req.body;

    const { material_id } = await this._materialService.addMaterial({
      userId: credentialId,
      classId: class_id,
      title,
      content,
    });

    return res.status(201).json({ material_id, message: 'successfully added the material' });
  }

  async getMaterials(req: Request, res: Response) {
    const { credentialId } = req.user;
    const { classId } = req.params;

    const materials = await this._materialService.getMaterials({ userId: credentialId, classId });

    return res.status(200).json({ data: { materials } });
  }

  async getMaterial(req: Request, res: Response) {
    const { materialId } = req.params;

    await this._materialService.verifyMaterialExist({ materialId });
    const material = await this._materialService.getMaterial({ materialId });

    return res.status(200).json({ data: { material } });
  }

  async deleteMaterial(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { materialId } = req.params;

    // delete material
    await this._materialService.verifyMaterialExist({ materialId });
    await this._materialService.verifyMaterialOwner({ userId: credentialId, materialId });
    await this._materialService.deleteMaterial({ userId: credentialId, materialId });

    return res.status(200).json({ message: 'successfully delete material' });
  }
}
