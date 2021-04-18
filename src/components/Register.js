import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PopupWithForm from './PopupWithForm';

function Register(props) {
  const { registered, handleRegisterSubmit, email, setEmail, password, setPassword, onClose } = props; 
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('token')) { 
      history.push('/around');
    }
  }, [history]);

  useEffect(() => {
    if (registered) {
      debugger; 
      history.push('/signin');
    }
  }, [history, registered]);

  return (
      <>
        <Link className='login__call-out' to='/signin'>
          Log in
        </Link>
        <PopupWithForm
          name='signup'
          title='Sign up'
          isOpen={true}
          onClose={onClose}
          onSubmit={handleRegisterSubmit}
        >
          <input
            className='login__input'
            type='email'
            id='email'
            name='email'
            placeholder='Email'
            required
            value={email || ''}
            onChange={e => setEmail(e.target.value)}
            autoComplete="on"
          />
          <input
            className='login__input'
            type='password'
            id='password'
            name='password'
            placeholder='Password'
            minLength='2'
            maxLength='200'
            required
            value={password || ''}
            onChange={e => setPassword(e.target.value)}
            autoComplete="on"
          />
          <button
            className='login__submit'
            to='/main'
          >
            Sign up
          </button>
          <Link className='login__text' to='/signin'>
            Already a member? Log in here!
          </Link>
        </PopupWithForm>
      </>
    );
  }

export default Register;