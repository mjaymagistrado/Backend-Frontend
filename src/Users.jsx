import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_ENDPOINT } from './Api'; // Ensure this is the correct API endpoint
import { Button, Modal, Form, Table } from 'react-bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false); // State for Read User Modal
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    fullname: '',
    username: '',
    // email: '',
    passwordx: '',
  });

  const [editUser, setEditUser] = useState({
    fullname: '',
    username: '',
    // email: '',
    passwordx: '',
  });

  const userdata = JSON.parse(localStorage.getItem('token'));
  const token = userdata?.data?.token;

  const headers = {
    accept: 'application/json',
    Authorization: token,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_ENDPOINT}/user`, { headers });
      setUsers(data); // Assuming `data` contains an array of user objects
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { fullname, username,  passwordx } = newUser;
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/user`,
        { fullname, username,  passwordx },
        { headers }
      );
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      setShowCreateModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response.data.message,
      });
    }
  };

  // Handle Edit User
  const handleEditUser = async (e) => {
    e.preventDefault();
    const { fullname, username, passwordx } = editUser;
    try {
      const response = await axios.put(
        `${API_ENDPOINT}/user/${selectedUser.user_id}`,
        { fullname, username,  passwordx },
        { headers }
      );
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response.data.message,
      });
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user_id) => {
    const isConfirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (isConfirmed.isConfirmed) {
      try {
        const response = await axios.delete(`${API_ENDPOINT}/user/${user_id}`, {
          headers,
        });
        Swal.fire({
          icon: 'success',
          text: response.data.message,
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          text: error.response.data.message,
        });
      }
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Create User
      </Button>

      {/* Users Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fullname</th>
            <th>Username</th>
           
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.fullname}</td>
              <td>{user.username}</td>
             
              <td>
                <Button
                  variant="info" // "Read" button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowReadModal(true);
                  }}
                >
                  Read
                </Button>
                <Button
                  variant="warning"
                  onClick={() => {
                    setSelectedUser(user);
                    setEditUser({
                      fullname: user.fullname,
                      username: user.username,
                  
                      passwordx: '', // Don't show the password in the edit form
                    });
                    setShowEditModal(true);
                  }}
                  className="ms-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteUser(user.id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Read User Modal */}
      <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Fullname:</strong> {selectedUser.fullname}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
             
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReadModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group controlId="formFullname">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                value={newUser.fullname}
                onChange={(e) =>
                  setNewUser({ ...newUser, fullname: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                required
              />
            </Form.Group>
            {/* <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </Form.Group> */}
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.passwordx}
                onChange={(e) =>
                  setNewUser({ ...newUser, passwordx: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditUser}>
            <Form.Group controlId="formFullname">
              <Form.Label>Fullname</Form.Label>
              <Form.Control
                type="text"
                value={editUser.fullname}
                onChange={(e) =>
                  setEditUser({ ...editUser, fullname: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                required
              />
            </Form.Group>
            {/* <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                required
              />
            </Form.Group> */}
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={editUser.passwordx}
                onChange={(e) =>
                  setEditUser({ ...editUser, passwordx: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Users;
