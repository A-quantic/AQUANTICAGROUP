import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <SignUp 
        fallbackRedirectUrl="/redirect"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
          }
        }}
      />
    </div>
  );
}
