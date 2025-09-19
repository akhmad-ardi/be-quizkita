import type { Request, Response } from 'express';
import autoBind from 'auto-bind';
import { ClassService } from '../services/class.service';
import { UserService } from '../services/user.service';
import { ClassMemberService } from '../services/class-member.service';

export class ClassController {
  private _classService: ClassService;
  private _classMemberService: ClassMemberService;
  private _userService: UserService;

  constructor(
    classService: ClassService,
    classMemberService: ClassMemberService,
    userService: UserService
  ) {
    this._classService = classService;
    this._classMemberService = classMemberService;
    this._userService = userService;

    autoBind(this);
  }

  async addClass(req: Request, res: Response) {
    const { name } = req.body;
    const { id: credentialId } = req.user;

    const _class = await this._classService.addClass(name);
    await this._classMemberService.addClassMember(credentialId, _class.id);

    return res.status(201).json({ class_id: _class.id, message: 'successfully added the class' });
  }

  async joinClass(req: Request, res: Response) {
    const { invite_code } = req.body;
    const { id: credentialId } = req.user;

    await this._classService.verifyClassExist(invite_code);
    await this._classService.verifyUserInClass(credentialId, invite_code);
    await this._classMemberService.addClassMember(credentialId, invite_code);

    return res.status(200).json({ message: 'successfully joined the class' });
  }

  async addUserToClass(req: Request, res: Response) {
    const { username } = req.body;
    const { classId } = req.params;

    await this._userService.verifyUserExist(username);

    const user = await this._userService.getUser(username);

    await this._classService.verifyClassExist(classId);
    await this._classService.verifyUserInClass(user.id, classId);
    await this._classMemberService.addClassMember(user.id, classId);

    return res.status(200).json({ message: 'successfully add user to class' });
  }

  async getClasses(req: Request, res: Response) {
    const { id: credentialId } = req.user;

    const classes = await this._classService.getClasses(credentialId);

    return res.status(200).json({ data: { classes } });
  }
}
