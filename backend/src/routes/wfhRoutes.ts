import express from 'express';
import { createWFHRequest } from '../controllers/wfh/request.controller';
import { updateWFHStatus } from '../controllers/wfh/update.controller';

import { getMyWFHRequests } from '../controllers/wfh/myRequest.controller';

import { authenticate } from '../middleware/auth.middleware';
import { authorize,ROLES } from '../middleware/role.middleware';
import { createWFHRequestValidation } from '../validations/wfh/request.validation';
import { updateWFHStatusValidation } from '../validations/wfh/update.validation';
import { getAllWFHRequests } from '../controllers/wfh/allRequest.controller';

const router = express.Router();

router.post('/create', authenticate, createWFHRequestValidation, createWFHRequest);

router.put(
  '/update-status/:Emp_id',
  authenticate,
  authorize(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN),
  updateWFHStatusValidation,
  updateWFHStatus
);

router.get('/my-requests', authenticate, getMyWFHRequests);

router.get(
  '/all-requests',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER),
  getAllWFHRequests
);

export default router;