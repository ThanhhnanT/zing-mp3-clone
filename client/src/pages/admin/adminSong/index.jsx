import "./adminSong.scss";
import { Table, Avatar, Tag, Button, message } from "antd";
import { useState, useEffect } from "react";
import { changeStatus, getSongAdmin } from "../../../service/admin/getSong";
import { PlusOutlined } from "@ant-design/icons";
import Loading from "../../../components/Loading/Loading";
import { Link } from "react-router-dom";

function AdminSong() {
    const [messageApi, contectHolder] = message.useMessage()
    const [song, setSong] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const response = await getSongAdmin();
                const formattedData = response.data.data.map((item, index) => ({
                    ...item,
                    key: index + 1, // Thêm key là số thứ tự bắt đầu từ 1
                }));
                setSong(formattedData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }
    const changesStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const object = { id, status: newStatus };

            await changeStatus(object);
            setSong(prevSongs => prevSongs.map(song =>
                song._id === id ? { ...song, status: newStatus } : song
            ));

            messageApi.success("Cập nhật trạng thái thành công")
        } catch (e) {
            console.log(e)
            messageApi.success("Có lỗi xảy ra")
        }
    };
    const columns = [
        {
            key: "index",
            title: "",
            dataIndex: "key", // Lấy số thứ tự từ `key`
            align: "center",
            render: (text) => <strong>{text}</strong>,
        },
        {
            key: "avatar",
            title: "Hình ảnh",
            dataIndex: "avatar",
            render: (text) => <Avatar shape="square" src={text} alt="avatar" size={80} />,
        },
        {
            key: "title",
            title: "Tên bài hát",
            dataIndex: "title",
            render: (text, record) => (
                <>
                    <div className="song__infor">
                        <strong>{text}</strong>
                        <br />
                        <span>{record.singer.fullName}</span>
                    </div>
                </>
            )
        },
        {
            key: "status",
            title: "Trạng thái",
            dataIndex: "status",
            width: "15%",
            render: (text, record) => (
                <>
                    <Tag
                        color={text === "active" ? "success" : "error"}
                        style={{ cursor: "pointer" }}
                        onClick={() => changesStatus(record._id, text)}
                    >
                        {text === "active" ? "Hoạt động" : "Dừng hoạt động"}
                    </Tag>
                </>
            )
        },
        {
            key: "action",
            title: "Hành động",
            render: () => (
                <>
                    <div className="action">
                        <Button type="">
                            Chi tiết
                        </Button>
                        <Button type="">
                            Chỉnh sửa
                        </Button>
                        <Button type="">
                            Xóa
                        </Button>
                    </div>
                </>
            ),
        }
    ];

    return (
        <>
            {contectHolder}

            <div className="container">
                <div className="table__name">
                    <h1>Danh sách bài hát</h1>
                    <Link to="/admin/song/create">
                        <Button className="add__song" icon={<PlusOutlined />} type="primary">
                            Thêm mới
                        </Button>
                    </Link>
                </div>
                <Table dataSource={song} columns={columns} pagination={{ pageSize: 5 }} />
            </div>
        </>

    );
}

export default AdminSong;
