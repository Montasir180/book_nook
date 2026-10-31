import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In | BookNook",
  description:
    "Sign in to BookNook to return to your shelf, manage your borrows, and find your next read.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EC]">
      <Navbar />
      <LoginForm />
    </main>
  );
}
