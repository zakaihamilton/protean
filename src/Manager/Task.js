import { useEffect, useRef } from 'react';
import Node from '@/Core/Base/Node';
import { createState } from '@/Core/Base/State';

export const TaskStore = createState('TaskStore');

export function TaskManager({ children }) {
  const executing = useRef(new Set());
  const abortControllers = useRef(new Map());

  const store = TaskStore.useState(null, {
    tasks: {},
    activeIds: [],
    run: (targetId) => {
      return new Promise((resolve, reject) => {
        let notFound = false;

        store((draft) => {
          const tasks = { ...draft.tasks };
          if (!tasks[targetId]) {
            notFound = true;
            return;
          }

          const targetPath = new Set();
          let curr = targetId;
          while (curr) {
            targetPath.add(curr);
            curr = tasks[curr]?.parentId;
          }

          const isDescendant = (id, ancestorId) => {
            let p = tasks[id]?.parentId;
            while (p) {
              if (p === ancestorId) return true;
              p = tasks[p]?.parentId;
            }
            return false;
          };

          for (const id of Object.keys(tasks)) {
            const t = { ...tasks[id] };
            if (targetPath.has(t.id) || isDescendant(t.id, targetId)) {
              t.status = 'idle';
              t.progress = 0;
              t.error = null;
              if (!draft.activeIds.includes(t.id)) {
                draft.activeIds = [...draft.activeIds, t.id];
              }
            } else {
              if (t.status !== 'success') {
                t.status = 'skipped';
                if (!draft.activeIds.includes(t.id)) {
                  draft.activeIds = [...draft.activeIds, t.id];
                }
              }
            }
            tasks[id] = t;
          }
          draft.tasks = tasks;
        });

        if (notFound) {
          const errMsg = `Task "${targetId}" not found in registry.`;
          console.warn(errMsg);
          reject(new Error(errMsg));
          return;
        }

        const handlerId = `run_${targetId}_${Math.random().toString(36).slice(2)}`;

        const checkStatus = () => {
          const task = store.tasks[targetId];
          if (!task) return;

          if (task.status === 'success') {
            store.__unmonitor(null, checkStatus, handlerId);
            resolve();
          } else if (task.status === 'error') {
            store.__unmonitor(null, checkStatus, handlerId);
            reject(new Error(task.error || `Task "${targetId}" failed.`));
          }
        };

        store.__monitor(null, checkStatus, handlerId);
      });
    },

    cancel: (targetId) => {
      store((draft) => {
        const tasks = { ...draft.tasks };
        if (!tasks) return;

        const idsToCancel = new Set([targetId]);
        let changed = true;
        while (changed) {
          changed = false;
          for (const t of Object.values(tasks)) {
            if (
              t.parentId &&
              idsToCancel.has(t.parentId) &&
              !idsToCancel.has(t.id)
            ) {
              idsToCancel.add(t.id);
              changed = true;
            }
          }
        }

        for (const id of idsToCancel) {
          if (abortControllers.current.has(id)) {
            abortControllers.current.get(id).abort();
            abortControllers.current.delete(id);
          }
          delete tasks[id];
        }

        draft.tasks = tasks;
        if (draft.activeIds) {
          draft.activeIds = draft.activeIds.filter(
            (aId) => !idsToCancel.has(aId),
          );
        }
      });
    },
  });

  // Biome Fix: Alias store properties to prevent exhaustive-deps dot notation warnings
  const tasks = store.tasks;
  const activeIds = store.activeIds;

  useEffect(() => {
    if (!tasks || !activeIds) return;

    const idsToRemove = new Set();

    const setTaskState = (id, updates) => {
      store((draft) => {
        if (draft.tasks[id]) {
          draft.tasks = {
            ...draft.tasks,
            [id]: { ...draft.tasks[id], ...updates },
          };
        }
      });
    };

    const triggerError = async (task, errorMessage) => {
      setTaskState(task.id, { status: 'error', error: errorMessage });
      if (task.onError) {
        try {
          await task.onError(new Error(errorMessage));
        } catch (e) {
          console.error(`Error in onError callback for task ${task.id}:`, e);
        }
      }
    };

    for (const taskId of activeIds) {
      const task = tasks[taskId];

      if (!task) {
        idsToRemove.add(taskId);
        continue;
      }

      if (['success', 'error', 'skipped'].includes(task.status)) {
        idsToRemove.add(taskId);
        continue;
      }

      // PHASE 1: IDLE -> RUNNING_BEFORE
      if (
        task.status === 'idle' &&
        !executing.current.has(`${task.id}_before`)
      ) {
        const depsMet = task.dependencies.every((depId) =>
          ['success', 'skipped'].includes(tasks[depId]?.status),
        );

        const parentStatus = task.parentId
          ? tasks[task.parentId]?.status
          : null;
        const parentMet =
          !parentStatus ||
          ['waiting_children', 'success', 'skipped'].includes(parentStatus);

        let sequentialMet = true;
        if (task.parentId && tasks[task.parentId]?.parallel === false) {
          const olderSiblings = Object.values(tasks).filter(
            (t) => t.parentId === task.parentId && t.index < task.index,
          );
          sequentialMet = olderSiblings.every((t) =>
            ['success', 'skipped'].includes(t.status),
          );
        }

        if (depsMet && parentMet && sequentialMet) {
          executing.current.add(`${task.id}_before`);
          setTaskState(task.id, { status: 'running_before' });

          const report = (progress) => setTaskState(task.id, { progress });

          const controller = new AbortController();
          abortControllers.current.set(task.id, controller);

          Promise.resolve(
            task.before ? task.before(report, controller.signal) : null,
          )
            .then(() => setTaskState(task.id, { status: 'waiting_children' }))
            .catch((err) => {
              if (err.name === 'AbortError') return;
              triggerError(task, err.message);
            })
            .finally(() => {
              abortControllers.current.delete(task.id);
              executing.current.delete(`${task.id}_before`);
            });
        }
      }

      // PHASE 2: WAITING_CHILDREN -> RUNNING_AFTER
      if (
        task.status === 'waiting_children' &&
        !executing.current.has(`${task.id}_after`)
      ) {
        const children = Object.values(tasks).filter(
          (t) => t.parentId === task.id,
        );
        const childError = children.find((t) => t.status === 'error');

        if (childError) {
          if (!executing.current.has(`${task.id}_error`)) {
            executing.current.add(`${task.id}_error`);
            triggerError(
              task,
              `Child task '${childError.id}' failed: ${childError.error}`,
            ).finally(() => executing.current.delete(`${task.id}_error`));
          }
          continue;
        }

        const childrenMet = children.every((t) =>
          ['success', 'skipped'].includes(t.status),
        );

        if (childrenMet) {
          executing.current.add(`${task.id}_after`);
          setTaskState(task.id, { status: 'running_after' });

          const report = (progress) => setTaskState(task.id, { progress });

          const controller = new AbortController();
          abortControllers.current.set(task.id, controller);

          Promise.resolve(
            task.after ? task.after(report, controller.signal) : null,
          )
            .then(() =>
              setTaskState(task.id, { status: 'success', progress: 100 }),
            )
            .catch((err) => {
              if (err.name === 'AbortError') return;
              triggerError(task, err.message);
            })
            .finally(() => {
              abortControllers.current.delete(task.id);
              executing.current.delete(`${task.id}_after`);
            });
        }
      }
    }

    if (idsToRemove.size > 0) {
      store((draft) => {
        draft.activeIds = draft.activeIds.filter((id) => !idsToRemove.has(id));
      });
    }
  }, [store, tasks, activeIds]); // Biome Fix: Clean dependencies utilizing scoped consts

  return children;
}

