import { auth } from "@/auth";
import LoginForm from "@/components/LoginForm";
import LogoutForm from "@/components/LogoutForm";
export default async function Home() {
  const session = await auth();
  const isLoggedin = session?.user;
  console.log(session);
  return (
    <div className="flex flex-col justify-center items-center m-4">
      <h1 className="text-3xl my-3">Hey, time to Sign In</h1>
      {isLoggedin ? <LogoutForm /> : <LoginForm />}
    </div>
  );
}
