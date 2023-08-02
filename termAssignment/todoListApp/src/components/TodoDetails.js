import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { deleteTodo, getTodoById, assignTodo, afterAssign, remindFriend } from "../services/todoService";
import { priorityMapping } from "../utils/priorityMapping";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput
} from 'mdb-react-ui-kit';

const TodoDetails = () => {
  const { todoId } = useParams();
  const [todo, setTodo] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [optSmModal, setOptSmModal] = useState(false);
  const toggleShow = () => setOptSmModal(!optSmModal);
  const location = useLocation();
  const { email } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodoDetails();
  }, [todoId]);

  const fetchTodoDetails = async () => {
    try {
      const response = await getTodoById(todoId);
      if (response.status === 200) {
        setTodo(response.data);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors
      ) {
        const { errors } = error.response.data;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key]);
        });
      }
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await deleteTodo(todoId);
      navigate(`/home`, { state: { email } });
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const onAssignTodo = async (e) => {
    e.preventDefault();

    try {
      const response = await assignTodo(todoId, friendEmail);
      if (response.status === 200) {
        // setIsOpen(false);
        fetchTodoDetails();
        setOptSmModal(false);
        setFriendEmail("");
      }
    } catch (error) {
      console.log("Error assigning todo:", error);
    }
  };

  const handleRemindFriend = async (e) => {
    e.preventDefault();

    try {
      await remindFriend(todoId, todo.friendEmail);
    } catch (error) {
      console.log("Error assigning todo:", error);
    }
  };

  if (todo === null) {
    return <p>Loading...</p>;
  }

  const formattedDate = new Date(todo.createdOn).toLocaleString();

  return (
    <div className="container m-3">
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => navigate("/home", { state: { email } })}
      >
        Go back
      </button>
      <div className="card bg-dark text-white">
        <div className="card-body">
          <h5 className="card-title fs-2">{todo.title}</h5>
          <div className="card-text">
            <div className="mb-3 mt-3">Description: {todo.description}</div>
            <div className="mb-3">Due Date: {todo.dueDate}</div>
            <div className="mb-3">
              Priority: {priorityMapping[todo.priority]}
            </div>
            {todo.friendEmail && <div className="mb-3">Assigned to: {todo.friendEmail}</div>}
            <div>Created on: {formattedDate}</div>
            <div className="mt-2">
              <button
                className="btn btn-success me-3"
                onClick={() =>
                  navigate(`update`, { state: { email, currentTodo: todo } })
                }
              >
                Update
              </button>
              {!todo.isAssignedToFriend && (
                <button
                  className="btn btn-info me-3"
                  // onClick={() => setIsOpen(true)}
                  onClick={toggleShow}
                >
                  Assign this item to your friend
                </button>
                )}
              {todo.isAssignedToFriend && todo.friendEmail && (
                <button
                  className="btn btn-info me-3"
                  onClick={handleRemindFriend}
                >
                  Remind your friend
                </button>
              )}
              <button
                className="btn btn-danger me-2"
                onClick={handleDeleteTodo}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
        <h2>Assign this item to your friend</h2>
        <form onSubmit={onAssignTodo}>
          <input 
            type="email" 
            value={friendEmail} 
            onChange={e => setFriendEmail(e.target.value)} 
            required 
          />
          <button type="submit">Assign</button>
        </form>
      </Modal> */}
      {/* <Modal 
  isOpen={modalIsOpen} 
  onRequestClose={() => setIsOpen(false)} 
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'black',
      borderRadius: '4px',
      padding: '20px',
      borderColor: 'white',
    }
  }}
>
  <h2>Assign this item to your friend</h2>
  <form onSubmit={onAssignTodo}>
    <input 
      type="email" 
      value={friendEmail} 
      onChange={e => setFriendEmail(e.target.value)} 
      required 
      style={{ marginRight: '10px' }}
    />
    <button type="submit">Assign</button>
  </form>
  <button onClick={() => setIsOpen(false)} style={{ marginTop: '20px' }}>Close</button>
</Modal> */}

<MDBModal show={optSmModal} tabIndex='-1' setShow={setOptSmModal} color="primary">
        <MDBModalDialog size='lg' >
          <MDBModalContent>
            <MDBModalHeader className="bg-dark">
              <MDBModalTitle>Assign this item to your friend</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="bg-dark">
            <form onSubmit={onAssignTodo}>
              {/* <input 
                type="email" 
                value={friendEmail} 
                onChange={e => setFriendEmail(e.target.value)} 
                required 
                style={{ marginRight: '10px' }}
              /> */}
              <div className="flex-md-row  ">
              <MDBInput
                label='Type your email'
                id='typeEmail'
                type='email'
                required
                value={friendEmail}
                onChange={e => setFriendEmail(e.target.value)}
                style={{ marginRight: '10px' }}
                className="mb-4 bg-light text-black"
              />
              <MDBBtn color='light' rippleColor='dark' type="submit" >
              Assign
            </MDBBtn>
              {/* <button type="submit">Assign</button> */}

              </div>
              
            </form>
            {/* <MDBBtn color='light' rippleColor='dark'>Close</MDBBtn> */}
            {/* <button onClick={() => setIsOpen(false)} style={{ marginTop: '20px' }}>Close</button> */}
              
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
  </MDBModal>

    </div>
  );
};

export default TodoDetails;
