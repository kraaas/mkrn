import React from 'react';
import { Link } from 'react-router';
import { Button, Icon, Menu, Dropdown, Modal, message } from 'antd';
import ProjectStore from '../../stores/project';

class ProjectDetailApi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectUrl: this.props.params.url,
            list: []
        }
    }
    componentWillMount() {
        ProjectStore.getTaskList(this.state.projectUrl, (err, list) => {
            if (err) {
                message.error(err, 3);
                return;
            }
            this.setState({
                list: list || []
            })
        })
    }
    render() {
        
        let _id = this.props.params.id;
        let listItems = this.state.list.map((item, index) => {
            return (
                <li className="item" key={item._id}>
                    <p>
                        <span className="name">{item.title}</span> 
                        <span className="time">{item.startTime.substr(0, 10)}--{item.endTime.substr(0, 10)}</span>
                    </p>
                    <p>
                        <Link to={`/u/${item.owner._id}`}>
                            <span className="owner">{item.owner.username}</span>
                        </Link>
                    </p>
                </li>
            )
        });
        return (
            <div className="api-module">
                <div className="api-list-wrap">
                    <div className="header">
                        <span className="api-count">共{this.state.list.length}项</span>
                        <Link to={{ pathname: 'addtask', query: { projectUrl: this.state.projectUrl } }}>
                            <span className="api-add" title="添加任务"><Icon type="plus" /></span>
                        </Link>
                    </div>
                    <ul className="list">
                        {listItems}
                    </ul>
                </div>
            </div>
        )
    }
}
export default ProjectDetailApi;
