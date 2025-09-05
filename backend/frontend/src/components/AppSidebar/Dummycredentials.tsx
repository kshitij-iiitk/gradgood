const DummyCredentials = () => {
  return (
    <div className="hidden md:flex flex-col absolute right-10 items-start bottom-10 bg-black/60 backdrop-blur-lg border border-gray-700 p-4 rounded-xl shadow-lg w-64 text-gray-200">
      <h3 className="font-bold text-lg mb-2">Demo Credentials</h3>
      <p>
        <span className="font-semibold">Roll Number:</span> <span className="text-indigo-400">2001BEC0001</span>
      </p>
      <p>
        <span className="font-semibold">Password:</span> <span className="text-indigo-400">111111</span>
      </p>
    </div>
  );
};

export default DummyCredentials;
