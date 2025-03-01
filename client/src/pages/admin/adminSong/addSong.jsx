import { Row, Col, Form, Input, Select } from "antd"
import { Editor } from "@tinymce/tinymce-react"
import { useRef, useState, useEffect } from "react"
import { tinyConfig } from "../../../config/tinymce"

function AddSong() {
    const [form] = Form.useForm()
    const editorRef = useRef()
    return (
        <>
            <div className="container">
                <h1>Thêm bài hát mới</h1>
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Row gutter={[20, 20]}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên bài hát"
                                name='title'
                                rules={
                                    [
                                        {
                                            required: true
                                        }
                                    ]
                                }
                            >
                                <Input placeHolder="Tên bài hát" />
                            </Form.Item>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[{ required: true }]}
                            >
                                <Editor
                                    apiKey={import.meta.env.VITE_REACT_APP_API_TINY}
                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                    initialValue=""
                                    init={tinyConfig}
                                    />
                        </Form.Item>
                        <Form.Item
                            label="Ca sĩ"
                            name="singerId"
                            rules={[{required: true}]}
                        >
                            <Select placeholder="Chọn ca sĩ">
                                <Select.Option value="ok">
                                    Singer
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Chủ đề"
                            name="topicId"
                            rules={[{required: true}]}
                        >
                            <Select placeholder="Chọn chủ đề">
                                <Select.Option value="ok">
                                    Singer
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div >
        </>
    )
}

export default AddSong