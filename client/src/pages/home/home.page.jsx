import { getTop } from "../../service/song";
import { useState, useEffect } from "react";
import { Card, Row, Col, Avatar, Button } from 'antd';
import { Line } from "@ant-design/plots";
import './home.scss'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate()
    const [mapData, setMapData] = useState([]);
    const [datas, setData] = useState([])
    useEffect(() => {
        const fetchTop = async () => {
            try {
                const response = await getTop();
                const data = response.data.data;
                // Tính tổng lượt nghe ngay lập tức từ data mới
                const totalSum = data.reduce((total, item) => total + item.totalListen, 0);

                // Tạo mảng mới có percent
                const updatedData = data.map(item => ({
                    ...item,
                    percent: totalSum > 0 ? (item.totalListen / totalSum).toFixed(2) * 100 : 0
                }));
                setData(updatedData);

                const mapDataChart = [];
                data.forEach((item) => {
                    item.listenByHour.forEach((listen) => {
                        mapDataChart.push({
                            song: item.title,
                            singer: item.singer.fullName,
                            time: listen.timestamp,
                            count: listen.count,
                        });
                    });
                });

                setMapData(mapDataChart);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchTop();
    }, []);
    const data = [
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 00:00', count: 15 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 01:00', count: 19 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 02:00', count: 20 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 03:00', count: 18 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 04:00', count: 22 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 05:00', count: 17 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 06:00', count: 21 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 07:00', count: 16 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 08:00', count: 19 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 09:00', count: 20 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 10:00', count: 18 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 11:00', count: 22 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 12:00', count: 17 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 13:00', count: 21 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 14:00', count: 16 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 15:00', count: 19 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 16:00', count: 20 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 17:00', count: 18 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 18:00', count: 22 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 19:00', count: 17 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 20:00', count: 21 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 21:00', count: 16 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 22:00', count: 19 },
        { song: 'Rượu Mừng Hóa Người Dưng', singer: 'TLong', time: '26:02:2025 23:00', count: 20 },

        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 00:00', count: 10 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 01:00', count: 11 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 02:00', count: 12 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 03:00', count: 9 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 04:00', count: 14 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 05:00', count: 8 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 06:00', count: 13 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 07:00', count: 10 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 08:00', count: 12 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 09:00', count: 11 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 10:00', count: 9 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 11:00', count: 14 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 12:00', count: 8 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 13:00', count: 13 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 14:00', count: 10 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 15:00', count: 12 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 16:00', count: 11 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 17:00', count: 9 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 18:00', count: 14 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 19:00', count: 8 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 20:00', count: 13 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 21:00', count: 10 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 22:00', count: 12 },
        { song: 'Ngày Mai Người Ta Lấy Chồng', singer: 'Thành Đạt', time: '26:02:2025 23:00', count: 11 },

        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 00:00', count: 5 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 01:00', count: 13 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 02:00', count: 2 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 03:00', count: 7 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 04:00', count: 3 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 05:00', count: 6 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 06:00', count: 4 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 07:00', count: 5 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 08:00', count: 8 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 09:00', count: 7 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 10:00', count: 6 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 11:00', count: 3 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 12:00', count: 5 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 13:00', count: 4 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 14:00', count: 7 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 15:00', count: 8 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 16:00', count: 6 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 17:00', count: 5 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 18:00', count: 3 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 19:00', count: 7 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 20:00', count: 4 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 21:00', count: 6 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 22:00', count: 8 },
        { song: 'Cắt Đôi Nỗi Sầu', singer: 'Tăng Duy Tân', time: '26:02:2025 23:00', count: 7 }
    ];
    console.log(mapData)
    console.log(datas)
    const config = {
        data: data,
        height: 400,
        xField: "time",
        yField: "count",
        colorField: "song",
        lineStyle: {
            lineWidth: 10,
            smooth: true,
        },

    };

    return (
        <>
            <div>
                <h1>Trang chủ</h1>
            </div>
            <Card
                title="Bảng xếp hạng"
            >
                <Row>
                    <Col span={9}>
                        <div className="list__song">
                            {datas.map((item, index) => (
                                <>
                                    <div onClick={() => navigate(`songs/${item.slug}`)} key={item.id} className="top--song">
                                        <div className="top--song__index">
                                            <strong className={"top--song__index" + index}>{index + 1}</strong>
                                        </div>
                                        <div className="top--song__image">
                                            <Avatar size={50} src={item.avatar} alt={item.title} shape="square" />
                                        </div>
                                        <div className="top--song__infor">
                                            <strong>{item.title}</strong>
                                            <br />
                                            <span>{item.singer.fullName}</span>
                                        </div>
                                        <div className="top--song__percentage">
                                            <strong>{item.percent}%</strong>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                        <div className="button">
                            <Button className="button__more" type=''>
                                Xem thêm
                            </Button>
                        </div>
                    </Col>
                    <Col span={15}>
                        {mapData.length > 0 ? <Line {...config} /> : <p>Loading...</p>}
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default Home;
