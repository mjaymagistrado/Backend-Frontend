import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from '../Api';
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, Form, Button } from 'react-bootstrap';

function Login() {
  const [username, setUsername] = useState('');
  const [passwordx, setPasswordx] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
        username,
        passwordx,
      });

      localStorage.setItem('token', JSON.stringify(response.data));
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar with custom color */}
      <Navbar bg="dark" variant="dark" className="mb-5 shadow-lg">
        <Container>
          <Navbar.Brand style={{ color: '#ff6f61', fontSize: '2rem', fontWeight: 'bold' }}>Motorcycle Rent</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Welcome Section with Fixed Background Image */}
      <div className="d-flex justify-content-center align-items-center" 
           style={{
             minHeight: '100vh',
             backgroundImage: 'url("/imgs/motor.jpg")',  // Replace with your motorcycle background image
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundAttachment: 'fixed',
             position: 'relative',
             zIndex: 0,
           }}>

        {/* Overlay for better text visibility */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1
        }} />

        {/* Welcome Message */}
        <div className="text-center mb-5" style={{ position: 'relative', zIndex: 2 }}>
          <h3 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>Welcome to Motorcycle Rent</h3>
          <p className="text-light" style={{
            fontSize: '1.1rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Rent the motorcycle of your choice! Log in to explore our options, manage your preferences, and start your rental journey.
          </p>
        </div>

        {/* Login Form in Box */}
        <div className="p-5 border rounded shadow-lg" style={{
          maxWidth: '500px', width: '100%', backgroundColor: '#ffffff', zIndex: 2, position: 'relative', borderRadius: '8px'
        }}>
          <Row>
            <Col md={12}>
              <h4 className="text-center mb-4" style={{ fontSize: '1.6rem', fontWeight: '600', color: '#333' }}>Login</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label style={{ fontWeight: '500', color: '#333' }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      padding: '10px 13px', fontSize: '1.1rem', borderColor: '#ff6f61', borderRadius: '5px'
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label style={{ fontWeight: '500', color: '#333' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={passwordx}
                    onChange={(e) => setPasswordx(e.target.value)}
                    required
                    style={{
                      padding: '12px 15px', fontSize: '1.1rem', borderColor: '#ff6f61', borderRadius: '5px'
                    }}
                  />
                </Form.Group>

                {error && <p className="text-danger text-center">{error}</p>}

                <Button variant="danger" type="submit" disabled={loading} className="w-100" style={{
                  fontSize: '1.2rem', padding: '12px', borderRadius: '5px'
                }}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Login;
