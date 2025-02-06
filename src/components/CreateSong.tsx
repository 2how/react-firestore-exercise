import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "../hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Slider } from "@/components/ui/slider"
import { db } from '../db/firestore';
import { addDoc, collection } from "firebase/firestore"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  albumCover: z.string().url("Must be a valid URL"),
  lyrics: z.string().min(10, "Lyrics must be at least 10 characters"),
  releaseDate: z.date({
    required_error: "Release date is required.",
  }),
  duration: z.number().min(1, "Duration must be at least 1 second").max(900, "Duration cannot exceed 15 min"),
  genre: z.string().min(1, "Genre is required"),
})

type FormData = z.infer<typeof formSchema>

export function CreateSongForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      albumCover: "",
      lyrics: "",
      duration: 180, // Default to 3 minutes
      genre: "",
    },
  })

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    
    try {
      const songData = {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const songsCollection = collection(db, 'songs');
      
      const docRef = await addDoc(songsCollection, songData);
      
      console.log("Song added with ID: ", docRef.id);
      
      form.reset();
      toast({
        title: "Song Created",
        description: "Your song has been successfully added to the database.",
      });
    } catch (error) {
      console.error("Error adding song: ", error);
      toast({
        title: "Error",
        description: "Failed to add song to the database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Song Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="albumCover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Cover URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter album cover URL" {...field} />
                  </FormControl>
                  <FormDescription>Enter a valid URL for the album cover image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter song genre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Release Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (in seconds)</FormLabel>
                  <FormControl>
                    <div className="space-y-1">
                        <Slider
                          min={1}
                          max={900}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      <div className="text-right text-sm text-muted-foreground">
                        {Math.floor(field.value / 60)}:{(field.value % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="lyrics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lyrics</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the full lyrics of the song" className="min-h-[200px]" {...field} />
                </FormControl>
                <FormDescription>Enter the complete lyrics of the song</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Song..." : "Create Song"}
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  )
}

