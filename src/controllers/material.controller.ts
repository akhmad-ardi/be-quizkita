import { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { MaterialService } from '../services/material.service';
import { ClassMemberService } from '../services/class-member.service';
import { ClassService } from '../services/class.service';

export class MaterialController {
  private _materialService: MaterialService;
  private _classmemberService: ClassMemberService;
  private _classService: ClassService;

  constructor(
    materialService: MaterialService,
    classMemberService: ClassMemberService,
    classService: ClassService
  ) {
    this._materialService = materialService;
    this._classmemberService = classMemberService;
    this._classService = classService;

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
    const { id: credentialId } = req.user;
    const { classId } = req.params;

    await this._classService.verifyClassExist(classId);
    await this._classmemberService.verifyClassMember({ userId: credentialId, classId });
    const _class = await this._classService.getClass(classId);
    const materials = await this._materialService.getMaterials(classId);

    return res.status(200).json({
      data: {
        class_id: _class.id,
        user_id: _class.user_id,
        class_name: _class.name,
        materials: materials.map((material) => ({
          id: material.id,
          title: material.title,
          total_questions: material.Questions.length,
          created_at: material.created_at,
        })),
      },
    });
  }

  async getMaterial(req: Request, res: Response) {
    const { materialId } = req.params;

    await this._materialService.verifyMaterialExist({ materialId });
    const material = await this._materialService.getMaterial({ materialId });

    return res.status(200).json({ data: { ...material } });
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
