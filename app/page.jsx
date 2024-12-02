"use client";
import App from "./components/App";

const Home = () => {
  return (
    <>
      <div className="h-full overflow-hidden">
        <main className="mx-auto px-4 md:px-6 lg:px-8 h-[calc(100%-4rem)] -mb-[4rem]">
          <App />
        </main>
      </div>
    </>
  );
};

export default Home;
