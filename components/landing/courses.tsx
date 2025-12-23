import Image from "next/image";
import { Button } from "../ui/button";

export default function Courses() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 flex justify-between">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart and clever kids ready to fly high!</h2>
                        <p className="text-gray-600 mb-8">Learn amazing with us. We teach 'One Smart Lesson' at a time!</p>
                    </div>
                    <Button className="bg-orange-400 hover:bg-orange-400/90 text-white rounded-none rounded-tr-2xl rounded-bl-2xl px-6">Enroll Now →</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Course Card 1 */}
                    <div className="bg-orange-400 overflow-visible shadow-lg hover:shadow-xl transition rounded-none rounded-tr-3xl rounded-bl-3xl ">
                        <div className="relative h-48 w-full">
                            <Image src="/kid-playing-basketball-sports-life-skills.jpg" alt="Life Skills for Kids" fill className="object-cover" />
                        </div>
                        <div className="p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">Life Skills for Kids</h3>
                        </div>
                    </div>

                    {/* Course Card 2 */}
                    <div className="bg-green-500  overflow-hidden shadow-lg hover:shadow-xl transition rounded-none rounded-tr-3xl rounded-bl-3xl">
                        <div className="relative h-48 w-full">
                            <Image src="/child-imagination-creative-thinking.jpg" alt="Imagination is power" fill className="object-cover" />
                        </div>
                        <div className="p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">Imagination is power</h3>
                        </div>
                    </div>

                    {/* Course Card 3 */}
                    <div className="bg-blue-400 overflow-hidden shadow-lg hover:shadow-xl transition rounded-none rounded-tr-3xl rounded-bl-3xl">
                        <div className="relative h-48 w-full">
                            <Image src="/young-boy-growth-mindset-development.jpg" alt="Grow your own wings" fill className="object-cover" />
                        </div>
                        <div className="p-8 text-white">
                            <h3 className="text-2xl font-bold mb-2">Grow your own wings</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
