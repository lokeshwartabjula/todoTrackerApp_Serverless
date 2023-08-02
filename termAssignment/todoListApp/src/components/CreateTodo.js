import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreateNewTodo, callAmazonTextractApi } from "../services/todoService";
import { toast } from "react-toastify";


const CreateTodo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state;
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    dueDate: null,
    priority: null,
    user: email,
    friendEmail:""
  });

  const [pdfFile, setPdfFile] = useState(null);


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (todo.priority === null) {
      toast.warning("Please select a priority option.");
      return;
    }
    try {
      await CreateNewTodo(todo);
      navigate(`/home`, { state: { email } });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const {errors} = error.response.data;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key]);
        });
      }
    }
  };

  const handleFileChange = async (event) => {
    console.log("Inside handleFileChange");
    await setPdfFile(event.target.files[0]);
    const pdfFileNew = event.target.files[0];
    if (pdfFileNew) {
      // call Amazon Textract API with pdfFile
      // This is a placeholder function. Replace it with the actual API call in your environment.
      const descriptionFromPdf = await callAmazonTextractApi(pdfFileNew);
      setTodo((prevTodo) => ({
        ...prevTodo,
        description: descriptionFromPdf,
      }));
    }
    
  };

  const handleFileUpload = async () => {
    console.log("Inside handleFileUpload");
   
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <div className="fw-bold fs-2 text-center m-4 ">Create New todo</div>
      <form
        action=""
        className="w-50 m-auto"
        method="POST"
        onSubmit={handleFormSubmit}
      >
        <div class="mb-3">
          <label for="title" class="form-label">
            Title:
          </label>
          <input
            type="text"
            class="form-control outline-input"
            id="title"
            name="title"
            required
            onChange={handleInputChange}
          />
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">
            Description:
          </label>
          <textarea
            class="form-control outline-input"
            id="description"
            name="description"
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* <div class="mb-3">
          <label for="upload-pdf" class="form-label">
            Upload PDF:
          </label>
          <input
            type="file"
            accept=".pdf"
            class="form-control outline-input"
            id="upload-pdf"
            onChange={handleFileChange}
            onClick={handleFileUpload}
          />
        </div> */}

        <div class="mb-3">
          <label for="dueDate" class="form-label">
            Due Date:
          </label>
          <input
            type="date"
            class="form-control outline-input"
            id="dueDate"
            name="dueDate"
            required
            onChange={handleInputChange}
          />
        </div>

        <div class="mb-3">
          <label for="priority" class="form-label">
            Priority:
          </label>
          <select
            class="ms-3 p-2 border border-1 rounded"
            id="priority"
            name="priority"
            style={{ backgroundColor: "black" }}
            required
            onChange={handleInputChange}
          >
            <option value={null}>select priority</option>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>
        <div class="mb-3">
          <button type="submit" class="btn btn-primary">
            Create Todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTodo;
