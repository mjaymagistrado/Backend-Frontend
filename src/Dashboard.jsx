import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { API_ENDPOINT } from '../Api';
import './Dashboard.css';
import { FaFacebook, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Dropdown, Button, Card, Col, Container, Form, Modal, Nav, Navbar, NavDropdown, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Dashboard() {
  const [user, setUser] = useState(null);
  // const [rentDetails, setRentDetails] = useState(null);

  const [users, setUsers] = useState([]); // State for fetched users
  const [showUsersModal, setShowUsersModal] = useState(false); // Modal state for users
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal for creating user
  const [showEditModal, setShowEditModal] = useState(false); // Modal for editing user
  const [showReadModal, setShowReadModal] = useState(false); // Modal for reading user details
  const [selectedUser, setSelectedUser] = useState(null); // For selected user in Edit
  const [newUser, setNewUser] = useState({ fullname: '', username: '', passwordx: '' }); // New user fields
  const [editUser, setEditUser] = useState({ fullname: '', username: '', passwordx: '' }); // Edit user fields
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentDetails, setRentDetails] = useState({
    fullName: '',
    address: '',
    age: '',
    phoneNumber: '',
  });
  const [rentSuccess, setRentSuccess] = useState(false); // Success state for renting
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  

  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'));
        if (response && response.token) {
          const decoded_token = jwtDecode(response.token);
          setUser(decoded_token); // Set the decoded token as user
        } else {
          navigate('/login'); // Redirect if no token found
        }
      } catch (error) {
        navigate('/login');
      }
    };

    fetchDecodedUserID();
    fetchUsers(); // Fetch the users when the component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = {
        accept: 'application/json',
        Authorization: token,
      };
      const { data } = await axios.get(`${API_ENDPOINT}/user`, { headers });
      setUsers(data); // Set the fetched users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      const { data } = await axios.post(
        `${API_ENDPOINT}/user`,
        newUser,
        { headers }
      );
      setShowCreateModal(false);
      fetchUsers(); // Fetch updated users list
      Swal.fire({
        icon: 'success',
        text: 'Create User Successfully',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      const { data } = await axios.put(
        `${API_ENDPOINT}/user/${selectedUser.user_id}`,
        editUser,
        { headers }
      );
      setShowEditModal(false);
      fetchUsers(); // Fetch updated users list
      Swal.fire({
        icon: 'success',
        text: data.message,
      });
    } catch (error) {
      console.error('Error editing user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handleDeleteUser = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    
    if (!isConfirm.isConfirmed) return;

    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      await axios.delete(`${API_ENDPOINT}/user/${id}`, { headers });
      fetchUsers(); // Fetch updated users list
      Swal.fire({
        icon: 'success',
        text: 'Successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handleRentSubmit = (e) => {
    e.preventDefault();
    // Placeholder for API submission or business logic
    console.log('Rent Details Submitted:', rentDetails);
    setRentSuccess(true);
    setShowRentModal(false); // Close modal after successful submission
  };


  return (
    <>
    

      {/* Rent Modal */}
      <Modal
        show={showRentModal}
        onHide={() => setShowRentModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Rent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRentSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={rentDetails.fullName}
                    onChange={(e) =>
                      setRentDetails({ ...rentDetails, fullName: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter your age"
                    value={rentDetails.age}
                    onChange={(e) =>
                      setRentDetails({ ...rentDetails, age: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    value={rentDetails.phoneNumber}
                    onChange={(e) =>
                      setRentDetails({ ...rentDetails, phoneNumber: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    value={rentDetails.address}
                    onChange={(e) =>
                      setRentDetails({ ...rentDetails, address: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="success" type="submit" className="mt-3">
              Submit Rent Details
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Message */}
      {rentSuccess && (
        <div className="mt-3 alert alert-success">
          Rent details submitted successfully!
        </div>
      )}
      <Navbar bg="dark" expand="lg" className="shadow-sm">
  <Container>
    {/* Logo or Brand */}
    <Navbar.Brand href="#home" className="fw-bold fs-4 text-warning">
      <i className="bi bi-bicycle me-2"></i>Rent a Motorcycle
    </Navbar.Brand>

    {/* Navbar Toggle */}
    <Navbar.Toggle aria-controls="basic-navbar-nav" />

    {/* Collapsible Navbar */}
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto align-items-center">
        {/* Users Button */}
        <Button 
          variant="outline-light" 
          className="me-3 rounded-pill px-3"
          onClick={() => setShowUsersModal(true)}
        >
          <i className="bi bi-people-fill me-1"></i> Users
        </Button>

        {/* User Dropdown */}
        <NavDropdown
          title={
            <img 
              src="person-fill.svg" 
              alt="User Icon" 
              style={{
                width: '35px',
                height: '35px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}
            />
          }
          id="user-dropdown"
          align="end"
          className="custom-dropdown"
        >
          {/* Dropdown Items */}
          <NavDropdown.Item eventKey="disabled" disabled className="text-muted">
            <i className="bi bi-person me-2"></i>
            {user ? `User: ${user.username}` : 'Guest'}
          </NavDropdown.Item>
          <Dropdown.Divider />
          <NavDropdown.Item href="#" className="fw-semibold">
            <i className="bi bi-person-circle me-2"></i>Account
          </NavDropdown.Item>
          <NavDropdown.Item href="#" className="fw-semibold">
            <i className="bi bi-gear-fill me-2"></i>Settings
          </NavDropdown.Item>
          <NavDropdown.Item 
            href="#" 
            className="text-danger fw-semibold" 
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

   {/* Box for all the cards */}
<Container className="mt-5">
  <div className="carousel-wrapper">
    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <Row className="d-flex flex-wrap justify-content-center">
            {/* Motorcycle 1 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/KAWASAKI.jpg" alt="Motorcycle 1" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 1</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>Kawasaki Ninja H2</h5>
                    <p>Brand: Kawasaki</p>
                    <p>Model: Ninja H2</p>
                    <p>Year: 2015–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            {/* Motorcycle 2 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/yamaha.jpg" alt="Motorcycle 2" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 2</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>Yamaha YZF-R1</h5>
                    <p>Brand: Yamaha</p>
                    <p>Model: YZF-R1</p>
                    <p>Year: 1998–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            {/* Motorcycle 3 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/honda.jpg" alt="Motorcycle 3" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 3</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>Honda CBR1000RR</h5>
                    <p>Brand: Honda</p>
                    <p>Model: CBR1000RR</p>
                    <p>Year: 2004–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Second Carousel Item */}
        <div className="carousel-item">
          <Row className="d-flex flex-wrap justify-content-center">
            {/* Motorcycle 4 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/four.jpg" alt="Motorcycle 4" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 4</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>BMW S1000RR</h5>
                    <p>Brand: BMW</p>
                    <p>Model: S1000RR</p>
                    <p>Year: 2009–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            {/* Motorcycle 5 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/fiveth.jpg" alt="Motorcycle 5" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 5</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>Harley-Davidson Road Glide</h5>
                    <p>Brand: Harley-Davidson</p>
                    <p>Model: Road Glide</p>
                    <p>Year: 2015–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            {/* Motorcycle 6 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/six.jpg" alt="Motorcycle 6" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 6</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>Indian Scout</h5>
                    <p>Brand: Indian Motorcycle</p>
                    <p>Model: Scout</p>
                    <p>Year: 2015–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Third Carousel Item */}
        <div className="carousel-item">
          <Row className="d-flex flex-wrap justify-content-center">
            {/* Motorcycle 7 */}
            <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front of the card */}
                  <div className="flip-card-front">
                    <img src="/imgs/seven.jpg" alt="Motorcycle 7" className="img-fluid" />
                    <h5 className="card-title">Motorcycle 7</h5>
                  </div>
                  {/* Back of the card */}
                  <div className="flip-card-back">
                    <h5>Suzuki Hayabusa</h5>
                    <p>Brand: Suzuki</p>
                    <p>Model: Hayabusa</p>
                    <p>Year: 1999–Present</p>
                    <Button variant="primary" onClick={() => setShowRentModal(true)}>
                      Rent
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</Container>


      {/* Rent Modal */}
      <Modal
              show={showUsersModal}
              onHide={() => setShowUsersModal(false)}
              backdrop="static"
              aria-labelledby="users-modal-title"
              fullscreen // Bootstrap class to make the modal full width
            >
              <Modal.Header closeButton>
                <Modal.Title id="users-modal-title">Users</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>User_ID</th>
                      <th>Full Name</th>
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
                            variant="info"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowReadModal(true);
                            }}
                          >
                            Read
                          </Button>{' '}
                          <Button
                            variant="warning"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditUser({
                                fullname: user.fullname,
                                username: user.username,
                                passwordx: '', // Don't pre-fill password
                              });
                              setShowEditModal(true);
                            }}
                          >
                            Update
                          </Button>{' '}
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteUser(user.user_id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
      
                <Button
                  variant="success"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-3"
                >
                  Create User
                </Button>
              </Modal.Body>
            </Modal>
      
            {/* Create User Modal * */}
             <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Create User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleCreateUser}>
                  <Form.Group controlId="formFullname">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newUser.fullname}
                      onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newUser.passwordx}
                      onChange={(e) => setNewUser({ ...newUser, passwordx: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <br></br>
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
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editUser.fullname}
                      onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={editUser.username}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                      required
                    />
                  </Form.Group>
                  
                
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={editUser.passwordx}
                      onChange={(e) => setEditUser({ ...editUser, passwordx: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <br></br>
                  <Button variant="primary" type="submit">
                    Update User
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
      
            {/* Read User Modal */}
            <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Read User</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <p><strong>User_id:</strong> {selectedUser?.user_id}</p>
                    <p><strong>Full Name:</strong> {selectedUser?.fullname}</p>
                    <p><strong>Username:</strong> {selectedUser?.username}</p>
                  
                  </Modal.Body>
                </Modal>
                <br></br>
<br></br>
<br></br>
   

    </>
  );
}

export default Dashboard;
