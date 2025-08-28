

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
      Welcome to Social-Connect
    </h1>
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => window.location.href = '/register'}
        className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        Register
      </button>
      <button
        onClick={() => window.location.href = '/login'}
        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
      >
        Login
      </button>
    </div>
  </div>
</div>
  );
};

export default Home;