import { Link } from 'react-router-dom';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Map } from 'lucide-react';
import { ClipboardList } from 'lucide-react';

function Home() {
  const { handleLogout } = useAuth();

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-gray-200'>
      <Header title="Home" onLogout={handleLogout} />
      <div className="flex justify-center items-center w-full p-4 h-full mt-10">
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full max-w-4xl"
        >
          <CarouselContent>
            {Array.from({ length: 4 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  {index === 0 ? (
                    <Link to="/maps">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-10 bg-cyan-200 rounded-lg">
                          <span className="text-4xl font-semibold">Maps</span>
                          <Map className="w-10 h-10" />
                        </CardContent>
                      </Card>
                    </Link>
                  ) : index === 1 ? (
                    <Link to="/action-plans">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-10 bg-green-200 rounded-lg">
                          <span className="text-4xl font-semibold">Action Plans</span>
                          <ClipboardList className="w-10 h-10" />
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6 flex-col">
                        <span className="text-4xl font-semibold">Coming Soon...</span>
                    </CardContent>
                  </Card>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default Home; 