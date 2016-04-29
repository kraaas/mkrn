import React from 'react';
import { Link} from 'react-router';
import { Button, Icon, Menu, Dropdown, Modal, message, Badge } from 'antd';
import ProjectStore from '../../stores/project';

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {},
            url: this.props.params.url
        };
    }
    componentWillMount() {
        ProjectStore.getDetail(this.state.url, (err, detail) => {
            this.setState({
                detail: detail
            })
        })
    }
    componentDidMount(){
        document.title = '项目详情';
    }
    removeProject(){
        let remove =  () => {
            ProjectStore.reomve(this.state.detail._id, (err, res) => {
                if(!err){
                    message.success('删除成功!', 3)
                    this.props.history.replace({ pathname: 'project' })
                }
            })
        }
        Modal.confirm({
            title: '警告',
            content: '是否删除改项目，不可恢复！',
            okText: '删除',
            cancelText: '取消',
            onOk: remove
        });
    }
    editProject(){
        this.props.history.replace({ pathname: 'editProject' , state: this.state.detail })
    }
    render() {
        let detail = this.state.detail;
        const editMenu = (
          <Menu>
            <Menu.Item key="1">
                <span onClick={this.editProject.bind(this)}>修改</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" >
                <span onClick={this.removeProject.bind(this)}>删除</span>
            </Menu.Item>
          </Menu>
        );
        return (
            <div className="project-detal">
                <div className="pro-navbar-wrap">
                    <div className="main-wrap">
                        <img className="detail-icon" src='https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png' alt="项目icon"/>
                        <div className="detail-info">
                            <p className="name">{detail.name}</p>
                            <p>创建日期： {detail.createDate && detail.createDate.substr(0, 10)}</p>
                            <p className="detail-text">{detail.detail || '暂无描述'}</p>
                        </div>
                        
                        <Dropdown overlay={editMenu} type="ghost" trigger={['click']}>
                            <div className="edit-btn">
                                <Button type="ghost" shape="circle" title="修改">
                                    <Icon type="setting" size="small"/>
                                </Button>
                            </div>
                        </Dropdown>
                        <ul className="pro-navbar">
                            <li><Link to={`project/${detail.url}/apis`} activeClassName={"active"}><span>接口列表<Badge count={25} /></span></Link></li>
                            <li><Link to={`project/${detail.url}/tasks`} activeClassName={"active"}>任务列表<Badge count={20} /></Link></li>
                            <li><Link to={`project/${detail.url}/members`} activeClassName={"active"}>项目成员<Badge count={10} /></Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pro-modules">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
export default ProjectDetail;
