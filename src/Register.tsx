import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle, faL } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from './api/axios';

const USER_REGEX = /[a-zA-Z][a-zA-Z0-9-_]{3,32}/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;



function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(true);
  const [userFocus, setUserFocus] = useState(true);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(true);
  const [pwdFocus, setPwdFocus] = useState(true);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(true);
  const [matchFocus, setMatchFocus] = useState(true);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    //@ts-ignore
    userRef.current.focus()
  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd == matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault()
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axios.post(
        '/users',
        JSON.stringify({ username: user, password: pwd, fullname: user }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        },
      )

      console.log(response.data.data.addedUser)
      console.log(response);
      setSuccess(true);
      // clear input
    } catch (err) {
      // @ts-ignore
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else {
        // @ts-ignore
        console.log(JSON.stringify(err.response));
      }
      // @ts-ignore
      errRef.current.focus();
    }
  }

  return (
    <>
      {
        success ? (
          <section>
            <h1>
              success
            </h1>
            <p>
              <a href="#">Sign In</a>
            </p>
          </section>
        ) : (
          <section>
            {/* @ts-ignore */}
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive' >{errMsg}</p>

            <form onSubmit={handleSubmit}>
              {/* Username Section */}
              <label htmlFor="username">
                Username:
                <span>
                  <FontAwesomeIcon
                    className={validName ? "valid" : "hide"}
                    icon={faCheck}
                  />
                </span>
                <span>
                  <FontAwesomeIcon
                    className={validName || !user ? "hide" : "invalid"}
                    icon={faTimes}
                  />
                </span>
              </label>

              <input
                type="text"
                id="username"
                // @ts-ignore
                ref={userRef}
                autoComplete='off'
                onChange={(e) => setUser(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby='uidnote'
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                name=""
              />
              <p id='uidnote' className={userFocus && user && !validName ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle} />
                At least 4 character. <br />
                Must begin with a letter. <br />
                Letters, numbers, underscores, hypens allowed.
              </p>

              {/* Pasword section */}
              <label htmlFor="password">
                Password:
                <span>
                  <FontAwesomeIcon
                    className={validPwd ? "valid" : "hide"}
                    icon={faCheck}
                  />
                </span>
                <span>
                  <FontAwesomeIcon
                    className={validPwd || !pwd ? "hide" : "invalid"}
                    icon={faTimes}
                  />
                </span>
              </label>

              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby='pwdnote'
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <p id='pwdnote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle} />
                At least 8 character. <br />
                Must include uppercase, lowercase, a numbers, and a special character. <br />
                Allowed special characters:
                <span aria-label='exclamation mark'>!</span>
                <span aria-label='at symbol'>@</span>
                <span aria-label='hashtag'>#</span>
                <span aria-label='percent'>%</span>
              </p>

              {/* Matching Pasword section */}
              <label htmlFor="confirm_pwd">
                Confirm Password:
                <span>
                  <FontAwesomeIcon
                    className={validMatch && matchPwd ? "valid" : "hide"}
                    icon={faCheck}
                  />
                </span>
                <span>
                  <FontAwesomeIcon
                    className={validMatch || !matchPwd ? "hide" : "invalid"}
                    icon={faTimes}
                  />
                </span>
              </label>

              <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby='confirmnote'
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p id='pwdnote' className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>

              {/* Submit / sign up btn */}
              <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
            </form>
          </section>
        )
      }
    </>
  )
}

export default Register