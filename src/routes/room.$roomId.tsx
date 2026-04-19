import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { rooms } from "@/lib/game-data";
import { ScoreHud } from "@/components/ScoreHud";
import { RoomView } from "@/components/RoomView";

export const Route = createFileRoute("/room/$roomId")({
  loader: ({ params }) => {
    const room = rooms.find((r) => r.id === params.roomId);
    if (!room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.room.title ?? "חדר"} · מעבדה X23` },
      {
        name: "description",
        content: `חידה ${loaderData?.room.subtitle ?? ""} — פתרי כדי לצאת מהחדר.`,
      },
    ],
  }),
  component: RoomPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-4xl font-display font-black mb-4">חדר לא נמצא</h1>
        <Link to="/" className="text-primary text-glow-cyan underline">
          חזרה למסדרון
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="text-destructive mb-4">{error.message}</p>
        <Link to="/" className="text-primary text-glow-cyan underline">
          חזרה למסדרון
        </Link>
      </div>
    </div>
  ),
});

function RoomPage() {
  const { room } = Route.useLoaderData();
  return (
    <>
      <ScoreHud />
      <RoomView room={room} />
    </>
  );
}
