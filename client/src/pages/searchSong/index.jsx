import { useSearchParams, useNavigate } from "react-router-dom";
import { search } from "../../service/search";
import { useEffect, useState } from "react";
import { Row, Col, Avatar } from "antd";
import "./search.scss"
import { AudioOutlined, HeartOutlined } from "@ant-design/icons";

function SearchSong() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get("keyword")
    const [data, setData] = useState()
    useEffect(() => {
        const object = {
            keyword: keyword
        }
        const fetchSong = async () => {
            const response = await search(object)
            if (response.status !== 200) {
                return
            }
            setData(response.data.data)
        }
        fetchSong()
    }, [keyword])
    console.log(data)
    return (
        <>
            <h1>Kết quả tìm kiếm</h1>
            <hr />
            <h2>Bài hát</h2>
            <Row gutter={[20, 20]}>
                {data?.map((item) =>
                (
                    <>
                        <Col onClick={() => navigate(`/songs/${item.slug}`)} key={item.id} span={12}>
                            <div className="song__item">
                                <div className="song__item--avatar">
                                    <Avatar src={item.avatar} shape="square"
                                        size={50} />
                                </div>
                                <div className="song__item--infor">
                                    <p>{item.title}</p>
                                    {item?.listSinger.map(singer => (
                                        <>
                                            <span> {singer.fullName} </span>
                                        </>
                                    ))}
                                </div>
                                <div className="part__right">
                                    <span className="part__right--icon">
                                        <AudioOutlined/>
                                        <HeartOutlined/>
                                    </span>
                                    <span>3:54</span>
                                </div>
                            </div>

                        </Col>
                    </>
                )
                )}
            </Row>
        </>
    )
}

export default SearchSong