"use client"
import Navbar from "@/components/Navbar";
import { TokenLaunchpad } from "@/components/launchpad";


export default function Home() {
  return (
    <div className = "flex flex-col justify-center items-center mt-5 h-100vh">
      <Navbar/>
      <TokenLaunchpad/>
    </div>
  );
}
