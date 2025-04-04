"use client";

import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Bell } from 'lucide-react';
// import { useWebSocket } from "../../contexts/WebSocketContext";
import { useRouter } from "next/navigation";


export default function Navbar() {
  // const { messages, removeMessage } = useWebSocket();
  const messages = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("notifications") || "[]") : [];

  console.log("Messages from localStorage:", messages);
  const router = useRouter();

  const handleNotificationClick = (notificationString: string) => {
    let notification;

    // ✅ Controleer of het een JSON-string is en parse alleen indien nodig
    try {
      notification = typeof notificationString === "string" ? JSON.parse(notificationString) : notificationString;
    } catch (error) {
      console.error("Fout bij het parsen van notificatie:", error);
      router.push("/");
      return;
    }

    // ✅ Controleer of er een trackId is
    if (notification.trackId) {
      router.push(`/tracks/request/${notification.trackId}?notification=${notification.notificationId}`);
    } else {
      router.push("/");
    }
  };
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link
              href="/"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Services
            </Link>
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Upload
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        <Sheet>
          <SheetTrigger>
            <Bell />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                Notifications
              </SheetTitle>
              <SheetDescription>
                {messages.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {messages.map((msg, index) => {
                      let notification;

                      // Probeer JSON te parsen, anders behandel het als een string
                      try {
                        notification = typeof msg === "string" ? JSON.parse(msg) : msg;
                      } catch (error) {
                        console.error("Fout bij JSON parse:", error, msg);
                        notification = { message: msg }; // Als het geen JSON is, zet het als string in een object
                      }

                      return (
                        <li
                          key={index}
                          className="p-2 bg-gray-100 rounded"
                          onClick={() => handleNotificationClick(notification, index)}
                        >
                          {notification.message} {/* ✅ Correcte weergave */}
                          {/* <button onClick={() => removeMessage(index)} className="text-red-500">
                            x
                          </button> */}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-4">Geen meldingen</p>
                )}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>

        </Sheet>
        <Link
          href="/profile"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Profile
        </Link>
        <Link
          href="/add-track"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Upload
        </Link>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
