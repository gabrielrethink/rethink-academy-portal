import axios from "axios";

export const getTaskByUserEmail = async (email: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/tasks/${email}`
    );
    return data.studentTasks;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const createTask = async (taskData: any) => {
  const { data } = await axios.post(
    `http://localhost:4000/api/tasks`,
    taskData
  );
  return data;
};

export const getDateFilter = async (
  email: string,
  startDate: string,
  endDate: string
) => {
  console.log(email, startDate, endDate);
  try {
    const { data } = await axios.post(
      `http://localhost:4000/api/tasks/${email}`,
      { startDate, endDate },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};
