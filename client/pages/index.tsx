import {
  useAddress,
  useUser,
  useLogin,
  useLogout,
  useMetamask,
} from '@thirdweb-dev/react';
import axios from 'axios';
import type { NextPage } from 'next';
import { useState } from 'react';

const Home: NextPage = () => {
  const address = useAddress();
  const connect = useMetamask();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoggedIn } = useUser();
  const [secret, setSecret] = useState();

  const getSecret = async () => {
    const res = await fetch('/api/secret', { credentials: 'include' });
    const data = await res.json();
    setSecret(data.message);
  };

  async function getData() {
    const res = await axios.get('http://localhost:8000/auth/login', {
      // Include all cookies in this request

      withCredentials: true,
    });
    console.log(res);

    return res.data;
  }

  async function handleLogin() {
    await login();
    try {
      const res = await axios.post(
        'http://localhost:8000/auth/login',
        {
          payload: {
            payload: {
              type: 'evm',
              domain: 'localhost:3000',
              address: '0xD63Ef08a38EfF4416d7EBf9895B69A525AE593F7',
              statement:
                'Please ensure that the domain above matches the URL of the current website.',
              uri: 'http://localhost:3000',
              version: '1',
              chain_id: '1',
              nonce: 'e65b0e5d-58e4-43fa-ba9d-42385c6ff519',
              issued_at: '2023-03-02T02:09:33.235Z',
              expiration_time: '2023-03-02T02:15:47.562Z',
              invalid_before: '2023-03-02T02:09:33.235Z',
            },
            signature:
              '0xaf13a31dd5bd9b746c99e395b888f03fdedd466e6de2bd94cd08a4831ba3fca9337619abd9af9dea1c7c2cca2633adcf60f2298a56cca4d394548f392fddcaaf1c',
          },
        },
        { withCredentials: true }
      );

      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={() => logout()}>Logout</button>
      ) : address ? (
        <>
          <button onClick={handleLogin}>Login</button>
          <button onClick={getData}>Login</button>
        </>
      ) : (
        <button onClick={() => connect()}>Connect</button>
      )}
      <button onClick={getSecret}>Get Secret</button>

      <pre>Connected Wallet: {address}</pre>
      <pre>User: {JSON.stringify(user, undefined, 2) || 'N/A'}</pre>
      <pre>Secret: {secret || 'N/A'}</pre>
    </div>
  );
};

export default Home;
