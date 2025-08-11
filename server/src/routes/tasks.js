import { Router } from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { createTaskSchema, updateTaskSchema, listQuerySchema } from '../validators/taskSchemas.js';

const router = Router();

// All task routes require auth
router.use(requireAuth);

// Create
router.post('/', async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        ownerId: req.user.id
      }
    });
    return res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

// List with pagination + search
router.get('/', async (req, res, next) => {
  try {
    const parsed = listQuerySchema.parse(req.query);
    const { page, limit, q } = parsed;

    const where = {
      ownerId: req.user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } }
            ]
          }
        : {})
    };

    const [total, items] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return res.json({
      items,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (err) {
    next(err);
  }
});

// Get by id (owner scoped)
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

    const task = await prisma.task.findFirst({ where: { id, ownerId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Not found' });

    return res.json({ task });
  } catch (err) {
    next(err);
  }
});

// Update (owner scoped)
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });

    const { count } = await prisma.task.updateMany({
      where: { id, ownerId: req.user.id },
      data: parsed.data
    });
    if (count === 0) return res.status(404).json({ error: 'Not found' });

    const task = await prisma.task.findUnique({ where: { id } });
    return res.json({ task });
  } catch (err) {
    next(err);
  }
});

// Delete (owner scoped)
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

    const { count } = await prisma.task.deleteMany({ where: { id, ownerId: req.user.id } });
    if (count === 0) return res.status(404).json({ error: 'Not found' });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
