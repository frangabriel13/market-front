export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <h1 className="text-xl font-bold tracking-wide uppercase">
        {process.env.PLATFORM_NAME}
      </h1>
    </main>
  );
}
