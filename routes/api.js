const router = require('koa-router')()
const tasks = require('../controllers/tasks');
const categories = require('../controllers/categories');
const items = require('../controllers/items');

router.prefix('/api/v1');

router.get('/tasks', tasks.list);
router.get('/tasks-auth', tasks.listAuth); // ejemplo

router.get('/categories/:task_id', categories.list);
router.get('/items/:category_id', items.list);
router.get('/item/:item_id', items.get);

module.exports = router;
