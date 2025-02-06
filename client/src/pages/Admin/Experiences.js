import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ReloadData, ShowLoading } from '../../redux/rootSlice';
import axios from 'axios';

function Experiences() {
    const dispatch = useDispatch();
    const { portfolioData } = useSelector((state) => state.root);
    const { experience } = portfolioData;
    const [showAddEditModel, setShowAddEditModel] = useState(false);
    const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
    const [type, setType] = React.useState('add');

    const onFinish = async (values) => {
        try {
            dispatch(ShowLoading());
            let response;
            if (selectedItemForEdit) {
                response = await axios.post("https://mern-portfolio-iuun.onrender.com/api/portfolio/update-experience", {
                    ...values,
                    _id: selectedItemForEdit._id,
                });
            } else {
                response = await axios.post("https://mern-portfolio-iuun.onrender.com/api/portfolio/add-experience", values);
            }

            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                setShowAddEditModel(false);
                setSelectedItemForEdit(null);
                dispatch(HideLoading());
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const onDelete = async (item) => {
        try {
            dispatch(ShowLoading());
            const response = await axios.post("/api/portfolio/delete-experience", {
                _id: item._id,
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                dispatch(HideLoading());
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }

        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    return (
        <div>
            <div className="flex justify-end ">
                <button className='bg-primary px-5 py-2 text-white' onClick={() => {
                    setSelectedItemForEdit(null);
                    setShowAddEditModel(true);
                }}>Add Experience</button>
            </div>
            <div className="grid grid-cols-4 gap-5 max-sm:grid-cols-1">
                {experience.map((exp) => (
                    <div key={exp.id} className='shadow border border-gray-400 p-5 '>
                        <h1 className='text-cyan-500 text-xl font-bold '>{exp.period}</h1>
                        <hr />
                        <h1 className='mt-5'>Company: {exp.company}</h1>
                        <h1 className='mt-3'>Title: {exp.title}</h1>
                        <h1 className='mt-3'>{exp.description}</h1>
                        <div className="flex justify-end gap-3 mt-5">
                            <button className='bg-cyan-500 text-primary px-5 py-2'
                                onClick={() => {
                                    onDelete(exp);
                                }}>Delete</button>
                            <button className='bg-primary text-white px-5 py-2' onClick={() => {
                                setSelectedItemForEdit(exp);
                                setShowAddEditModel(true);
                                setType('edit');
                            }}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
            {
                (type === 'add' ||
                selectedItemForEdit) && <Modal
                visible={showAddEditModel}
                title={selectedItemForEdit ? "Edit Experience" : "Add Experience"}
                footer={null}
                onCancel={() => {
                    setShowAddEditModel(false);
                    setSelectedItemForEdit(null);
                }}
            >
                <Form
                    layout='vertical'
                    onFinish={onFinish}
                    initialValues={selectedItemForEdit}
                >
                    <Form.Item name='period' label='Period' rules={[{ required: true, message: 'Please input the period!' }]}>
                        <Input placeholder='Period' />
                    </Form.Item>
                    <Form.Item name='company' label='Company' rules={[{ required: true, message: 'Please input the company!' }]}>
                        <Input placeholder='Company' />
                    </Form.Item>
                    <Form.Item name='title' label='Title' rules={[{ required: true, message: 'Please input the title!' }]}>
                        <Input placeholder='Title' />
                    </Form.Item>
                    <Form.Item name='description' label='Description' rules={[{ required: true, message: 'Please input the description!' }]}>
                        <Input placeholder='Description' />
                    </Form.Item>
                    <div className="flex justify-end">
                        <button className='border-primary text-primary px-5 py-2' onClick={() => {
                            setShowAddEditModel(false);
                            setSelectedItemForEdit(null);
                        }}>Cancel</button>
                        <button className='bg-primary text-white px-5 py-2' htmlType="submit">
                            {selectedItemForEdit ? "Update" : "Add"}
                        </button>
                    </div>
                </Form>
            </Modal>
            }
            
        </div>
    );
}

export default Experiences;
