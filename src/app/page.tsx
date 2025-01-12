import Navbar from "@/components/Nav";
import { Typography } from "@mui/material";

const currentDate = new Date().getFullYear();

export default function Home() {
  console.log(process.env.TRENDAI_API);

  return (
    <div className="flex flex-col items-center min-h-screen h-screen w-full">
      <Navbar isDashboard={false} />
      <main className="flex flex-col gap-8  items-center h-screen">
        <div className="flex divide-x mx-20 divide-black h-full">
          <div className="flex flex-col gap-8 p-20">
            <header className="text-center font-semibold underline">
              Influencer
            </header>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              pulvinar, nunc nec ultricies.
            </p>
          </div>
          <div className="flex flex-col gap-8 p-20">
            <header className="text-center font-semibold underline">
              Brands
            </header>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              pulvinar, nunc nec ultricies.
            </p>
          </div>
        </div>
      </main>
      <footer className=" sticky bottom-0 p-4 text-center bg-[#89e81d] my-8 w-11/12 rounded-md">
        <Typography>&copy; {currentDate} TrendAI</Typography>
      </footer>
    </div>
  );
}
