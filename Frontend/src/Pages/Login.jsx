import GoogleLoginButton from "../Components/GoogleLogin";

// Main authentication page component
export default function SimplifiedAuthPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative"
      }}
    >
      {/* Dark overlay to make text readable on any background */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-6">Beyond The Margin</h1>
        
        <p className="text-xl text-gray-100 mb-12">
          Join our community of writers and readers. Discover thoughtful articles, 
          share your ideas, and engage in meaningful discussions on the topics that matter.
        </p>
        
        {/* Only the two buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <GoogleLoginButton mode="login" />
          <GoogleLoginButton mode="signup" />
        </div>
      </div>
    </div>
  );
}