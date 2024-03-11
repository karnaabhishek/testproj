// third party libraries
import { Dispatch } from "redux";

// project imports
import * as UserTypes from "./user.types";
import axiosInstance from "../../config/axios.config";
import { openAlert } from "../alert/alert.actions";
import { createFormData } from "@/utils/helper";

export const fetchUsers =
  (role: "STUDENT" | "INSTRUCTOR" | "ALL") => async (dispatch: Dispatch) => {
    dispatch({ type: UserTypes.FETCH_USER_LIST_START });
    try {
      const { data } = await axiosInstance.get("/user/get", {
        params: { role, limit: 100 },
      });
      dispatch({ type: UserTypes.FETCH_USER_LIST_SUCCESS, payload: data });
    } catch (error: any) {
      dispatch({
        type: UserTypes.FETCH_USER_LIST_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchUser = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: UserTypes.FETCH_USER_START });
  try {
    const { data } = await axiosInstance.get(`/user/get/${id}`);
    dispatch({ type: UserTypes.FETCH_USER_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_USER_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

type User = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  cell_phone?: string;
  apartment?: string;
  city?: string;
  state?: string;
  gender?: string;
  dob?: string;
  school?: string | string[];
  address?: string;
};

export const createUser = (user: User, cb?: () => void) => async (dispatch: Dispatch) => {
  dispatch({ type: UserTypes.CREATE_USER_START });
  try {
    const { data } = await axiosInstance.put("/user/post", user);
    dispatch({ type: UserTypes.CREATE_USER_SUCCESS, payload: data });
    if (cb) {
      cb();
    }
    dispatch(openAlert("User created successfully", "success"));
  } catch (error: any) {
    dispatch({
      type: UserTypes.CREATE_USER_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch(openAlert("Failed to create user", "error"));
  }
};

export const deleteUser = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: UserTypes.DELETE_USER_START });
  try {
    const { data } = await axiosInstance.delete(`/user/delete/${id}`);
    dispatch({ type: UserTypes.DELETE_USER_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: UserTypes.DELETE_USER_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserRole =
  (id: number, role: "STUDENT" | "CSR" | "INSTRUCTOR") =>
    async (dispatch: Dispatch) => {
      dispatch({ type: UserTypes.UPDATE_USER_ROLE_START });
      try {
        const { data } = await axiosInstance.patch(
          `/user/update/role/${id}?role=${role}`
        );
        dispatch({
          type: UserTypes.UPDATE_USER_ROLE_SUCCESS,
          payload: { id, role },
        });
        dispatch(openAlert("User role updated successfully", "success"));
      } catch (error: any) {
        dispatch({
          type: UserTypes.UPDATE_USER_ROLE_ERROR,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
        dispatch(openAlert("Failed to update user role", "error"));
      }
    };

export const fetchUserDetails = () => async (dispatch: any) => {
  try {
    dispatch({
      type: UserTypes.FETCH_USER_DETAILS_START,
    });

    const { data } = await axiosInstance.get(`/profile/get`);
    dispatch({
      type: UserTypes.FETCH_USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_USER_DETAILS_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const fetchUserDetailsById = (id: string) => async (dispatch: any) => {
  try {
    dispatch({
      type: UserTypes.FETCH_USER_BY_ID_START,
    });

    const { data } = await axiosInstance.get(`/user/get/${id}`);
    dispatch({
      type: UserTypes.FETCH_USER_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_USER_BY_ID_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
}

export const updateUserDetails =
  (userFields: any, cb: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_START,
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = createFormData(userFields);

      const { data } = await axiosInstance.put(
        `/profile/update`,
        formData,
        config
      );
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_SUCCESS,
        payload: data,
      });
      dispatch(openAlert("User profile updated succesfully", "success"));

      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch(openAlert("Failed to update user profile", "error"));

      if (cb) {
        cb();
      }
    }
  };
