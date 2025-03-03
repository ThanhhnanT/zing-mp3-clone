import { Row, Col, Form, Input, Upload, Button, Select, message, Radio } from "antd"
import { Editor } from "@tinymce/tinymce-react"
import { useEffect, useRef, useState } from "react"
import { PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { tinyConfig } from "../../../config/tinymce"
import { allSinger, allTopic, createSong, createSong2 } from "../../../service/admin/getSong"
import { useNavigate } from "react-router-dom"

function AddSong() {
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage()
    const [form] = Form.useForm()
    const editorRef = useRef()
    const [loading, setLoading] = useState(false)
    const [singer, setSinger] = useState(false)
    const [topic, setTopic] = useState(false)
    useEffect(() => {
        try {
            const fetchSingerTopic = async () => {
                const resSinger = await allSinger()
                const resTopic = await allTopic()
                setSinger(resSinger.data.data)
                setTopic(resTopic.data.data)
            }
            fetchSingerTopic()
        } catch (e) {
            console.log(e)
        }
    }, [])
    // State cho ảnh đại diện
    const [fileList, setFileList] = useState([])

    // State cho file audio
    const [audioFileList, setAudioFileList] = useState([])
    const [audioPreview, setAudioPreview] = useState(null) // Lưu URL audio để preview

    // Xử lý upload ảnh
    const onImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1)) // Chỉ giữ 1 ảnh
    }

    // Xử lý upload audio + tạo preview
    const onAudioChange = ({ fileList: newFileList }) => {
        setAudioFileList(newFileList.slice(-1)) // Chỉ giữ 1 file

        // Tạo URL để phát audio
        const file = newFileList[0]?.originFileObj
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setAudioPreview(objectUrl)
        }
    }

    const handleCreate = async (value) => {
        try {
            setLoading(true)
            const formData = new FormData
            formData.append("avatar", fileList[0]?.originFileObj)
            formData.append("audio", audioFileList[0]?.originFileObj)
            // console.log(formData)
            const response = await createSong(formData)
            // console.log(response)
            const avatarURL = response.data.avatar
            const audioURL = response.data.audio
            const title = value.title
            const description = value.description.level.content
            const singerId = value.singerId
            const topicId = value.topicId
            const status = value.status
            const lyrics= value.lyrics
            const song = {
                title: title,
                description: description,
                avatar: avatarURL,
                audio: audioURL,
                singerId: singerId,
                topicId: topicId,
                status: status,
                lyrics: lyrics
            }
            await createSong2(song)
            await messageApi.success("Tạo bài hát mới thành công")
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            navigate("/admin")
        }
    }
    useEffect(() => {
        return () => {
            if (audioPreview) URL.revokeObjectURL(audioPreview);
        };
    }, [audioPreview]);
    return (
        <>
            {contextHolder}
            <div className="container">
                <h1>Thêm bài hát mới</h1>
                <Form onFinish={handleCreate} form={form} layout="vertical">
                    <Row gutter={[20, 20]}>
                        <Col span={12}>
                            <Form.Item label="Tên bài hát" name='title' rules={[{ required: true }]}>
                                <Input placeholder="Nhập tên bài hát" />
                            </Form.Item>

                            <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
                                <Editor
                                    apiKey={import.meta.env.VITE_REACT_APP_API_TINY}
                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                    initialValue=""
                                    init={tinyConfig}
                                />
                            </Form.Item>
                            <Form.Item label="Lyrics" name="lyrics" rules={[{ required: true }]}>
                                <Input.TextArea rows={6}>

                                </Input.TextArea>
                            </Form.Item>
                            <Form.Item
                                label="Ca sĩ"
                                name="singerId"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Chọn ca sĩ">
                                    {singer && singer.map(item => (
                                        <Select.Option key={item._id} value={item._id}>{item.fullName}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Chủ đề"
                                name="topicId"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Chọn chủ đề">
                                    {topic && topic.map(item => (
                                        <Select.Option key={item._id} value={item._id}>{item.title}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true }]}
                            >
                                <Radio.Group >
                                    <Radio checked key="active" value="active">Hoạt động</Radio>
                                    <Radio key="non-active" value="non-active">Dừng hoạt động</Radio>
                                </Radio.Group>
                            </Form.Item>
                            
                            <Button htmlType="submit" type="primary" loading={loading}>
                                Tạo mới
                            </Button>
                        </Col>

                        <Col span={11} offset={1}>
                            {/* Upload ảnh */}
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onImageChange}
                                maxCount={1}
                            >
                                {fileList.length >= 1 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Cập nhật ảnh</div>
                                    </div>
                                )}
                            </Upload>
                            <br />
                            {/* Upload file audio */}
                            <Form.Item label="">
                                <Upload
                                    fileList={audioFileList}
                                    beforeUpload={() => false} // Ngăn tự động upload
                                    onChange={onAudioChange}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Chọn file audio</Button>
                                </Upload>
                            </Form.Item>

                            {/* Hiển thị trình phát nhạc nếu có file */}
                            {audioPreview && (
                                <audio controls>
                                    <source src={audioPreview} type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ audio.
                                </audio>
                            )}
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default AddSong
