import { Button } from "./ui/button";
import { RandomChart } from "./ui/charts";
export const LandingPage = () => {

    return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 mt-8">
            <h1 className="text-5xl font-extrabold tracking-tight">The Song Gallery</h1>
            <p className="text-xl text-center max-w-md">Discover the lyrics to your favorite songs and explore new music from various genres.</p>
            <RandomChart />
            <Button className="px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105">Get Started</Button>
        </div>
    );
};