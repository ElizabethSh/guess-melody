export type Notification = {
  description: string;
  id: string;
  type: 'error' | 'success' | 'info';
  title: string;
};
