import { useEffect, useState } from 'react';
import { Carousel, Card, Row, Col, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getTopic } from '../../service/topic';
import './topicMusix.scss';

function Topic() {
    const navigate = useNavigate();
    const [topic, setTopic] = useState([]); // State lưu trữ danh sách chủ đề
    const [loading, setLoading] = useState(true); // State để hiển thị loading
    const [error, setError] = useState(null); // State để xử lý lỗi

    // Fetch dữ liệu chủ đề
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const result = await getTopic();
                setTopic(result.data.data); // Cập nhật dữ liệu vào state
            } catch (error) {
                console.error('Lỗi khi tải chủ đề:', error);
                setError('Không thể tải dữ liệu chủ đề. Vui lòng thử lại sau.'); // Hiển thị thông báo lỗi
                message.error('Không thể tải dữ liệu chủ đề. Vui lòng thử lại sau.');
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };
        fetchTopics();
    }, []);

    // Chia danh sách chủ đề thành các nhóm nhỏ (mỗi nhóm 4 phần tử)
    const chunkedTopics = [];
    for (let i = 0; i < topic.length; i += 4) {
        chunkedTopics.push(topic.slice(i, i + 5));
    }

    // Hiển thị loading nếu đang fetch dữ liệu
    if (loading) {
        return <Spin size="large" className="loading-spinner" />;
    }

    // Hiển thị thông báo lỗi nếu có lỗi
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <Card className="card__topic" title="CHỦ ĐỀ" style={{ color: '#000' }}>
            <Carousel dots={false} arrows draggable>
                {chunkedTopics.map((group, index) => (
                    <div key={index}>
                        <Row gutter={[16, 16]} justify="space-evenly">
                            {group.map((item) => (
                                <Col key={item.id} xs={12} sm={8} md={6} lg={4}>
                                    <Card
                                        className="card__topic--inner"
                                        hoverable
                                        onClick={() => navigate(item.slug)}
                                        cover={<img alt={item.title} src={item.avatar} />}
                                    >
                                        <Card.Meta title={item.title} description={item.description} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
            </Carousel>
        </Card>
    );
}

export default Topic;