import React from 'react';
import Codemirror from 'react-codemirror/lib/Codemirror';
require('codemirror/mode/javascript/javascript');
require('codemirror/theme/monokai.css');
import { Form, Input, Button, Radio, Select, Upload, Icon, Alert, message } from 'antd';
import ApiStore from "../../stores/api";
import ProjectStore from "../../stores/project";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
class AddProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noAccessMembers: [],
            members: [],
            detail: this.props.location.state || {},
            projectUrl: this.props.location.query.projectUrl
        };
        this.isEdit = !!this.state.detail.name;
    }
    componentDidMount() {
        document.title = this.isEdit ? '修改接口' : '创建新接口';
        if (this.isEdit) {
            this.props.form.setFieldsValue(this.state.detail)
        }
        this.getMembers();
    }
    getMembers() {
        ProjectStore.getMemberList(this.state.projectUrl, (err, members) => {
            if (!err) {
                this.setState({
                    members: members
                })
            }
        })
    }
    submit(e) {
        e.preventDefault();
        let apiInfo = this.props.form.getFieldsValue(['name', 'url', 'method', 'detail']);
        apiInfo.noAccessMembers = this.state.noAccessMembers;
        apiInfo.requestBody = this.state.requestBody || this.state.detail.requestBody;
        apiInfo.responseBody = this.state.responseBody || this.state.detail.responseBody;
        if (this.isEdit) {
            ApiStore.update(this.state.detail._id, apiInfo, (err, detail) => {
                if (err || !detail) {
                    message.error(err.response.text, 3)
                    return;
                }
                console.log(detail.belongTo.url);
                message.success(this.isEdit ? '修改成功！' : '添加成功！', 3);
                this.props.history.replace({ pathname: `project/${detail.belongTo.url}/apis/${detail._id}` })
            })
        } else {
            ApiStore.create(this.state.projectUrl, apiInfo, (err, detail) => {
                if (err || !detail) {
                    message.error(err.response.text, 3)
                    return;
                }
                message.success(this.isEdit ? '修改成功！' : '添加成功！', 3);
                this.props.history.replace({ pathname: `project/${this.state.projectUrl}/apis/${detail._id}` })
            })
        }

    }
    updateRequestBody(newValue) {
        this.setState({
            requestBody: newValue
        })
    }
    updateReponseBody(newValue) {
        this.setState({
            responseBody: newValue
        })
    }
    handleChange(value) {
        this.setState({
            noAccessMembers: value
        })
    }
    render() {
        let detail = this.state.detail;
        const options = {
            theme: "monokai",
            indentUnit: 4,
            lineNumbers: !0,
            mode: "text/javascript",
            matchBrackets: !0,
            autoCloseBrackets: !0,
        };
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let membersSelects = this.state.members.map((item) => {
            return (
                <Option key={item._id} value={item._id}>{item.username}</Option>
            )
        })
        return (
            <div className="main-wrap add-project add-api">
                <header className="header">
                    <span>{this.isEdit ? '修改接口' : '创建新接口'}</span>
                </header>
                <section>
                    <Form horizontal onSubmit={this.submit.bind(this)}>
                        <FormItem
                          {...formItemLayout}
                          label="接口名称：" required>
                          <Input type="text" {...getFieldProps('name')} placeholder="请输入项目名称"/>
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="请求方式：" required>
                          <RadioGroup {...getFieldProps('method', { initialValue: 'GET' })}>
                            <Radio value="GET">GET</Radio>
                            <Radio value="POST">POST</Radio>
                            <Radio value="PUT">PUT</Radio>
                            <Radio value="DELETE">DELETE</Radio>
                          </RadioGroup>
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="请求URL：" required>
                          <Input className="url-input" type="text" {...getFieldProps('url')}/>
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="请求参数：" required>
                          <Codemirror value={detail.requestBody && detail.requestBody[0]} onChange={this.updateRequestBody.bind(this)} options={options} />
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="响应模板：" required>
                          <Codemirror value={detail.responseBody && detail.responseBody[0]} onChange={this.updateReponseBody.bind(this)} options={options} />
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="无权限成员：">
                          <Select multiple
                            defaultValue={[]} 
                            onChange={this.handleChange.bind(this)}
                            searchPlaceholder="请选择项目成员">
                            {membersSelects}
                          </Select>
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          label="接口描述：">
                          <Input type="textarea" {...getFieldProps('detail')} placeholder="请输入接口描述"/>
                        </FormItem>
                        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            style={{width: '100%'}}>{this.isEdit ? '确认修改' : '立即添加'}</Button>
                        </FormItem>
                    </Form>
                </section>
                <div className="tip">
                    <Alert message="温馨提示"
                    description="项目成员可在成功添加项目继续添加或邀请未注册的成员！"
                    type="info"
                    showIcon />
                </div>
            </div>
        );
    }
}
AddProject = Form.create()(AddProject);
export default AddProject;
