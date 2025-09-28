import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { DB } from '../lib/db';
import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';
import { ClassMemberService } from '../services/class-member.service';
import { MaterialService } from '../services/material.service';

export class ClassController {
  private _classService: ClassService;
  private _classMemberService: ClassMemberService;
  private _userService: UserService;
  private _materialService: MaterialService;

  constructor(
    classService: ClassService,
    classMemberService: ClassMemberService,
    userService: UserService,
    materialService: MaterialService
  ) {
    this._classService = classService;
    this._classMemberService = classMemberService;
    this._userService = userService;
    this._materialService = materialService;

    autoBind(this);
  }

  async addClass(req: Request, res: Response) {
    const { name } = req.body;
    const { id: credentialId } = req.user;

    const _class = await this._classService.addClass(credentialId, name);

    return res.status(201).json({ class_id: _class.id, message: 'successfully added the class' });
  }

  async joinClass(req: Request, res: Response) {
    const { invite_code } = req.body;
    const { id: credentialId } = req.user;

    await this._classService.verifyClassExist(invite_code);
    await this._classMemberService.verifyClassMemberAlreadyExist({
      classId: invite_code,
      userId: credentialId,
    });
    await this._classMemberService.addClassMember({ classId: invite_code, userId: credentialId });

    return res.status(200).json({ message: 'successfully joined the class' });
  }

  async addUserToClass(req: Request, res: Response) {
    const { username } = req.body;
    const { classId } = req.params;

    await this._userService.verifyUserExist(username);

    const user = await this._userService.getUser(username);

    await this._classService.verifyClassExist(classId);
    await this._classMemberService.verifyClassMemberAlreadyExist({
      classId: classId,
      userId: user.id,
    });
    await this._classMemberService.addClassMember({ userId: user.id, classId: classId });

    return res.status(200).json({ message: 'successfully add user to class' });
  }

  async getClasses(req: Request, res: Response) {
    const { id: credentialId } = req.user;

    const classes = await this._classService.getClasses(credentialId);

    return res.status(200).json({ data: { classes } });
  }

  async deleteClass(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { classId } = req.params;

    await this._classService.verifyClassExist(classId);
    await this._classService.verifyClassOwner({ classId, userId: credentialId });
    await this._classService.deleteClass(classId);

    return res.status(200).json({ message: 'successfully delete class' });
  }

  async deleteClassMember(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { classId } = req.params;
    const { user_id } = req.body;

    await this._classService.verifyClassExist(classId);
    await this._classService.verifyClassOwner({ classId, userId: credentialId });
    await this._classMemberService.verifyClassMemberAlreadyExist({ classId, userId: user_id });
    await this._classMemberService.deleteClassMember({ classId, userId: user_id });

    return res.status(200).json({ message: 'successfullly delete class member' });
  }

  async getLeaderboard(req: Request, res: Response) {
    const { id: credentialId } = req.user;
    const { classId } = req.params;

    await this._classService.verifyClassExist(classId);
    await this._classMemberService.verifyClassMember({ classId, userId: credentialId });

    const classData = await this._classService.getClass(classId);

    const classMembers = await this._classMemberService.getClassMembers(classId);
    const memberIds = classMembers.map((cm) => cm.user_id);

    const userIds = Array.from(new Set([...memberIds, classData.user_id]));

    const materials = await this._materialService.getMaterials(classId);
    const materialIds = materials.map((m) => m.id);

    const scores = await DB.userQuizResults.groupBy({
      by: ['user_id'],
      where: {
        user_id: { in: userIds },
        material_id: { in: materialIds },
      },
      _sum: { score: true },
    });

    const users = await DB.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true, fullname: true },
    });

    const leaderboard = users.map((u) => {
      const s = scores.find((sc) => sc.user_id === u.id);
      return {
        user_id: u.id,
        username: u.username,
        fullname: u.fullname,
        total_score: s?._sum.score ?? 0,
      };
    });

    return res
      .status(200)
      .json({ data: { leaderboard: leaderboard.sort((a, b) => b.total_score - a.total_score) } });
  }
}
