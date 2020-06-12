import {Context, Handler} from 'aws-lambda';
import ytdl from 'ytdl-core'
import fs from 'fs'

interface ReqEvent {
    url: string;
    startTime: String;
    endTime: String;
}

interface Res {
    statusCode: number;
    body: any | String;
}

export const handler:Handler<ReqEvent, Res> = async (event: ReqEvent, context:Context) :Promise<Res> => {
    try {
        const { url, startTime, endTime } = event;

        // Video Download
        const video = ytdl(url).pipe(fs.createWriteStream('video.flv'));

        return {
            statusCode: 200,
            body: { video },
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: err.message,
        };
    }

    //to Gif Conversion
};

