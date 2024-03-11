export default interface IRootState {
  auth: IAuthState;
  user: IUserState;
}

export interface IAuthState {
  access_token: string | null;
  isAuthenticated: boolean | null;
  authLoading: boolean;
  currentUser: any;
  uploading: boolean;
  newUser: any;
  error: any;
  loading: boolean;
  isEditing: boolean;
  isFetching: boolean;
  profile: any;
  // userInfo: any;
  loadUserFailed: boolean;
  recoverPassword: any;
  role: any;
}

interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  school: string;
  email: string;
  is_active: boolean;
  role: string | "ADMIN" | "INSTRUCTOR" | "STUDENT";
  created_at: string;
  updated_at: string;
}
export interface IUserState {
  userList: { total_count: number; users: User[] } | null;
  userListLoading: boolean;
  userListError: any;
  userListSuccess: boolean;
  userCreateSuccess: boolean;
  userCreateLoading: boolean;
  userCreateError: any;
  userUpdateSuccess: boolean;
  userUpdateLoading: boolean;
  userUpdateError: any;
  userDeleteSuccess: boolean;
  userDeleteLoading: boolean;
  userDeleteError: any;
  userDetails: any;
  userDetailsById: any;
}
