import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '@settings';

import { NotificationsState, State } from 'types/state';

const initialState: NotificationsState = {
  notifications: [],
  isHovered: false,
};

export const notificationsSlice = createSlice({
  name: NameSpace.Notifications,
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications.splice(action.payload, 1);
    },
    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },
  },
  selectors: {
    selectNotifications: (state) => state.notifications,
    selectIsHovered: (state) => state.isHovered,
  },
});

export const { selectNotifications, selectIsHovered } =
  notificationsSlice.getSelectors(
    (state: State) => state[NameSpace.Notifications],
  );

export const { addNotification, removeNotification, setIsHovered } =
  notificationsSlice.actions;
