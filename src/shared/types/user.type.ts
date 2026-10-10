export type UserType = 'pro' | 'regular';

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
  type: UserType;
}
