import requests from "../agent";

export const AuthService = {
  getCurrentUser: () => requests.get("/users/me"),

  fetchUsers: async ({
    page,
    size,
    sort,
    filterFio,
    filterRole,
    filterCourse,
    filterGroupNumber,
    trackId,
    isEnabled
  }) => {
    const queryParams = [];
    if (filterFio) queryParams.push(`fio=${encodeURIComponent(filterFio)}`);
    if (isEnabled!=null) queryParams.push(`isEnabled=${encodeURIComponent(isEnabled)}`);
    if (filterRole) queryParams.push(`role=${encodeURIComponent(filterRole)}`);
    if (filterCourse)
      queryParams.push(`course=${encodeURIComponent(filterCourse)}`);
    if (filterGroupNumber)
      queryParams.push(`group_number=${encodeURIComponent(groupNumber)}`);
    if (trackId) queryParams.push(`trackId=${encodeURIComponent(trackId)}`);
    queryParams.push(`page=${encodeURIComponent(page)}`);
    queryParams.push(`size=${encodeURIComponent(size)}`);
    queryParams.push(`sort=${encodeURIComponent(sort)}`);
    const queryString = `?${queryParams.join("&")}`;
    return requests.get(`/users${queryString}`);
  },

  updateUser: (userDto) => requests.put("/users", userDto),

  deleteUser: (userId) => requests.delete(`/users/${userId}`),
  
  getRoles: () => requests.get("/roles"),
};
