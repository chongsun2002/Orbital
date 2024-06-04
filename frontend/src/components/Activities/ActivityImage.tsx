import { MdSportsBasketball } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";


interface ActivityImageProps {
    image: string | undefined,
    category: string
}

const ActivityImage = ({ image, category }: ActivityImageProps) => {
    const categoryImage = () => {
        // SPORTS, STUDY, DINING, LEISURE, OTHERS
        switch(category) {
            case "SPORTS":
                return (
                    <div className="flex w-full aspect-video items-center justify-center bg-red-200">
                        <MdSportsBasketball className="size-20"/>
                    </div>
                )
            case "STUDY":
                return (
                    <div className="flex w-full aspect-video items-center justify-center bg-green-200">
                        <GiNotebook className="size-20"/>
                    </div>
                )
            case "DINING":
                return (
                    <div className="flex w-full aspect-video items-center justify-center bg-blue-200">
                        <MdFastfood className="size-20"/>
                    </div>
                )
            case "LEISURE":
                return (
                    <div className="flex w-full aspect-video items-center justify-center bg-yellow-200">
                        <IoGameController className="size-20"/>
                    </div>
                )
            case "OTHERS":
                return (
                    <div className="flex w-full aspect-video items-center justify-center bg-fuchsia-200">
                        <FaPeopleGroup className="size-20"/>
                    </div>
                )
        }
    }

    if (image && image !== "") {
        return (
            <img src={image}></img>
        );
    }

    return (
        <div>
            {categoryImage()}
        </div>
    )
}

export default ActivityImage;