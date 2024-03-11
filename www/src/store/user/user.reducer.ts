import { IUserState } from "../interface";
import * as UserTypes from "./user.types";

const INITIAL_STATE: IUserState = {
  userList: null,
  userListLoading: false,
  userListError: null,
  userListSuccess: false,
  userCreateSuccess: false,
  userCreateLoading: false,
  userCreateError: null,
  userUpdateSuccess: false,
  userUpdateLoading: false,
  userUpdateError: null,
  userDeleteSuccess: false,
  userDeleteLoading: false,
  userDeleteError: null,
  userDetails: {
    loading: false,
    isUpdating: false,
    details: null,
    error: null,
  },
  userDetailsById: {
    loading: false,
    isUpdating: false,
    details: null,
    error: null,
  }
};

const userReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case UserTypes.FETCH_USER_LIST_START:
      return {
        ...state,
        userListLoading: true,
      };

    case UserTypes.FETCH_USER_DETAILS_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          loading: true,
        },
      };

    case UserTypes.FETCH_USER_DETAILS_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          loading: true,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          isUpdating: true,
        },
      };

    case UserTypes.FETCH_USER_LIST_SUCCESS:
      return {
        ...state,
        userList: payload,
        userListLoading: false,
        userListSuccess: true,
      };

    case UserTypes.FETCH_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          details: payload,
          loading: false,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          details: payload,
          isUpdating: false,
        },
      };

    case UserTypes.FETCH_USER_LIST_ERROR:
      return {
        ...state,
        userListError: payload,
        userListLoading: false,
      };
    case UserTypes.UPDATE_USER_ROLE_START:
      return {
        ...state,
        userUpdateLoading: true,
      };
    case UserTypes.UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        userUpdateLoading: false,
        userUpdateSuccess: true,
        userList: {
          ...state.userList,
          users: state?.userList?.users.filter(
            (user: any) => user.id !== payload.id
          ),
        },
      };
    case UserTypes.UPDATE_USER_ROLE_ERROR:
      return {
        ...state,
        userUpdateLoading: false,
        userUpdateError: payload,
      };

    case UserTypes.FETCH_USER_DETAILS_ERROR:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          error: payload,
          loading: false,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_ERROR:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          error: payload,
          isUpdating: false,
        },
      };

    case UserTypes.FETCH_USER_BY_ID_START:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          loading: true,
        },
      };

    case UserTypes.FETCH_USER_BY_ID_SUCCESS:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          details: payload,
          loading: false,
        },
      };

    case UserTypes.FETCH_USER_BY_ID_ERROR:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          error: payload,
          loading: false,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
