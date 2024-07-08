"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getUserId } from "@/lib/generalActions"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const formSchema = z.object({
    picture: z.instanceof(FileList).optional()
//    .refine((file) => {
//      if (file.size === 0 || file.name === undefined) return false;
//      else return true;
//    }, "Please update or add new image.")
//
//    .refine(
//      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
//      ".jpg, .jpeg, and .png files are accepted."
//    )
//    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
})

const ImageForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const fileRef = form.register('picture');

    const { setError } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) : Promise<void> {
        const id: string = await getUserId();
        const key: string | undefined = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
        const secKey: string | undefined = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
        console.log(key);
        console.log(secKey);
        if (key === undefined || secKey === undefined) {
            console.error('AWS Keys are not properly setup in the .env');
            return;
        } 
        const client = new S3Client({
            region: 'ap-southeast-1',
            credentials: {
                accessKeyId: key,
                secretAccessKey: secKey
            }
        }); 
        const response = await client.send(new PutObjectCommand({
            Bucket: 'adventus-orbital',
            Key: 'user-images/' + id,
            Body: values.picture?.[0]
        }));
        console.log(response);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full items-center gap-[12px]">
                <FormField
                    control={form.control}
                    name="picture"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Picture</FormLabel>
                            <FormControl>
                            <div className="flex-col w-full max-w-sm items-center gap-1.5">
                                <Input id="picture" type="file" {...fileRef} />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Submit profile picture</Button>
            </form>
        </Form>
    )
}

export default ImageForm