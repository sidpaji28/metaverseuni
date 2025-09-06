const LoadingScreen = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-nebula/80">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-neon-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-neon-primary">Loading Virtual Campus...</p>
    </div>
  </div>
);

export default LoadingScreen;