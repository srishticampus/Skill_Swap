import { Button } from "@/components/ui/button";
import profilepic from "./profile-pic.png";
import { Input } from "@/components/ui/input";
export default function Signup() {
  return (
    <main className="container mx-3 flex flex-col items-center gap-4 my-16">
        <h1>Sign Up!</h1>
        <img src={profilepic} alt="upload profile pic" className="w-48 h-56 object-contain" />
        <form action="" method="post"
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[80%] max-w-[600px]">
              <label for="name" className="flex flex-col">
                <span>Name</span>
                <Input type="text" name="name" id="name"  />
            </label>
            <label for="email" className="flex flex-col">
                <span>Email</span>
                <Input type="email" name="email" id="email"  />
            </label>
            <label for="phone" className="flex flex-col">
                <span>Phone Number</span>
                <Input type="tel" name="phone" id="phone"  />
            </label>
            <label for="aadhaar" className="flex flex-col">
                <span>Aadhaar Number</span>
                <Input type="text" name="aadhaar" id="aadhaar"  />
            </label>
            <label for="password" className="flex flex-col">
                <span>Password</span>
                <Input type="password" name="password" id="password"  />
            </label>
            <label for="confirm-password" className="flex flex-col">
                <span>Confirm Password</span>
                <Input type="password" name="confirm-password" id="confirm-password"
                     />
            </label>
            <Button type="submit" className="sm:col-span-2"
                >Sign
                Up</Button>

        </form>

        <p>Already have an account? <a href="/login" className="underline">Login</a></p>

    </main>
  );
}
