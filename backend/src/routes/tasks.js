import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js';

const router = Router();

/**
 * GET /tasks
 */
router.get('/', (req, res, next) => {
  try {
    const tasks = TaskController.listTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /tasks/:id
 */
router.get('/:id', (req, res, next) => {
  try {
    const task = TaskController.getTask(req.params.id);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /tasks
 */
router.post('/', (req, res, next) => {
  try {
    const input = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      estimatedMinutes: req.body.estimatedMinutes,
      dueDate: req.body.dueDate,
    };

    // Validierung
    if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
      res.status(400).json({ error: 'title ist erforderlich und muss ein String sein' });
      return;
    }

    if (!input.description || typeof input.description !== 'string') {
      res.status(400).json({ error: 'description ist erforderlich und muss ein String sein' });
      return;
    }

    if (!['niedrig', 'mittel', 'hoch'].includes(input.priority)) {
      res.status(400).json({ error: 'priority muss "niedrig", "mittel" oder "hoch" sein' });
      return;
    }

    if (input.estimatedMinutes !== undefined && input.estimatedMinutes !== null) {
      if (typeof input.estimatedMinutes !== 'number' || input.estimatedMinutes < 0) {
        res.status(400).json({ error: 'estimatedMinutes muss eine positive Zahl sein' });
        return;
      }
    }

    if (input.dueDate !== undefined && input.dueDate !== null) {
      if (typeof input.dueDate !== 'string' || !isValidIsoDate(input.dueDate)) {
        res.status(400).json({ error: 'dueDate muss ein gültiges ISO-8601 Datum sein' });
        return;
      }
    }

    const task = TaskController.createTask(input);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /tasks/:id
 */
router.patch('/:id', (req, res, next) => {
  try {
    const input = req.body;

    // Validierung der optionalen Felder
    if (input.title !== undefined && (typeof input.title !== 'string' || !input.title.trim())) {
      res.status(400).json({ error: 'title muss ein nicht-leerer String sein' });
      return;
    }

    if (input.description !== undefined && typeof input.description !== 'string') {
      res.status(400).json({ error: 'description muss ein String sein' });
      return;
    }

    if (input.status !== undefined && !['offen', 'in_arbeit', 'erledigt'].includes(input.status)) {
      res.status(400).json({ error: 'status muss "offen", "in_arbeit" oder "erledigt" sein' });
      return;
    }

    if (input.priority !== undefined && !['niedrig', 'mittel', 'hoch'].includes(input.priority)) {
      res.status(400).json({ error: 'priority muss "niedrig", "mittel" oder "hoch" sein' });
      return;
    }

    if (input.estimatedMinutes !== undefined && input.estimatedMinutes !== null) {
      if (typeof input.estimatedMinutes !== 'number' || input.estimatedMinutes < 0) {
        res.status(400).json({ error: 'estimatedMinutes muss eine positive Zahl sein' });
        return;
      }
    }

    if (input.actualMinutes !== undefined && input.actualMinutes !== null) {
      if (typeof input.actualMinutes !== 'number' || input.actualMinutes < 0) {
        res.status(400).json({ error: 'actualMinutes muss eine positive Zahl sein' });
        return;
      }
    }

    if (input.dueDate !== undefined && input.dueDate !== null) {
      if (typeof input.dueDate !== 'string' || !isValidIsoDate(input.dueDate)) {
        res.status(400).json({ error: 'dueDate muss ein gültiges ISO-8601 Datum sein' });
        return;
      }
    }

    const task = TaskController.updateTask(req.params.id, input);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /tasks/:id
 */
router.delete('/:id', (req, res, next) => {
  try {
    TaskController.deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * Prüft, ob ein String ein gültiges ISO-8601 Datum ist.
 */
function isValidIsoDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export default router;
