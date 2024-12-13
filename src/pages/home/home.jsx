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
import { Bot } from 'lucide-react';

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
                        <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-10 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/8569749/pexels-photo-8569749.jpeg')] bg-cover bg-center bg-no-repeat">
                            <div className="absolute inset-0 bg-black/40"></div>
                          </div>
                          <span className="text-6xl font-semibold text-white relative z-10">Maps</span>
                          <Map className="w-20 h-20 text-white relative z-10" />
                        </CardContent>
                      </Card>
                    </Link>
                  ) : index === 1 ? (
                    <Link to="/action-plans">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-10 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/29737184/pexels-photo-29737184/free-photo-of-cuaderno-de-viaje-creativo-y-camara-en-mano.jpeg')] bg-cover bg-center bg-no-repeat">
                            <div className="absolute inset-0 bg-black/40"></div>
                          </div>
                          <span className="text-6xl font-semibold text-white relative z-10">Action Plans</span>
                          <ClipboardList className="w-20 h-20 text-white relative z-10" />
                        </CardContent>
                      </Card>
                    </Link>
                  ): index === 2 ? (
                    <Link to="/workflow-chat">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-10 rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg')] bg-cover bg-center bg-no-repeat">
                            <div className="absolute inset-0 bg-black/40"></div>
                          </div>
                          <span className="text-6xl font-semibold text-white relative z-10 text-center">Workflow Chat</span>
                          <Bot className="w-20 h-20 text-white relative z-10" />
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