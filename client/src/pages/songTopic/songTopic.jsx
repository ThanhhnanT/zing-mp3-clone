import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Spin, Button, Avatar, Image, Table, Tag } from 'antd'
import { getSongTopic } from '../../service/topic'
import { Link } from 'react-router-dom'
import './songTopic.scss'
function SongTopic() {
    const params = useParams().slugSong
    const [loading, setLoading] = useState(false)
    const [topic, setTopic] = useState([])
    const [song, setSong] = useState([])
    useEffect(() => {
        const fetchSongTopic = async () => {
            if (!params) return;
            try {
                const response = await getSongTopic(params);
                setTopic(response.data.topic);
                setSong(response.data.song);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(true)
            }
        };

        fetchSongTopic();
    }, [params]);

    if (!loading) {
        return <Spin size="large" className="loading-spinner" />;
    }

    const tableColumns = [
        {
            key: "title",
            dataIndex: "title",
            title: "Bài hát",
            render: (text, record) => (
                <>
                    <Link to={`/songs/${record.slug}`}>
                        <div key={record.id} className='song container'>
                            <div className='song__avatar'>
                                <Avatar shape='square' size={60} src={record.avatar} />
                            </div>
                            <div className='song__name'>
                                <p className='song__name--title'>{text}</p>

                                <span className='song__name--singer'>{record.singer}</span>
                            </div>
                        </div>
                    </Link>
                </>
            )
        },
        {
            key: 'like',
            dataIndex: 'like',
            title: 'Lượt thích',
            render: (number) => (
                <Tag color="magenta"> {number}</Tag>
            )
        }

    ]
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={6}>
                    <div className='topic'>
                        <div className='topic__image'>
                            <Image width={250} src={topic.avatar} alt={topic.title} />
                        </div>
                        <div className='topic__title'>
                            <p>{topic.title}</p>
                            <p>{topic.description}</p>
                            <Button> Phát ngẫu nhiên </Button>
                        </div>
                    </div>
                </Col>

                <Col span={18}>
                    <Table columns={tableColumns} dataSource={song} />
                </Col>
            </Row>
        </>
    )
}

export default SongTopic