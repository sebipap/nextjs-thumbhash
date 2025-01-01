import Image from './components/image'

export default function Home() {
  const images = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    'https://images.unsplash.com/photo-1682687981674-0927add86f2b',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff',
  ]

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-screen w-full grid grid-cols-2 grid-rows-2">
        {images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`Example image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ))}
      </div>
    </div>
  )
}
