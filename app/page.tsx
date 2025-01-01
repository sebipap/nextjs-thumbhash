import Image from "./components/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 h-96">
        <Image
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
          alt="Example image"
        />
      </div>
    </div>
  );
}
