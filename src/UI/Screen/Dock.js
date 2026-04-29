import { useEffect, useMemo } from 'react';
import Drag from '../../Core/UI/Drag';
import Screen from '../Screen';

function dockInBorderRegion(rect, point) {
  if (!point || !rect) {
    return null;
  }
  const snapThreshold = rect.width / 3;
  const leftBorder = rect.left + snapThreshold;
  const rightBorder = rect.left + rect.width - snapThreshold;
  const topBorder = rect.top + 32;

  if (point.x <= leftBorder && point.y <= topBorder) {
    return 'left';
  } else if (point.x >= rightBorder && point.y <= topBorder) {
    return 'right';
  }

  return null;
}

export function useDock() {
  const drag = Drag.useState();
  const rect = Screen.Rect.useState();
  const screen = Screen.State.useState();

  useEffect(() => {
    const displayRegion = {
      left: 0,
      top: 0,
      width: globalThis.innerWidth,
      height: globalThis.innerHeight,
    };
    screen((state) => {
      state.dock =
        !state?.fixed && dockInBorderRegion(displayRegion, drag?.touch);
    });
  }, [screen?.dock, drag?.touch, screen]);
  const style = useMemo(() => {
    let { left, top, width, height } = rect;
    if (screen.fullscreen || screen.maximize) {
      left = 0;
      top = 0;
      width = '100%';
      height = '100%';
    } else if (screen?.dock) {
      left = screen.dock === 'left' ? '0%' : '50%';
      top = 0;
      width = '50%';
      height = '100%';
    } else if (screen?.center) {
      left = '25%';
      top = '25%';
      width = '49.8%';
      height = '49.8%';
    }
    return { left, top, width, height };
  }, [
    rect?.__counter,
    screen?.dock,
    screen?.fullscreen,
    screen?.center,
    screen?.maximize,
    rect,
  ]);
  return style;
}
