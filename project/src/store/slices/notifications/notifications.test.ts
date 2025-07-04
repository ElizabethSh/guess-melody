import { Notification } from 'types/notification';
import { NotificationsState } from 'types/state';

import {
  addNotification,
  notificationsSlice,
  removeNotification,
  setIsHovered,
} from './notifications';

describe('notificationsSlice', () => {
  let initialState: NotificationsState;
  beforeEach(() => {
    initialState = { notifications: [], isHovered: false };
  });

  it('should return the initial state', () => {
    expect(
      notificationsSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' }),
    ).toEqual(initialState);
  });

  it('should handle addNotification', () => {
    const notification: Notification = {
      id: '1',
      title: 'Test notification',
      type: 'info',
      description: 'This is a description',
    };
    expect(
      notificationsSlice.reducer(initialState, addNotification(notification)),
    ).toEqual({
      notifications: [notification],
      isHovered: false,
    });
  });

  it('should handle removeNotification', () => {
    const state: NotificationsState = {
      notifications: [
        {
          id: '1',
          title: 'Test notification',
          type: 'info',
          description: 'This is a description',
        },
      ],
      isHovered: false,
    };
    expect(notificationsSlice.reducer(state, removeNotification(0))).toEqual({
      notifications: [],
      isHovered: false,
    });
  });

  it('should handle setIsHovered', () => {
    expect(
      notificationsSlice.reducer(initialState, setIsHovered(true)),
    ).toEqual({
      notifications: [],
      isHovered: true,
    });
  });
});
