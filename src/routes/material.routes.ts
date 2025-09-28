import { Router } from 'express';

// controller
import { MaterialController } from '../controllers/material.controller';

// middleware
import { ValidateMiddleware } from '../middlewares/validate.middleware';

// schema
import { AddMaterialSchema } from '../validations/material.schema';

// service
import { MaterialService } from '../services/material.service';
import { ClassMemberService } from '../services/class-member.service';

// lib
import { AsyncHandler } from '../lib/utils';
import { QuestionService } from '../services/question.service';

const router = Router();

const questionService = new QuestionService();
const classMemberService = new ClassMemberService();
const materialService = new MaterialService(questionService);

const materialController = new MaterialController(materialService, classMemberService);

router.post(
  '/',
  ValidateMiddleware(AddMaterialSchema),
  AsyncHandler(materialController.addMaterial)
);

router.get('/:classId/class', AsyncHandler(materialController.getMaterials));

router.get('/:materialId', AsyncHandler(materialController.getMaterial));

router.delete('/:materialId', AsyncHandler(materialController.deleteMaterial));

export { router as MaterialRouter };
