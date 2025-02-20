
interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
        {isLogin ? "Welcome back" : "Create an account"}
      </h2>
      <p className="mt-2 text-gray-400">
        {isLogin
          ? "Enter your credentials to access your account"
          : "Sign up to get started with our services"}
      </p>
    </div>
  );
};
