const { Router } = require('express')
const { check } = require('express-validator')

const {
  fieldValidator,
  haveRole,
  isAdminRole,
  jwtValidator
} = require('../middlewares')

const {
  isValidRole,
  isIdAssignedToUser,
  isEmailDuplicated
} = require('../helpers/db.helpers')

const {
  getUsers,
  createUsers,
  editUsers,
  deleteUsers
} = require('../controllers/user.controller')

const router = Router()

router.get('/', getUsers)
router.post(
  '/',
  [
    check('name', 'Name is mandatory').not().isEmpty(),
    check(
      'password',
      'Password is mandatory and must have more than 6 letters'
    ).isLength({ min: 6 }),
    check('email', 'Invalid email structure').isEmail(),
    check('email').custom(isEmailDuplicated),
    check('role').custom(isValidRole),
    fieldValidator
  ],
  createUsers
)
router.put(
  '/:id',
  [
    check('id', 'It is not a valid email').isMongoId(),
    check('id').custom(isIdAssignedToUser),
    check('role').custom(isValidRole),
    fieldValidator
  ],
  editUsers
)
router.delete(
  '/:id',
  [
    jwtValidator,
    isAdminRole,
    haveRole('ADMIN', 'VENTAS', 'SALES', 'USER'),
    check('id', 'It is not a valid email').isMongoId(),
    check('id').custom(isIdAssignedToUser),
    fieldValidator
  ],
  deleteUsers
)

module.exports = router
