import { useEffect, useRef, useState } from 'react';
import { AudioOutlined, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import { addListen, getSong } from '../../service/song';
import './song.scss';
import DOMPurify from 'dompurify';

function SongDetail() {
    const { slugSong } = useParams();
    const [data, setData] = useState(null);
    const playerRef = useRef(null);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await getSong(slugSong);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching song:", error);
            }
        };

        fetchSong();
    }, [slugSong]);
    console.log(data)

    useEffect(() => {
        if (!data) return;

        const ap = new APlayer({
            container: playerRef.current,
            autoplay: true,
            theme: '#6a0dad',
            listFolded: false,
            audio: [
                {
                    name: data.song.title,
                    artist: data.singer.fullName,
                    url: data.song.audio,
                    cover: data.song.avatar,
                }
            ]
        });

        ap.on("ended", async () => {
            try{
                console.log(data.song._id)
                await addListen({
                    id: data.song._id
                })
            } catch(e){
                return e.message
            }
        })

        return () => {
            ap.destroy();
        };
    }, [data]);

    if (!data) return <p>Loading...</p>; // Tránh lỗi khi data chưa có

    return (
        <>
            <div className='infor'>
                <div className='infor__singer'> 
                    <AudioOutlined /> {data.singer.fullName}
                </div>
                <div className='infor__like'> 
                    <HeartOutlined /> {data.song.like}
                </div>
                <div className='infor__topic'> 
                    <PlayCircleOutlined /> {data.topic.title}
                </div>
            </div>
            <div className='music'>
                <div className='music__name'>
                    <h2>{data.song.title}</h2>
                </div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.song.lyrics) }} />
            </div>
            <div className='song'>
                <div className='song__running' ref={playerRef}></div>
            </div>
        </>
    );
}

export default SongDetail;
