import express from 'express'
import { checkToken } from '../Services/Token.js';
import { memberController } from '../Controllers/MemberController.js'
import { upload } from '../Services/MulterConfig.js'
const router = express.Router();

// HTTP POST
router.route('/create')
    .post(upload.single('profilePicture'), (req, res) => 
        memberController.createMember(req,res));

// HTTP GET
router.route('/get-all-members')
    .get(checkToken, (req,res) => memberController.getAllMembers(req,res));

// HTTP GET 
router.route('/get-photo')
    .get(checkToken, (req, res) => memberController.getPictureMember(req, res));

// HTTP DELETE
router.route('/delete-member')
    .delete(checkToken, async (req, res) => memberController.deleteMember(req, res));

// HTTP PATCH
router.route('/patch-member')
    .patch(checkToken, async (req, res) => memberController.patchMember(req, res));

// HTTP PUT
router.route('/put-member')
    .put(checkToken, (req, res) => memberController.putMember(req, res));

export default router;