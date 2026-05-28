import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <SignIn 
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
