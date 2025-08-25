

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Social Media Clone</h1>
      <p>This is the home page of the application.</p>
      <button onClick={() => window.location.href = '/register'}>Register</button>
      <button onClick={() => window.location.href = '/login'}>Login</button>
    </div>
  );
};

export default Home;