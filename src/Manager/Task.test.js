import { act, render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import Node from 'src/Core/Base/Node';
import { Task, TaskManager, TaskStore } from './Task';

// Helper component to extract the store state for assertions without DOM querying
function StateObserver({ onStateChange }) {
  const store = TaskStore.useState();
  useEffect(() => {
    if (store.tasks) {
      onStateChange(store.tasks);
    }
  }, [store.tasks, onStateChange]);
  return null;
}

// Utility to create trackable, resolvable async mocks
const createTrackableAction = () => {
  let resolvePromise;
  let rejectPromise;
  const promise = new Promise((res, rej) => {
    resolvePromise = res;
    rejectPromise = rej;
  });

  const mock = jest.fn(() => promise);
  mock.resolve = resolvePromise;
  mock.reject = rejectPromise;
  return mock;
};

describe('TaskManager & Task Architecture', () => {
  beforeEach(() => {
    Node.resetRoot();
  });

  it('1. executes a standalone task with before and after callbacks', async () => {
    const beforeMock = createTrackableAction();
    const afterMock = createTrackableAction();
    let currentState = {};

    render(
      <TaskManager>
        <StateObserver
          onStateChange={(state) => {
            currentState = state;
          }}
        />
        <Task id="simple" before={beforeMock} after={afterMock} />
      </TaskManager>,
    );

    // Initial state check
    await waitFor(() =>
      expect(currentState.simple?.status).toBe('running_before'),
    );
    expect(beforeMock).toHaveBeenCalledTimes(1);
    expect(afterMock).not.toHaveBeenCalled();

    // Resolve 'before', should trigger 'after'
    await act(async () => {
      beforeMock.resolve();
    });

    await waitFor(() =>
      expect(currentState.simple?.status).toBe('running_after'),
    );
    expect(afterMock).toHaveBeenCalledTimes(1);

    // Resolve 'after', should reach 'success'
    await act(async () => {
      afterMock.resolve();
    });

    await waitFor(() => expect(currentState.simple?.status).toBe('success'));
  });

  it('2. generates absolute IDs and respects parallel hierarchy', async () => {
    const parentBefore = createTrackableAction();
    const childBefore = createTrackableAction();

    render(
      <TaskManager>
        <Task id="parent" before={parentBefore}>
          <Task id="child" before={childBefore} />
        </Task>
      </TaskManager>,
    );

    // Parent should run first
    await waitFor(() => expect(parentBefore).toHaveBeenCalledTimes(1));
    expect(childBefore).not.toHaveBeenCalled();

    // Finish parent before
    await act(async () => {
      parentBefore.resolve();
    });

    // Child should now run, verifying absolute ID path
    await waitFor(() => expect(childBefore).toHaveBeenCalledTimes(1));

    // Check state registry to ensure ID was formatted as "parent/child"
    let storeState;
    render(
      <StateObserver
        onStateChange={(s) => {
          storeState = s;
        }}
      />,
    );
    expect(storeState['parent/child']).toBeDefined();
    expect(storeState['parent/child'].parentId).toBe('parent');
  });

  it('3. enforces sequential execution when parallel={false}', async () => {
    const child1Mock = createTrackableAction();
    const child2Mock = createTrackableAction();

    render(
      <TaskManager>
        <Task id="parent" parallel={false}>
          <Task id="child1" before={child1Mock} />
          <Task id="child2" before={child2Mock} />
        </Task>
      </TaskManager>,
    );

    // Parent has no before, so child1 should start immediately
    await waitFor(() => expect(child1Mock).toHaveBeenCalledTimes(1));

    // Child 2 MUST NOT start until Child 1 is fully success
    expect(child2Mock).not.toHaveBeenCalled();

    await act(async () => {
      child1Mock.resolve();
    });

    // Now child 2 runs
    await waitFor(() => expect(child2Mock).toHaveBeenCalledTimes(1));
  });

  it('4. bubbles errors up the tree and triggers onError', async () => {
    const childMock = createTrackableAction();
    const parentErrorMock = jest.fn();

    render(
      <TaskManager>
        <Task id="parent" onError={parentErrorMock}>
          <Task id="child" before={childMock} />
        </Task>
      </TaskManager>,
    );

    await waitFor(() => expect(childMock).toHaveBeenCalledTimes(1));

    // Reject the child task
    await act(async () => {
      childMock.reject(new Error('Network Failure'));
    });

    // Parent should catch the error and fire its onError callback
    await waitFor(() => {
      expect(parentErrorMock).toHaveBeenCalledTimes(1);
      const errorArg = parentErrorMock.mock.calls[0][0];
      expect(errorArg.message).toContain("Child task 'parent/child' failed");
    });
  });

  it('5. isolates execution and skips siblings when using imperative store.run()', async () => {
    const parentBefore = createTrackableAction();
    const targetChildBefore = createTrackableAction();
    const siblingBefore = createTrackableAction();

    let triggerRun = null;

    function Controls() {
      const store = TaskStore.useState();
      triggerRun = () => store.run('parent/targetChild');
      return null;
    }

    render(
      <TaskManager>
        <Controls />
        {/* autoStart=false keeps the graph dormant */}
        <Task id="parent" autoStart={false} before={parentBefore}>
          <Task id="sibling" before={siblingBefore} />
          <Task id="targetChild" before={targetChildBefore} />
        </Task>
      </TaskManager>,
    );

    // Graph is dormant
    expect(parentBefore).not.toHaveBeenCalled();

    // Imperatively run ONLY the target child
    act(() => {
      triggerRun();
    });

    // Parent MUST run its 'before' to prep the environment
    await waitFor(() => expect(parentBefore).toHaveBeenCalledTimes(1));
    await act(async () => {
      parentBefore.resolve();
    });

    // The target child should run
    await waitFor(() => expect(targetChildBefore).toHaveBeenCalledTimes(1));

    // The sibling MUST NOT run (it should be marked as skipped)
    expect(siblingBefore).not.toHaveBeenCalled();

    // Verify the state explicitly
    let storeState;
    render(
      <StateObserver
        onStateChange={(s) => {
          storeState = s;
        }}
      />,
    );
    expect(storeState['parent/sibling'].status).toBe('skipped');
    expect(storeState['parent/targetChild'].status).toBe('running_before');
  });

  it('6. resolves sibling string dependencies implicitly', async () => {
    const aMock = createTrackableAction();
    const bMock = createTrackableAction();

    render(
      <TaskManager>
        <Task id="container" parallel={true}>
          {/* Note: 'A' and 'B' are defined without slashes */}
          <Task id="B" dependencies={['A']} before={bMock} />
          <Task id="A" before={aMock} />
        </Task>
      </TaskManager>,
    );

    // A should start because it has no dependencies
    await waitFor(() => expect(aMock).toHaveBeenCalledTimes(1));

    // B should be waiting for A
    expect(bMock).not.toHaveBeenCalled();

    // Resolve A
    await act(async () => {
      aMock.resolve();
    });

    // B should now start, proving 'A' was successfully resolved to 'container/A'
    await waitFor(() => expect(bMock).toHaveBeenCalledTimes(1));
  });
});
