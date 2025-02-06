import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { db } from '../db/firestore';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, orderBy, query } from "firebase/firestore"

interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  lyrics: string;
  lyricsPreview: string;
  duration: number;
  genre: string;
  createdAt: Date;
}

const fetchSongs = async (): Promise<Song[]> => {
  const songsQuery = query(
    collection(db, 'songs'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(songsQuery);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    
    return {
      id: doc.id,
      title: data.title,
      artist: data.artist,
      albumCover: data.albumCover,
      lyrics: data.lyrics,
      lyricsPreview: data.lyrics,
      duration: data.duration,
      genre: data.genre,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Song;
  });
};

export default function ResponsiveSongList() {

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const { data: songs = [], isLoading, isError } = useQuery<Song[], Error>({
    queryKey: ['songs'],
    queryFn: fetchSongs,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-extrabold tracking-tight">Loading...</h1>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-extrabold tracking-tight">Something went wrong loading the songs.</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
        <ScrollArea className="h-full w-full pr-4">
          {songs.map((song) => (
            <Card key={song.id} className="mb-4 cursor-pointer hover:bg-accent" onClick={() => setSelectedSong(song)}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={song.albumCover} alt={`${song.title} album cover`} />
                  <AvatarFallback>{song.title[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{song.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
        {selectedSong && (
          <div className="hidden md:block md:col-span-1 lg:col-span-2 xl:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedSong.albumCover} alt={`${selectedSong.title} album cover`} />
                    <AvatarFallback>{selectedSong.title[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{selectedSong.title}</CardTitle>
                    <p className="text-xl text-muted-foreground">{selectedSong.artist}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Lyrics Preview</h3>
                <p className="text-muted-foreground whitespace-pre-line break-words">{selectedSong.lyricsPreview}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <span className="sr-only">Open song details</span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {selectedSong && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSong.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedSong.albumCover} alt={`${selectedSong.title} album cover`} />
                    <AvatarFallback>{selectedSong.title[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedSong.title}</h3>
                    <p className="text-muted-foreground">{selectedSong.artist}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Lyrics Preview</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line break-words">{selectedSong.lyricsPreview}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

