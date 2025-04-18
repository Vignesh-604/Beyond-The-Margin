import GoogleLoginButton from "../Components/GoogleLogin";

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <h3>Login</h3>
      <GoogleLoginButton mode="login"/>
      <br /><br />
      <h3>Signup</h3>
      <GoogleLoginButton mode="signup"/>
    </div>
  );
};

export default Login;
