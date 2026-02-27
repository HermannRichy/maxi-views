import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
//import { IconRocket } from "@tabler/icons-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-background text-foreground">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    Get started by editing&nbsp;
                    <code className="font-bold">src/app/page.tsx</code>
                </p>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <SignedOut>
                        <Button asChild variant="default">
                            <Link href="/sign-in">Se connecter</Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/dashboard/profile">
                                    Mon Profil
                                </Link>
                            </Button>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            </div>

            <div className="flex flex-col items-center gap-12 py-20">
                <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:to-transparent after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
                    <div className="flex flex-col items-center gap-4">
                        {/*<IconRocket className="w-16 h-16 text-primary animate-bounce font-extrabold" />*/}
                        <h1 className="text-7xl font-extrabold tracking-tight text-center">
                            Start <span className="text-primary">Web</span> App
                        </h1>
                    </div>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Build Faster.</h2>
                        <p className="text-muted-foreground text-lg">
                            The ultimate premium starter for Next.js 16
                            projects. Batteries included: Auth, DB, Styling, and
                            Emails.
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg">Get Started</Button>
                            <Button variant="outline" size="lg">
                                Documentation
                            </Button>
                        </div>
                    </div>
                    <ContactForm />
                </div>
            </div>

            <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left mt-20 gap-4">
                <a
                    href="https://nextjs.org/docs"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        Next.js 16{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Fullstack capabilities with the latest App Router
                        improvements.
                    </p>
                </a>

                <a
                    href="https://clerk.com/docs"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        Clerk Auth{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        The easiest way to add authentication and user
                        management.
                    </p>
                </a>

                <a
                    href="https://www.prisma.io/docs"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        Prisma & PG{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Type-safe database access with PostgreSQL integration.
                    </p>
                </a>

                <a
                    href="https://ui.shadcn.com"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        shadcn UI{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                            -&gt;
                        </span>
                    </h2>
                    <p
                        className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}
                    >
                        Beautifully designed components built with Tailwind CSS.
                    </p>
                </a>
            </div>
        </main>
    );
}
