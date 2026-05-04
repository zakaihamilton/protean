import { useEffect, useRef } from 'react';
import Node from 'src/Core/Base/Node';
import { createState } from 'src/Core/Base/State';

export const TaskStore = createState('TaskStore');

export function TaskManager({ children }) {
  const store = TaskStore.useState(null, {
    tasks: {},
    run: (targetId) => {
      // 1. Wrap the execution in a Promise so it can be awaited
      return new Promise((resolve, reject) => {
        let notFound = false;

        store((draft) => {
          const tasks = draft.tasks;
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

          Object.values(tasks).forEach((t) => {
            if (targetPath.has(t.id) || isDescendant(t.id, targetId)) {
              t.status = 'idle';
              t.progress = 0;
              t.error = null;
            } else {
              if (t.status !== 'success') {
                t.status = 'skipped';
              }
            }
          });
        });

        if (notFound) {
          const errMsg = `Task "${targetId}" not found in registry.`;
          console.warn(errMsg);
          reject(new Error(errMsg));
          return;
        }

        // 2. Subscribe to the Proxy store to listen for the task's completion
        const handlerId = `run_${targetId}_${Math.random().toString(36).slice(2)}`;

        const checkStatus = () => {
          const task = store.tasks[targetId];
          if (!task) return;

          if (task.status === 'success') {
            store.__unmonitor(null, checkStatus, handlerId);
            resolve();
          } else if (task.status === 'error') {
            store.__unmonitor(null, checkStatus, handlerId);
            // Throw the explicit error that bubbled up
            reject(new Error(task.error || `Task "${targetId}" failed.`));
          }
        };

        // Attach the listener. It will evaluate every time the proxy updates.
        store.__monitor(null, checkStatus, handlerId);
      });
    },
  });

  const executing = useRef(new Set());

  useEffect(() => {
    if (!store.tasks) return;
    const tasks = Object.values(store.tasks);

    const setTaskState = (id, updates) => {
      store((draft) => {
        draft.tasks = {
          ...draft.tasks,
          [id]: { ...draft.tasks[id], ...updates },
        };
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

    for (const task of tasks) {
      if (
        task.status === 'idle' &&
        !executing.current.has(`${task.id}_before`)
      ) {
        const depsMet = task.dependencies.every((depId) =>
          ['success', 'skipped'].includes(store.tasks[depId]?.status),
        );

        const parentStatus = task.parentId
          ? store.tasks[task.parentId]?.status
          : null;
        const parentMet =
          !parentStatus ||
          ['waiting_children', 'success', 'skipped'].includes(parentStatus);

        let sequentialMet = true;
        if (task.parentId && store.tasks[task.parentId]?.parallel === false) {
          const olderSiblings = tasks.filter(
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

          Promise.resolve(task.before ? task.before(report) : null)
            .then(() => setTaskState(task.id, { status: 'waiting_children' }))
            .catch((err) => triggerError(task, err.message))
            .finally(() => executing.current.delete(`${task.id}_before`));
        }
      }

      if (
        task.status === 'waiting_children' &&
        !executing.current.has(`${task.id}_after`)
      ) {
        const children = tasks.filter((t) => t.parentId === task.id);
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

          Promise.resolve(task.after ? task.after(report) : null)
            .then(() =>
              setTaskState(task.id, { status: 'success', progress: 100 }),
            )
            .catch((err) => triggerError(task, err.message))
            .finally(() => executing.current.delete(`${task.id}_after`));
        }
      }
    }
  }, [store, store.tasks]);

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
    parentNodeId && parentNodeId !== 'root' ? parentNodeId : null;
  const absoluteId = implicitParentId ? `${implicitParentId}/${id}` : id;

  useEffect(() => {
    store((draft) => {
      if (!draft.tasks) draft.tasks = {};

      const siblingsCount = Object.values(draft.tasks).filter(
        (t) => t.parentId === implicitParentId,
      ).length;

      const resolvedDependencies = dependencies.map((dep) =>
        !dep.includes('/') && implicitParentId
          ? `${implicitParentId}/${dep}`
          : dep,
      );

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
          index: draft.tasks[absoluteId]?.index ?? siblingsCount,
          status:
            draft.tasks[absoluteId]?.status || (autoStart ? 'idle' : 'dormant'),
          progress: draft.tasks[absoluteId]?.progress || 0,
          error: draft.tasks[absoluteId]?.error || null,
        },
      };
    });
  }, [
    absoluteId,
    implicitParentId,
    before,
    after,
    onError,
    dependencies,
    parallel,
    autoStart,
    store,
  ]);

  return <Node id={absoluteId}>{children}</Node>;
}