const EMPTY_ARRAY = [];

export function Task({
  id,
  before,
  after,
  onError,
  dependencies = EMPTY_ARRAY,
  parallel = false,
  autoStart = true,
  children,
}) {
  const store = TaskStore.useState();

  const parentNode = Node.useNode();
  const parentNodeId = parentNode?.id;
  const implicitParentId =
    parentNodeId && parentNodeId !== 'root' && parentNodeId !== 'TaskEngineRoot'
      ? parentNodeId
      : null;
  const absoluteId = implicitParentId ? `${implicitParentId}/${id}` : id;

  // 1. Maintain latest callbacks without triggering unmount/re-registration
  useEffect(() => {
    store((draft) => {
      if (draft.tasks?.[absoluteId]) {
        draft.tasks = {
          ...draft.tasks,
          [absoluteId]: {
            ...draft.tasks[absoluteId],
            before,
            after,
            onError,
          },
        };
      }
    });
  }, [before, after, onError, absoluteId, store]);

  // 2. Register task structure and handle unmount garbage collection
  const depsString = JSON.stringify(dependencies);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Callbacks are kept fresh via the above effect to prevent unmount loops
  useEffect(() => {
    store((draft) => {
      if (!draft.tasks) draft.tasks = {};
      if (!draft.activeIds) draft.activeIds = [];

      const siblingsCount = Object.values(draft.tasks).filter(
        (t) => t.parentId === implicitParentId,
      ).length;

      const resolvedDependencies = JSON.parse(depsString).map((dep) =>
        !dep.includes('/') && implicitParentId
          ? `${implicitParentId}/${dep}`
          : dep,
      );

      if (!draft.tasks[absoluteId]) {
        // Initial Registration
        draft.tasks = {
          ...draft.tasks,
          [absoluteId]: {
            id: absoluteId,
            parentId: implicitParentId,
            before,
            after,
            onError,
            dependencies: resolvedDependencies,
            parallel,
            index: siblingsCount,
            status: autoStart ? 'idle' : 'dormant',
            progress: 0,
            error: null,
          },
        };
      } else {
        // Safe update for dependencies and config
        draft.tasks = {
          ...draft.tasks,
          [absoluteId]: {
            ...draft.tasks[absoluteId],
            dependencies: resolvedDependencies,
            parallel,
          },
        };
      }

      if (!draft.activeIds.includes(absoluteId)) {
        draft.activeIds = [...draft.activeIds, absoluteId];
      }
    });

    return () => {
      store.cancel(absoluteId);
    };
  }, [absoluteId, implicitParentId, depsString, parallel, autoStart, store]);

  return <Node id={absoluteId}>{children}</Node>;
}
