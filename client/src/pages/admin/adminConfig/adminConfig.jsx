import { Form, Checkbox, Row, Col, Upload, message, Image, Button, Select } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { upAvatar } from "../../../service/user";
import { setConfig } from "../../../service/admin/config";
import { useAuth } from "../../../auth/authContext";
import "./adminConfig.scss"

function AdminConfig() {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [change, setChange] = useState(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fileListIcon, setFileListIcon] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useAuth()
    useEffect(() => {
        if (theme && Object.keys(theme).length > 0) {
            form.setFieldsValue(theme);

            if (theme.avatar) {
                setFileList([
                    {
                        uid: "-1",
                        name: "avatar.png",
                        status: "done",
                        url: theme.avatar,
                    },
                ]);
            }
            if (theme.icon) {
                setFileListIcon([
                    {
                        uid: "-2",
                        name: "icon.png",
                        status: "done",
                        url: theme.icon,
                    },
                ]);
            }
        }
    }, [theme, form])

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const [previewType, setPreviewType] = useState(null);
    console.log(previewType)
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1)); // Chỉ giữ lại 1 ảnh
    };
    const onChangeIcon = ({ fileList: newFileList }) => {
        setFileListIcon(newFileList.slice(-1)); // Chỉ giữ lại 1 ảnh
    };


    const onPreview = async (file, type) => {
        let previewSrc = file.url || file.preview;

        if (!previewSrc) {
            previewSrc = await getBase64(file.originFileObj);
        }

        setPreviewImage(previewSrc);
        setPreviewType(type);
        setPreviewOpen(true);
    };


    const handleConfig = async (values) => {
        try {
            setLoading(true);

            let avatarUrl = fileList[0]?.url || "";
            let iconUrl = fileListIcon[0]?.url || "";

            if (fileList.length > 0 && fileList[0]?.originFileObj) {
                const formData = new FormData();
                formData.append("avatar", fileList[0].originFileObj);

                const uploadAvatar = await upAvatar(formData);
                avatarUrl = uploadAvatar.data.avatar;
            }

            if (fileListIcon.length > 0 && fileListIcon[0]?.originFileObj) {
                const formDataIcon = new FormData();
                formDataIcon.append("avatar", fileListIcon[0].originFileObj);

                const uploadIcon = await upAvatar(formDataIcon);
                iconUrl = uploadIcon.data.avatar; // Cần sửa API nếu trả về khác
            }

            const dataSubmit = { ...values, avatar: avatarUrl, icon: iconUrl };
            console.log("Submitting data:", dataSubmit);

            const res = await setConfig(dataSubmit);
            if (res.status !== 200) {
                messageApi.error("Lỗi cập nhật");
                return;
            }

            messageApi.success("Cập nhật thành công");
        } catch (e) {
            messageApi.error(`Lỗi: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="container">
                {contextHolder}
                <Checkbox
                    checked={!change}
                    onChange={(e) => setChange(!e.target.checked)}
                    className="checkbox"
                >
                    Chỉnh sửa
                </Checkbox>
                <Form
                    form={form}
                    disabled={change}
                    layout="vertical"
                    onFinish={handleConfig}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="colorTheme"
                                label="Màu chủ đề"
                                rules={[{ required: true, message: "Vui lòng chọn màu chủ đề" }]}
                            >
                                <Select placeholder="Chọn màu chủ đề">
                                    <Select.Option value="#6a0dad">
                                        <div className="color-option">
                                            <div className="color-box purple"></div>
                                            Tím
                                        </div>
                                    </Select.Option>
                                    <Select.Option value="#FF6C37">
                                        <div className="color-option">
                                            <div className="color-box red"></div>
                                            Cam
                                        </div>
                                    </Select.Option>
                                    <Select.Option value="#009DDC">
                                        <div className="color-option">
                                            <div className="color-box blue"></div>
                                            Xanh
                                        </div>
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {loading ? "Đang cập nhật..." : "Cập nhật trang"}
                            </Button>
                        </Col>
                        <Col span={10} offset={1} className="change__avatar">
                            <ImgCrop rotationSlider>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={(file) => onPreview(file, "avatar")}
                                    onChange={onChange}
                                    maxCount={1}
                                >
                                    {fileList.length >= 1 ? null : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Cập nhật avatar</div>
                                        </div>
                                    )}
                                </Upload>
                            </ImgCrop>
                            <br />
                            <ImgCrop rotationSlider>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileListIcon}
                                    onPreview={(file) => onPreview(file, "icon")}
                                    onChange={onChangeIcon}
                                    maxCount={1}
                                >
                                    {fileListIcon.length >= 1 ? null : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Cập nhật icon</div>
                                        </div>
                                    )}
                                </Upload>
                            </ImgCrop>

                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: "none" }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                            !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
}

export default AdminConfig;
