import api from "./api";
import axios from "axios";


export const getTodos = (email) => {
  return api.post("/todoHome", { email });
};

export const getTodoById = (id) => {
  return api.post("/todoDetails", { id });
};

export const deleteTodo = (id) => {
  return api.post("/todoDelete", {  id  });
};

export const CreateNewTodo = (todoDetails) => {
  return api.post("/todoCreate", todoDetails);
};

export const updateTodo = (todoDetails) => {
  return api.post("/todoUpdate", todoDetails);
};

export const assignTodo = (todoId, friendEmail) => {
  return api.post("/todoAssign", { todoId, friendEmail });
};

export const remindFriend = (todoId, friendEmail) => {
  return api.post("todo/reminder", { todoId, friendEmail });
};

export const callAmazonTextractApi = async (pdfFile) => {
  let formData = new FormData();
  formData.append('file', pdfFile);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-api-key': 'Your_AmazonTextract_API_Key'
    }
  };

  try {
    const response = await axios.post('https://a01g9m32dj.execute-api.us-east-1.amazonaws.com/prod/pdf-text', formData, config);
    console.log("Response from Amazon Textract API: ", response);
    return response.data;
  } catch (error) {
    console.error("Error calling Amazon Textract API: ", error);
    throw error;
  }
};