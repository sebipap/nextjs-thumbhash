import Image from './components/image'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const q = (params as { q: string | undefined })?.q

  const images = [
    `https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=${q}  `,
    `https://images.unsplash.com/photo-1682687981674-0927add86f2b?q=${q}`,
    `https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=${q}`,
    `https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=${q}`,
  ]

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-screen w-full grid grid-cols-2 grid-rows-2 relative">
        {images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`Example image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ))}

        <form
          action=""
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <button
            type="submit"
            className="p-2 bg-white text-black rounded-md"
          >
            Reload
          </button>
          <input
            name="q"
            type="hidden"
            value={(Number((q as string) ?? 0) + 1).toString()}
          />
        </form>
      </div>
    </div>
  )
}
